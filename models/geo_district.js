const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  district:{
    type: String,
    required: true,
  },
  name:{
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Geo_district", schema);
