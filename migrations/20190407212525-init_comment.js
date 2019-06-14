module.exports = {
  up(db) {
     return db.createCollection('comments');
  },

  down(db) {
     return db.comments.drop();
  }
};
