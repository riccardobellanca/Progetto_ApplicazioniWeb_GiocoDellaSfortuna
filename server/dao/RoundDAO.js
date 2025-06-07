import db from "../db/database.js";
import { Round } from "../entities/Round.js";

/**
* Salva un round di gioco
*/
export async function saveRound(cardId, roundNumber, isWon, gameId) {
 return new Promise((resolve, reject) => {
   const sql = `
     INSERT INTO rounds (gameId, cardId, roundNumber, isWon, playedAt) 
     VALUES (?, ?, ?, ?, datetime('now'))
   `;
   
   db.run(sql, [gameId, cardId, roundNumber, isWon], function(err) {
     if (err) reject(err);
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
* Ottiene le carte possedute in una partita
*/
export async function getGameCards(gameId) {
 return new Promise((resolve, reject) => {
   const sql = `
     SELECT c.* FROM carte c
     JOIN carte_del_gioco cg ON c.cardId = cg.cardId
     WHERE cg.gameId = ?
     ORDER BY cg.position
   `;
   
   db.all(sql, [gameId], (err, rows) => {
     if (err) reject(err);
     else resolve(rows || []);
   });
 });
}