import * as cardDAO from "../dao/CardDAO.js";

export const createDemo = async (req) => {
  try {
    const cards = await cardDAO.getAllCards();
    const shuffled = cards.sort(() => Math.random() - 0.5).slice(0, 4);
    const initialCards = shuffled
      .slice(0, 3)
      .sort((a, b) => a.misfortuneIndex - b.misfortuneIndex);

    req.session.demoCard = shuffled[3];
    req.session.demoCards = initialCards;

    return {
      success: true,
      data: {
        initialCards,
        challengeCard: {
          cardId: shuffled[3].cardId,
          name: shuffled[3].name,
          description: shuffled[3].description,
          imageUrl: shuffled[3].imageUrl,
        },
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const submitDemoGuess = async (req) => {
  try {
    const { position } = req.body;
    const { demoCard, demoCards } = req.session;

    const sortedCards = [...demoCards].sort(
      (a, b) => a.misfortuneIndex - b.misfortuneIndex
    );
    let isCorrect = false;

    if (position === 0) {
      isCorrect = demoCard.misfortuneIndex < sortedCards[0].misfortuneIndex;
    } else if (position === sortedCards.length) {
      isCorrect =
        demoCard.misfortuneIndex >
        sortedCards[sortedCards.length - 1].misfortuneIndex;
    } else {
      isCorrect =
        demoCard.misfortuneIndex > sortedCards[position - 1].misfortuneIndex &&
        demoCard.misfortuneIndex < sortedCards[position].misfortuneIndex;
    }

    delete req.session.demoCard;
    delete req.session.demoCards;

    return {
      success: true,
      data: {
        isCorrect,
        card: demoCard,
        demoCompleted: true,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
