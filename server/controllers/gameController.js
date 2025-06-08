import * as gameDAO from "../dao/GameDAO.js";
import * as cardDAO from "../dao/CardDAO.js";
import * as roundDAO from "../dao/RoundDAO.js";
import * as cardPlayedDAO from "../dao/GameCardDAO.js";

export const createGame = async (req) => {
  try {
    const userId = req.user.userId;
    const gameData = await startNewGame(userId);

    // Salva in sessione
    req.session.gameId = gameData.gameId;
    req.session.currentCard = gameData.currentCard;
    req.session.roundNumber = 1;
    req.session.failedAttempts = 0;
    req.session.cardsWon = 3;

    return {
      success: true,
      data: {
        initialCards: gameData.initialCards,
        challengeCard: gameData.challengeCard,
      },
    };
  } catch (error) {
    return { success: false, data: error.message };
  }
};

export const submitGuess = async (req) => {
  try {
    const result = await processGuess(
      req.session.gameId,
      req.session.currentCard,
      req.body.position,
      req.session.roundNumber
    );

    // Aggiorna sessione
    req.session.roundNumber++;
    if (result.isCorrect) req.session.cardsWon++;
    else req.session.failedAttempts++;

    if (result.gameEnded) {
      return {
        success: true,
        data: {
          isCorrect: result.isCorrect,
          card: result.card,
          gameStatus: result.gameStatus,
          finalStats: result.finalStats,
        },
      };
    } else {
      req.session.currentCard = result.nextCard;
      return {
        success: true,
        data: {
          isCorrect: result.isCorrect,
          card: result.card,
          nextCard: result.nextCardSafe,
        },
      };
    }
  } catch (error) {
    return { success: false, data: error.message };
  }
};

export const startNewGame = async (userId) => {
  const game = await gameDAO.saveGame(userId);
  const cards = await cardDAO.getAllCards();
  const shuffled = cards.sort(() => Math.random() - 0.5).slice(0, 4);
  const initialCards = shuffled
    .slice(0, 3)
    .sort((a, b) => a.misfortuneIndex - b.misfortuneIndex);

  for (let i = 0; i < 3; i++) {
    await cardPlayedDAO.saveGameCard(initialCards[i].cardId, null, game.gameId);
  }

  return {
    gameId: game.gameId,
    initialCards,
    currentCard: shuffled[3],
    challengeCard: removeIndex(shuffled[3]),
  };
};

export const processGuess = async (currentCard, position, roundNumber) => {
  const gameId = session.gameId;
  const playerCards = await cardPlayedDAO.getGameCards(gameId);
  const isCorrect = cardPlayedDAO.checkCardPosition(
    playerCards,
    currentCard.misfortuneIndex,
    position
  );

  await roundDAO.saveRound(currentCard.cardId, roundNumber, isCorrect, gameId);

  if (isCorrect) {
    await cardPlayedDAO.saveGameCard(currentCard.cardId, roundNumber, gameId);
  }

  // Verifica fine partita
  const cardsWon = isCorrect ? playerCards.length + 1 : playerCards.length;
  isCorrect ? null : session.failedAttempts++;

  if (cardsWon === 6 || failedAttempts === 3) {
    const status = cardsWon === 6 ? "won" : "lost";
    await gameDAO.updateGameStatus(gameId, status, cardsWon, failedAttempts);
    return {
      isCorrect,
      card: isCorrect ? currentCard : null,
      gameEnded: true,
      gameStatus: status,
      finalStats: { cardsWon, rounds: roundNumber },
    };
  }

  const nextCard = await cardDAO.getNextCard(gameId);
  return {
    isCorrect,
    card: isCorrect ? currentCard : null,
    nextCard,
    nextCardSafe: removeIndex(nextCard),
    gameEnded: false,
  };
};

const removeIndex = (card) => ({
  cardId: card.cardId,
  name: card.name,
  description: card.description,
  imageUrl: card.imageUrl,
});
