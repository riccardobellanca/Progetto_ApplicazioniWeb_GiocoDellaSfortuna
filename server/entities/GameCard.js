export class GameCard {
  constructor(gameId, cardId, position, acquiredInRound) {
    this.gameId = gameId;
    this.cardId = cardId;
    this.position = position;
    this.acquiredInRound = acquiredInRound;
  }
}