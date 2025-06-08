import db from "../db/database.js";

/**
 * Crea nuova partita
 */
export async function saveGame(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
     INSERT INTO partite (userId, status, startedAt, totalCardsWon, totalCardsLost) 
     VALUES (?, ?, datetime('now'), ?, ?)
   `;

    db.run(sql, [userId, "in_progress", 0, 0], function (err) {
      if (err) reject({code : 500, message : "Impossibile creare la partita"});
      else {
        resolve({
          gameId: this.lastID,
          userId,
          status: "in_progress",
          startedAt: new Date().toISOString(),
          totalCardsWon: 0,
          totalCardsLost: 0,
        });
      }
    });
  });
}

/**
 * Aggiorna stato partita
 */
export async function updateGameStatus(gameId, status, cardsWon, cardsLost) {
  return new Promise((resolve, reject) => {
    const sql = `
     UPDATE partite 
     SET status = ?, totalCardsWon = ?, totalCardsLost = ?, completedAt = datetime('now')
     WHERE gameId = ?
   `;

    db.run(sql, [status, cardsWon, cardsLost, gameId], function (err) {
      if (err) reject({code : 500, message : "Impossibile aggiornare la partita"});
      else if (this.changes === 0) reject("Partita non trovata");
      else resolve({ gameId, status, cardsWon, cardsLost });
    });
  });
}

/**
 * Cerca tutte le partite giocate da un utente
 */
export async function getAllGamesCurrentUser(req) {
  return new Promise((resolve, reject) => {
    const sql = `
     SELECT * FROM partite WHERE userId = ? AND (status = "won" OR status = "lost")
   `;

    db.all(sql, [req.user.userId], (err, rows) => {
      if (err) reject({code : 500, message : "Impossibile trovare tutte le partite del giocatore corrente"});
      else resolve(rows || []);
    });
  });
}