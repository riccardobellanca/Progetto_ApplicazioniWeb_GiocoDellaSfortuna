import * as gameDAO from "../dao/GameDAO.js";
import * as cardDAO from "../dao/CardDAO.js";
import * as roundDAO from "../dao/RoundDAO.js";
import * as cardPlayedDAO from "../dao/GameCardDAO.js";

export const createGame = async (req) => {
  console.log("sessione => " + JSON.stringify(req.user));

  try {
    let userId;
    if (req.user.userId !== undefined) {
      userId = req.user.userId;
    } else {
      throw new Error("Utente non valido");
    }
    const gameData = await startNewGame(userId);

    req.session.gameId = gameData.gameId;
    req.session.currentCard = gameData.currentCard;
    req.session.roundNumber = 1;
    req.session.failedAttempts = 0;
    req.session.cardsWon = 0;
    req.session.playerCards = gameData.initialCards;

    return {
      success: true,
      data: {
        gameId: gameData.gameId,
        round: 1,
        cardsWon: 0,
        cardsLost: 0,
        status: "ongoing",
        hand: gameData.initialCards,
        challengeCard: gameData.challengeCard,
      },
    };
  } catch (error) {
    return {
      success : false,
      data : {
        code : error.code,
        message : error.message
      }
    }
  }
};

export const submitGuess = async (req) => {
  try {
    const { gameId, position } = req.body;

    if (gameId !== req.session.gameId) {
      throw new Error("Invalid game ID");
    }

    // Gestione timeout
    const isTimeout = position === -1;

    const result = await processGuess(
      req.session.gameId,
      req.session.currentCard,
      position,
      req.session.roundNumber,
      req.session.playerCards,
      req.session.failedAttempts,
      req.session.cardsWon,
      isTimeout
    );

    // Aggiorna sessione
    req.session.roundNumber++;
    req.session.failedAttempts = result.failedAttempts;
    req.session.cardsWon = result.cardsWon;

    if (result.isCorrect && !isTimeout) {
      req.session.playerCards = result.updatedHand;
    }

    const response = {
      success: !isTimeout && result.isCorrect,
      correctPosition: result.correctPosition,
      cardDetails: result.cardDetails,
      gameStatus: result.gameStatus,
      round: req.session.roundNumber,
      cardsWon: result.cardsWon,
      cardsLost: result.failedAttempts,
    };

    if (result.gameStatus === "in_progress") {
      req.session.currentCard = result.nextCard;
      if (result.isCorrect && !isTimeout) {
        response.hand = result.updatedHand;
      }
      response.nextChallengeCard = removeIndex(result.nextCard);
    }
    return {
      success : true,
      data : response
    };
  } catch (error) {
    return {
      success : false,
      data : {
        code : error.code,
        message : error.message
      }
    }
  }
};

const startNewGame = async (userId) => {
  const game = await gameDAO.saveGame(userId);
  const cards = await cardDAO.getAllCards();
  const shuffled = cards.sort(() => Math.random() - 0.5);
  const initialCards = shuffled
    .slice(0, 3)
    .sort((a, b) => a.misfortuneIndex - b.misfortuneIndex);

  for (const card of initialCards) {
    await cardPlayedDAO.saveGameCard(card.cardId, 0, game.gameId);
  }
  const challengeCard = shuffled[3];
  return {
    gameId: game.gameId,
    initialCards,
    currentCard: challengeCard,
    challengeCard: removeIndex(challengeCard),
  };
};

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
    await cardPlayedDAO.saveGameCard(currentCard.cardId, roundNumber, gameId);
    updatedHand.splice(position, 0, currentCard);
    updatedHand.sort((a, b) => a.misfortuneIndex - b.misfortuneIndex);
    newCardsWon++;
  } else {
    newFailedAttempts++;
  }

  const totalCards = 3 + newCardsWon;
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
  };
};

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

const removeIndex = (card) => ({
  id: card.cardId,
  name: card.name,
  description: card.description,
  imageUrl: card.imageUrl,
});
