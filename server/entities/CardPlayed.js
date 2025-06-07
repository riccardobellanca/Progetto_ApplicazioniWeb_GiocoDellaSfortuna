export class CardPlayed {
  constructor(gameId, cardId, acquiredInRound) {
    this.gameId = gameId;
    this.cardId = cardId;
    this.acquiredInRound = acquiredInRound;
  }
}