import * as cardDAO from "../dao/CardDAO.js";

/**
 * Consente di iniziare la partita demo e restituirne i dati essenziali 
 */
export const createDemo = async (req) => {
  try {
    const demoData = await startNewDemo();

    req.session.demoCard = demoData.challengeCardFull;
    req.session.position = findCorrectPosition(
      demoData.initialCards,
      demoData.challengeCardFull.misfortuneIndex
    );
    req.session.startTime = new Date().toISOString();;
    req.session.save();

    return {
      success: true,
      data: {
        gameId: "demo-" + Date.now(),
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
        message: error.message,
      },
    };
  }
};

/**
 * Consente di ricevere una risposta sulla correttezza del tentativo effettuato dall'utente
 */
export const submitDemoGuess = async (req) => {
  try {
    if (
      req.session.demoCard === undefined ||
      req.session.position === undefined
    ) {
      return {
        success: false,
        data: {
          code: 500,
          message: "Sessione demo non valida",
        },
      };
    }

    const { position } = req.body;
    let isTimeout =
      position === -1 ||
      (req.session.startTime !== undefined &&
        new Date().toISOString() - req.session.startTime > 30000);
    const isCorrect = !isTimeout && position === req.session.position;

    return {
      success: true,
      data: {
        success: isCorrect,
        cardDetails: isCorrect ? req.session.demoCard : null,
        gameStatus: isCorrect ? "won" : "lost",
        round: 1,
        cardsWon: isCorrect ? 4 : 3,
        cardsLost: isCorrect ? 0 : 1,
      },
    };
  } catch (error) {
    console.error("Errore in submitDemoGuess:", error);
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
 * Consente di creare lo stato di gioco e restituire tutte le informazioni necessarie alla Demo 
 */
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
  id: card.cardId,
  name: card.name,
  imageUrl: card.imageUrl,
});
