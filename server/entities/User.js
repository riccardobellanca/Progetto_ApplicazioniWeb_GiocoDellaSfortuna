export class User {
  constructor(userId, username, salt, hash, createdAt) {
    this.userId = userId;
    this.username = username;
    this.salt = salt;
    this.hash = hash;
    this.createdAt = createdAt;
  }
}