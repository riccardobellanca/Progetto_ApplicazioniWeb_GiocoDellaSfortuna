import * as cardDAO from "../dao/CardDAO.js";

export const createDemo = async (req) => {
  try {
    const demoData = await startNewDemo();

    console.log("req.session submitGuess => " + JSON.stringify(req.session,null,2));
    
    req.session.demoCard = demoData.challengeCardFull;
    req.session.demoHand = demoData.initialCards;

    return {
      success: true,
      data: {
        gameId: 'demo-' + Date.now(),
        round: 1,
        cardsWon: 3,
        cardsLost: 0,
        status: "in_progress",
        hand: demoData.initialCards,
        challengeCard: demoData.challengeCard,
      },
    };
  } catch (error) {
    console.error("Errore in createDemo:", error);
    return {
      success: false,
      data: {
        code: error.code || 500,
        message: error.message
      }
    };
  }
};

export const submitDemoGuess = async (req) => {
  try {
    const { position } = req.body;

    console.log("req.session submitGuess => " + JSON.stringify(req.session,null,2));

    if (!req.session.demoCard || !req.session.demoHand) {
      throw new Error("Sessione demo non valida");
    }

    let actualPosition = position;
    let isTimeout = position === -1;

    const result = await processDemoGuess(
      req.session.demoCard,
      actualPosition,
      req.session.demoHand,
      isTimeout
    );

    /*delete req.session.demoCard;
    delete req.session.demoHand;
    */

    const response = {
      success: !isTimeout && result.isCorrect,
      cardDetails: !isTimeout && result.isCorrect? result.cardDetails : null,
      gameStatus: result.isCorrect ? "won" : "lost",
      round: 1,
      cardsWon: result.isCorrect ? 4 : 0,
      cardsLost: result.isCorrect ? 0 : 1,
    };

    if (result.isCorrect) {
      response.hand = result.updatedHand;
    } else {
      response.hand = req.session.demoHand;
    }

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error("Errore in submitDemoGuess:", error);
    return {
      success: false,
      data: {
        code: error.code || 500,
        message: error.message
      }
    };
  }
};

const startNewDemo = async () => {
  const cards = await cardDAO.getAllCards();
  const shuffled = cards.sort(() => Math.random() - 0.5);
  const initialCards = shuffled
    .slice(0, 3)
    .sort((a, b) => a.misfortuneIndex - b.misfortuneIndex);

  const challengeCardFull = shuffled[3];
  
  return {
    initialCards,
    challengeCardFull,
    challengeCard: removeIndex(challengeCardFull),
  };
};

const processDemoGuess = async (currentCard, position, playerCards, isTimeout) => {

  const correctPosition = findCorrectPosition(
    playerCards,
    currentCard.misfortuneIndex
  );
  const isCorrect = !isTimeout && position === correctPosition;
  let updatedHand = [...playerCards];
  if (isCorrect) {
    updatedHand.splice(position, 0, currentCard);
    updatedHand.sort((a, b) => a.misfortuneIndex - b.misfortuneIndex);
  }
  return {
    isCorrect,
    correctPosition,
    cardDetails: currentCard,
    updatedHand,
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
  imageUrl: card.imageUrl,
});