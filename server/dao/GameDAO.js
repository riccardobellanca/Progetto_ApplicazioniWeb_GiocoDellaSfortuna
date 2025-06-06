import db from "../db/database.js";

export function saveGame(
  gameId,
  userId,
  status,
  startedAt,
  totalCardsWon,
  totalCardsLost
) {
  return new Promise((resolve, reject) => {
    try {
      const sql =
        "INSERT INTO partite (userId, status, startedAt, totalCardsWon, totalCardLost) VALUES (?, ?, ?, ?, ?)";
      db.run(
        sql,
        [gameId, userId, status, startedAt, totalCardsWon, totalCardsLost],
        (err, rows) => {
          if (err) reject(err);
          else if (rows === undefined) reject("Impossibile salvare la partita");
          else resolve("Partita salvata con successo");
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

export function getAllUserGames(userId) {}
