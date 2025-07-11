import db from "../db/database.js";
import { Round } from "../entities/Round.js";

/**
* Salva un round di una partita
*/
export async function saveRound(cardId, roundNumber, isWon, gameId) {
 return new Promise((resolve, reject) => {
   const sql = `
     INSERT INTO rounds (gameId, cardId, roundNumber, isWon, playedAt) 
     VALUES (?, ?, ?, ?, datetime('now','localtime'))
   `;
   
   db.run(sql, [gameId, cardId, roundNumber, isWon], function(err) {
     if (err) reject({code : 500, message : "Impossibile salvare il round"});
     else {
       const round = new Round(
         this.lastID,
         gameId,
         cardId,
         roundNumber,
         isWon,
         new Date().toISOString()
       );
       resolve(round);
     }
   });
 });
}

/**
 * Restituisce tutte le informazioni di tutti i round di una singola partita
 */
export function getAllRoundsByGameId(gameId) {
  return new Promise((resolve,reject) => {
    const sql = "SELECT * FROM rounds WHERE gameId = ?";
    db.all(sql, [gameId], (err,rows) => {
      if (err) reject({code : 500, message : "Impossibile trovare tutte le carte giocate della partite"});
      else resolve(rows || []);
    });
  });
}

/**
 * Restituisce gli identificativi di tutte le carte incontrate durante una singola partita
 */
export function getAllCardSeenIds(gameId) {
  return new Promise((resolve,reject) => {
    const sql = "SELECT cardId FROM rounds WHERE gameId = ?";
    db.all(sql, [gameId], (err,rows) => {
      if (err) reject({code : 500, message : "Impossibile trovare tutte le carte giocate della partite"});
      else resolve(rows || []);
    });
  });
}