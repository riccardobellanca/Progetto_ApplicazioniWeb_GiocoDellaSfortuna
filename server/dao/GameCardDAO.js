import db from "../db/database.js";
import { GameCard } from "../entities/GameCard.js";

/**
 * Salva carta ottenuta nella partita
 */
export async function saveGameCard(cardId, acquiredInRound, gameId) {
  return new Promise((resolve, reject) => {
    const sql = `
     INSERT INTO carte_del_gioco (gameId, cardId, acquiredInRound) 
     VALUES (?, ?, ?)
   `;

    db.run(sql, [gameId, cardId, acquiredInRound], function (err) {
      if (err)
        reject({
          code: 500,
          message: "Impossibile salvare la carta del gioco",
        });
      else {
        const cardPlayed = new GameCard(gameId, cardId, acquiredInRound);
        resolve(cardPlayed);
      }
    });
  });
}

/**
 * Verifica se la posizione scelta è corretta
 */
export function checkCardPosition(playerCards, newCardIndex, position) {
  const sortedCards = [...playerCards].sort(
    (a, b) => a.misfortuneIndex - b.misfortuneIndex
  );

  if (position === 0) {
    return newCardIndex < sortedCards[0].misfortuneIndex;
  }
  if (position === sortedCards.length) {
    return newCardIndex > sortedCards[sortedCards.length - 1].misfortuneIndex;
  }
  return (
    newCardIndex > sortedCards[position - 1].misfortuneIndex &&
    newCardIndex < sortedCards[position].misfortuneIndex
  );
}

/**
 *
 */
export function getUsedCardIds(gameId) {
  return new Promise((resolve, reject) => {
    const sql = `
     SELECT * FROM carte_del_gioco WHERE gameId = ?`;

    db.all(sql, [gameId], (err, rows) => {
      if (err)
        reject({
          code: 500,
          message: "Impossibile trovare le carte della partita selezionata",
        });
      resolve(rows.map((rows) => rows.cardId));
    });
  });
}
