import { getCurrentUser } from "../dao/UserDAO.js";
import { getAllGamesCurrentUser } from "../dao/GameDAO.js";
import { getAllCardsByGameId } from "../dao/GameCardDAO.js";
import { getCardByCardId } from "../dao/CardDAO.js";

export const getProfileInfo = async (req) => {
  try {

    console.log("user => " + JSON.stringify(req.user.userId, null, 2));

    const user = await getCurrentUser(req);
    const games = await getAllGamesCurrentUser(req);

    console.log("user => " + JSON.stringify(user, null, 2));
    console.log("games => " + JSON.stringify(games, null, 2));

    const gamesPlayed = games.length;
    const gamesWon = games.filter((game) => game.status === "won").length;
    const gamesLost = games.filter((game) => game.status === "lost").length;
    const dateLastgame = games.max((game) => game.createdAt);

    return {
      success: true,
      data: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
        winRate: ((gamesWon / gamesPlayed) * 100).toFixed(1),
        games: {
          gamesPlayed: gamesPlayed,
          gamesWon: gamesWon,
          gamesLost: gamesLost,
          datelastGame: dateLastgame,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      data:
        error.code !== undefined
          ? error
          : {
              code: 500,
              message: "Impossibile trovare le informazioni del profilo",
            },
    };
  }
};

export const getProfileHistory = async () => {
  try {
    const user = await getCurrentUser();
    const completedGames = await getAllGamesCurrentUser();
    const history = [];

    for (const game of completedGames) {
      const cardsInGame = await getAllCardsByGameId(game.gameId);
      const enrichedCards = [];

      for (const cardEntry of cardsInGame) {
        const card = await getCardByCardId(cardEntry.cardId);
        enrichedCards.push({
          name: card.name,
          imageUrl: card.imageUrl,
          acquiredInRound: cardEntry.acquiredInRound,
        });
      }

      history.push({
        gameId: game.gameId,
        status: game.status,
        createdAt: game.createdAt,
        totalCardsWon: game.totalCardsWon,
        cards: enrichedCards,
      });
    }
    return {
      success: true,
      data: history,
    };
  } catch (error) {
    return {
      success: false,
      data: { error },
    };
  }
};
