const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  city:{
    type: String,
    required: true,
  },
  region_id:{
    type: String,
    required: true,
  },
  name:{
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Geo_city", schema);
