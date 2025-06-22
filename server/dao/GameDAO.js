import db from "../db/database.js";

/**
 * Crea una nuova partita
 */
export async function saveGame(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
     INSERT INTO partite (userId, status, createdAt, totalCardsWon, totalCardsLost) 
     VALUES (?, ?, datetime('now', 'localtime'), ?, ?)
   `;

    db.run(sql, [userId, "in_progress", 0, 0], function(err) {
      if (err) {
        console.error("Database error in saveGame:", err);
        reject({code: 500, message: "Impossibile creare la partita"});
      } else {
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
 * Aggiorna lo stato finale di una partita
 */
export async function updateGameStatus(gameId, status, cardsWon, cardsLost) {
  return new Promise((resolve, reject) => {
    const sql = `
     UPDATE partite 
     SET status = ?, totalCardsWon = ?, totalCardsLost = ?
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
 * Cerca tutte le partite giocate da uno specifico utente
 */
export async function getAllGamesByUserId(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
     SELECT * FROM partite WHERE userId = ? AND (status = "won" OR status = "lost")
   `;

    db.all(sql, [userId], (err, rows) => {
      if (err) reject({code : 500, message : "Impossibile trovare tutte le partite del giocatore corrente"});
      else resolve(rows || []);
    });
  });
}