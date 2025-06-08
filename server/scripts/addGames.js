import db from "../db/database";

const games = [
  {
    userId: 6,
    status: "won",
    createdAt: "2024-11-15 10:30:00",
    totalCardsWon: 6,
    totalCardsLost: 2,
  },
  {
    userId: 6,
    status: "lost",
    createdAt: "2024-11-15 10:30:00",
    totalCardsWon: 4,
    totalCardsLost: 3,
  },
  {
    userId: 6,
    status: "won",
    createdAt: "2024-11-15 10:30:00",
    totalCardsWon: 6,
    totalCardsLost: 1,
  },
  {
    userId: 6,
    status: "lost",
    createdAt: "2024-11-15 10:30:00",
    totalCardsWon: 5,
    totalCardsLost: 3,
  },
];

games.forEach((game) => db.run("INSERT INTO partite ...", game));
