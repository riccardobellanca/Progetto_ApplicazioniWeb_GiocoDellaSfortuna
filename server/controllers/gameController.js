import * as gameDAO from "../dao/GameDAO.js";
import * as cardDAO from "../dao/CardDAO.js";
import * as roundDAO from "../dao/RoundDAO.js";

/**
 * Consente di iniziare la partita e restituirne i dati essenziali 
 */
export const createGame = async (req) => {
  try {
    const gameData = await startNewGame(req.user.userId);
    req.session.gameId = gameData.gameId;
    req.session.cardId = gameData.challengeCard.cardId;
    req.session.startTime = Date.now();

    return {
      success: true,
      data: {
        gameId: gameData.gameId,
        round: 1,
        cardsWon: 3,
        cardsLost: 0,
        status: "in_progress",
        hand: gameData.initialCards,
        challengeCard: gameData.challengeCard,
      },
    };
  } catch (error) {
    return {
      success: false,
      data: {
        code: error.code,
        message: error.message,
      },
    };
  }
};

/**
 * Consente di creare lo stato di gioco e restituire tutte le informazioni necessarie al Game 
 */
const startNewGame = async (userId) => {
  const game = await gameDAO.saveGame(userId);
  const cards = await cardDAO.getAllCards();
  const shuffled = cards.sort(() => Math.random() - 0.5);
  const initialCards = shuffled
    .slice(0, 3)
    .sort((a, b) => a.misfortuneIndex - b.misfortuneIndex);

  for (const card of initialCards) {
    await roundDAO.saveRound(card.cardId, 0, true, game.gameId);
  }

  const challengeCard = shuffled[3];

  return {
    gameId: game.gameId,
    initialCards,
    challengeCard: removeIndex(challengeCard),
  };
};

/**
 * Consente di ricevere una risposta sulla correttezza del tentativo effettuato dall'utente
 */
export const submitGuess = async (req) => {
  try {
    const { position } = req.body;
    const gameId = req.session.gameId;
    let cardId = req.session.cardId;

    const gameState = await getGameState(gameId, cardId);

    let isTimeout =
      position === -1 ||
      (req.session.startTime !== undefined &&
        Date.now() - req.session.startTime > 30000);

    const result = await processGuess(
      gameId,
      gameState.currentCard,
      position,
      gameState.roundNumber,
      gameState.playerCards,
      gameState.failedAttempts,
      gameState.cardsWon,
      isTimeout
    );

    req.session.cardId =
      result.nextCard !== null ? result.nextCard.cardId : null;
    let nextChallengeCard =
      result.nextCard !== null ? removeIndex(result.nextCard) : null;

    return {
      success: true,
      data: {
        success: !isTimeout && result.isCorrect,
        cardDetails: !isTimeout && result.isCorrect ? result.cardDetails : null,
        gameStatus: result.gameStatus,
        round: result.newRoundNumber,
        cardsWon: result.cardsWon,
        cardsLost: result.failedAttempts,
        hand:
          !isTimeout && result.isCorrect
            ? result.updatedHand
            : gameState.playerCards,
        nextChallengeCard: nextChallengeCard,
      },
    };
  } catch (error) {
    console.error("Errore in submitGuess:", error);
    return {
      success: false,
      data: {
        code: error.code || 500,
        message: error.message,
      },
    };
  }
};

/**
 * Consente di determinare lo stato di gioco della partita in corso e restituisce tutte le informazioni di una carta
 */
const getGameState = async (gameId, cardId) => {
  const rounds = await roundDAO.getAllRoundsByGameId(gameId);

  const cardIds = rounds.filter((r) => r.isWon).map((r) => r.cardId);
  const playerCards = await Promise.all(
    cardIds.map((cardId) => cardDAO.getCardByCardId(cardId))
  );
  playerCards.sort((a, b) => a.misfortuneIndex - b.misfortuneIndex);

  const roundNumber = rounds.filter((r) => r.roundNumber > 0).length + 1;
  const failedAttempts = rounds.filter((r) => !r.isWon).length;
  const cardsWon = rounds.filter((r) => r.isWon).length;
  const status =
    cardsWon === 6 ? "won" : failedAttempts === 3 ? "lost" : "in_progress";

  const currentCard = await cardDAO.getCardByCardId(cardId);

  return {
    status,
    roundNumber,
    playerCards,
    failedAttempts,
    cardsWon,
    currentCard,
  };
};

/**
 * Consente di processare un tentativo di gioco
 */
const processGuess = async (
  gameId,
  currentCard,
  position,
  roundNumber,
  playerCards,
  failedAttempts,
  cardsWon,
  isTimeout
) => {
  const correctPosition = findCorrectPosition(
    playerCards,
    currentCard.misfortuneIndex
  );
  const isCorrect = !isTimeout && position === correctPosition;

  await roundDAO.saveRound(currentCard.cardId, roundNumber, isCorrect, gameId);

  let updatedHand = [...playerCards];
  let newCardsWon = cardsWon;
  let newFailedAttempts = failedAttempts;

  if (isCorrect) {
    updatedHand.splice(position, 0, currentCard);
    updatedHand.sort((a, b) => a.misfortuneIndex - b.misfortuneIndex);
    newCardsWon++;
  } else {
    newFailedAttempts++;
  }

  const totalCards = newCardsWon;
  let gameStatus = "in_progress";

  if (totalCards === 6) {
    gameStatus = "won";
  } else if (newFailedAttempts === 3) {
    gameStatus = "lost";
  }

  if (gameStatus !== "in_progress") {
    await gameDAO.updateGameStatus(
      gameId,
      gameStatus,
      newCardsWon,
      newFailedAttempts
    );
    return {
      isCorrect,
      correctPosition,
      cardDetails: currentCard,
      gameStatus,
      cardsWon: newCardsWon,
      failedAttempts: newFailedAttempts,
      updatedHand,
      newRoundNumber: roundNumber + 1,
      nextCard: null,
    };
  }

  const nextCard = await cardDAO.getNextCard(gameId);

  return {
    isCorrect,
    correctPosition,
    cardDetails: currentCard,
    gameStatus: "in_progress",
    cardsWon: newCardsWon,
    failedAttempts: newFailedAttempts,
    updatedHand,
    nextCard,
    newRoundNumber: roundNumber + 1,
  };
};

/**
 * Restituisce la posizione corretta di una carta, sulla base del suo misfortuneIndex e delle altre carte in mano 
 */
const findCorrectPosition = (cards, misfortuneIndex) => {
  let position = 0;
  for (let i = 0; i < cards.length; i++) {
    if (misfortuneIndex > cards[i].misfortuneIndex) {
      position = i + 1;
    } else {
      break;
    }
  }
  return position;
};

/**
 * Consente di rimuovere il misfortuneIndex di una carta 
 */
const removeIndex = (card) => ({
  cardId: card.cardId,
  name: card.name,
  imageUrl: card.imageUrl,
});

/**
 * Consente di inizializzare il timer, necessario per successivi controlli sul timeout 
 */
export const startGameTimer = (req) => {
  const { startTime } = req.body;
  req.session.startTime = startTime;
  return {
    success: true,
    data: {},
  };
};
