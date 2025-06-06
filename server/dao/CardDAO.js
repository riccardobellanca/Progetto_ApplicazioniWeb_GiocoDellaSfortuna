import db from "../db/database.js";

export async function getAllCards() {
    return new Promise((resolve,reject) => {
        try {
            const sql = "SELECT cardId, name, description, imageURL FROM carte";
            db.all(sql, [], (error, rows) => {
                if (error) reject(error);
                else if (rows === undefined) reject("Impossibile trovare le carte");
                else resolve(rows);
            });
        } catch (error) {
            reject(error);
        }
    })
}

export async function getCardById(cardId) {
    return new Promise((resolve,reject) => {
        try {
            const sql = "SELECT * FROM carte WHERE cardId = ?";
            db.all(sql, [cardId], (err,rows) => {
                if (err) reject(err);
                else if (rows === undefined) reject("Impossibile trovare la carta desiderata");
                else resolve(rows);
            });
        } catch (error) {
            reject(error);
        }
    });
}