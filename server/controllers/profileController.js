import { getUserById } from "../dao/UserDAO.js";
import { getAllGamesCurrentUser } from "../dao/GameDAO.js";
import { getAllCardsByGameId } from "../dao/GameCardDAO.js";
import { getCardByCardId } from "../dao/CardDAO.js";

export const getProfileInfo = async (profileId) => {
  try {
    const users = await getUserById(parseInt(profileId));
    const user = users[0];

    const games = await getAllGamesCurrentUser(profileId);

    const gamesPlayed = games.length;
    const gamesWon = games.filter((game) => game.status === "won").length;
    const gamesLost = games.filter((game) => game.status === "lost").length;

    const dateLastgame =
      games.length > 0
        ? games.reduce((latest, game) => {
            const gameDate = new Date(game.createdAt);
            return gameDate > latest ? gameDate : latest;
          }, new Date(games[0].createdAt))
        : "Non hai ancora mai giocato";

    return {
      success: true,
      data: {
        id: user.userId,
        username: user.username,
        createdAt: user.createdAt,
        winRate:
          gamesPlayed > 0 ? ((gamesWon / gamesPlayed) * 100).toFixed(1) : "0.0",
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
