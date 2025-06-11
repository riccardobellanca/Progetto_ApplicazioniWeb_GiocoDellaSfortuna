import db from "../db/database.js";
import { getAllCardSeenIds } from "./RoundDAO.js";

/**
 * Ottiene tutte le carte
 */
export async function getAllCards() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM carte";
    db.all(sql, [], (error, rows) => {
      if (error)
        reject({
          code: 500,
          message: "Impossibile trovare tutte le carte del database",
        });
      else resolve(rows || []);
    });
  });
}

/**
 * Ottiene carta per ID
 */
export async function getCardByCardId(cardId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM carte WHERE cardId = ?";
    db.get(sql, [cardId], (err, row) => {
      if (err)
        reject({
          code: 500,
          message: "Impossibile trovare la carta con questo id",
        });
      else resolve(row || null);
    });
  });
}

/**
 * Ottiene prossima carta random non usata
 */
export async function getNextCard(gameId) {
  try {
    const allCards = await getAllCards();
    const usedIdsObjects = await getAllCardSeenIds(gameId);
    
    // Estrai solo i valori cardId dagli oggetti
    const usedIds = usedIdsObjects.map(obj => obj.cardId);
    
    console.log("usedIds => " + JSON.stringify(usedIds, null, 2));
    
    const availableCards = allCards.filter(
      (card) => !usedIds.includes(card.cardId)
    );
        
    if (availableCards.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    return availableCards[randomIndex];
  } catch (error) {
    throw error;
  }
}