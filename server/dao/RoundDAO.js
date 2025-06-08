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
