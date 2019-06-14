module.exports = {
  up(db) {
     return db.createCollection('files');
  },

  down(db) {
     return db.files.drop();
  }
};
