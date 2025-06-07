export class Round {
  constructor(roundId, gameId, cardId, roundNumber, isWon, playedAt) {
    this.roundId = roundId;
    this.gameId = gameId;
    this.cardId = cardId;
    this.roundNumber = roundNumber;
    this.isWon = isWon;
  }
}