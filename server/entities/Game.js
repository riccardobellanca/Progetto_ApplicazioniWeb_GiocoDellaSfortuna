export class Game {
  constructor(gameId, userId, status, startedAt, totalCardsWon, totalCardsLost) {
    this.gameId = gameId;
    this.userId = userId;
    this.status = status;
    this.startedAt = startedAt;
    this.totalCardsWon = totalCardsWon;
    this.totalCardsLost = totalCardsLost;
  }
}