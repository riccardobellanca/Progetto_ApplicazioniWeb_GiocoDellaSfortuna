export class Game {
  constructor(gameId, userId, status, startedAt, completedAt, totalCardsWon) {
    this.gameId = gameId;
    this.userId = userId;
    this.status = status;
    this.startedAt = startedAt;
    this.completedAt = completedAt;
    this.totalCardsWon = totalCardsWon;
  }
}