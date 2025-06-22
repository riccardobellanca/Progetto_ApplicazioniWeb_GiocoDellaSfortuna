import { getUserById } from "../dao/UserDAO.js";
import { getAllGamesByUserId } from "../dao/GameDAO.js";
import { getAllRoundsByGameId } from "../dao/RoundDAO.js";
import { getCardByCardId } from "../dao/CardDAO.js";

/**
 * Consente di ricavare tutte le informazioni di un singolo utente
 */
export const getProfileInfo = async (profileId) => {
  try {
    const users = await getUserById(parseInt(profileId));
    const user = users[0];

    const games = await getAllGamesByUserId(profileId);

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
              code: 404,
              message: "Impossibile trovare le informazioni del profilo",
            },
    };
  }
};

/**
 * Consente di ricavare l'intera cronologia delle partite di un singolo utente
 */
export const getProfileHistory = async (userId) => {
  try {
    const completedGames = await getAllGamesByUserId(userId);
    const history = [];

    for (const game of completedGames) {
      const rounds = await getAllRoundsByGameId(game.gameId);
      const enrichedRounds = [];

      for (const round of rounds) {
        const card = await getCardByCardId(round.cardId);
        enrichedRounds.push({
          roundNumber: round.roundNumber,
          isWon: round.isWon,
          playedAt: round.playedAt,
          card: {
            name: card.name,
          }
        });
      }

      history.push({
        gameId: game.gameId,
        status: game.status,
        createdAt: game.createdAt,
        totalCardsWon: game.totalCardsWon,
        totalCardsLost: game.totalCardsLost,
        rounds: enrichedRounds
      });
    }    
    return {
      success: true,
      data: history
    };
  } catch (error) {
    return {
      success: false,
      data: { 
        code: 500,
        message: "Errore nel recupero della cronologia partite"
      }
    };
  }
};