module.exports = {
  up(db) {
    return db.collection('geo_district').insertMany([
      {
          "district": "2",
          "name": "Центральный федеральный округ"
      },
      {
          "district": "3",
          "name": "Южный федеральный округ"
      },
      {
          "district": "4",
          "name": "Северо-западный федеральный округ"
      },
      {
          "district": "5",
          "name": "Дальневосточный федеральный округ"
      },
      {
          "district": "6",
          "name": "Сибирский федеральный округ"
      },
      {
          "district": "7",
          "name": "Уральский федеральный округ"
      },
      {
          "district": "8",
          "name": "Приволжский федеральный округ"
      },
      {
          "district": "9",
          "name": "Северо-Кавказский федеральный округ"
}
    ]);
  },

  down(db) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
