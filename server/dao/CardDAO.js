import db from "../db/database.js";
import { getAllCardsByGameId } from "./GameCardDAO.js";

/**
* Ottiene tutte le carte
*/
export async function getAllCards() {
 return new Promise((resolve, reject) => {
   const sql = "SELECT * FROM carte";
   db.all(sql, [], (error, rows) => {
     if (error) reject(error);
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
     if (err) reject(err);
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
   const usedCards = await getAllCardsByGameId(gameId);
   const usedIds = usedCards.map(card => card.cardId);
   
   const availableCards = allCards.filter(
     card => !usedIds.includes(card.cardId)
   );
   
   if (availableCards.length === 0) return null;
   
   const randomIndex = Math.floor(Math.random() * availableCards.length);
   return availableCards[randomIndex];
 } catch (error) {
   throw error;
 }
}