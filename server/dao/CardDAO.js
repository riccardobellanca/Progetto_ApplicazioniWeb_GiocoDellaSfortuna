import db from "../db/database.js";
import { getAllCardSeenIds } from "./RoundDAO.js";

/**
 * Restituisce tutte le carte presenti nel database
 */
export async function getAllCards() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM carte";
    db.all(sql, [], (error, rows) => {
      if (error)
        reject({
          code: error.code,
          message: error.message,
        });
      else resolve(rows || []);
    });
  });
}

/**
 * Restituisce tutti i dettagli di una specifica carta
 */
export async function getCardByCardId(cardId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM carte WHERE cardId = ?";
    db.get(sql, [cardId], (error, row) => {
      if (error)
        reject({
          code: error.code,
          message: error.message,
        });
      else resolve(row || null);
    });
  });
}

/**
 * Restituisce una nuova carta mai vista durante una partita
 */
export async function getNextCard(gameId) {
  try {
    const allCards = await getAllCards();
    const seenCards = await getAllCardSeenIds(gameId);
    const usedIds = seenCards.map(obj => obj.cardId);
    const availableCards = allCards.filter((card) => !usedIds.includes(card.cardId));
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    return availableCards[randomIndex];
  } catch (error) {
    throw error;
  }
}