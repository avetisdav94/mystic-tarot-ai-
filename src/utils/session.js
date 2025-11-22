// Простое хранилище сессий (в продакшене лучше использовать Redis)
const sessions = new Map();

export class SessionManager {
  static getSession(userId) {
    if (!sessions.has(userId)) {
      sessions.set(userId, {
        userId,
        currentSpread: null,
        selectedCards: [],
        currentPosition: 0,
        createdAt: new Date()
      });
    }
    return sessions.get(userId);
  }

  static updateSession(userId, data) {
    const session = this.getSession(userId);
    sessions.set(userId, { ...session, ...data });
  }

  static clearSession(userId) {
    sessions.delete(userId);
  }

  static addCard(userId, card) {
    const session = this.getSession(userId);
    session.selectedCards.push(card);
    session.currentPosition++;
    sessions.set(userId, session);
  }

  static resetCards(userId) {
    const session = this.getSession(userId);
    session.selectedCards = [];
    session.currentPosition = 0;
    sessions.set(userId, session);
  }
}