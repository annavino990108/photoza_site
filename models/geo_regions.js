const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  region:{
    type: String,
    required: true,
  },
  district_id:{
    type: String,
    required: true,
  },
  name:{
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Geo_regions", schema);
