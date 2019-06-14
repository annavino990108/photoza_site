const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  firstName:{
    type: String,
    required: true,
  },
  lastName:{
    type: String,
    required: true,
  },
  district_id:{
    type: String,
    required: true,
  },
  region_id:{
    type: String,
    required: true,
  },
  city_id:{
    type: String,
    required: true,
  },
  city_name:{
    type: String,
    required: true,
  },
  role:{
    type: String,
    required: true,
  },
  email:{
    type: String,
		required: true,
    unique:true
  },
  password:{
    type: String,
		required: true,
  },
  active:{
    type: Boolean,
    required: true,
  },
  secret_token:{
    type: String,
    required: true,
  },
  rating:{
    type:Number,
    required:true,
  },
  date:{
    type:Date,
    required:true,
  },
  image:{
    type:String,
    require:false,
  },
  cost_works:{
    type: String,
    required:false,
  },
  web_site:{
    type:String,
    required:false,
  },
  about_youself:{
    type:String,
    required:false,
  },
  new_messange:{
    type:Number,
    required:true,
  },
  dialog:[{
    name:{
      type:String,
      required:true,
    },
    recipient_id:{
      type:String,
      required:true,
    },
    image:{
      type:String,
      required:true,
    },
    new_messange:{
      type:Number,
      required:true,
    },
    date:{
      type:Date,
      required:true,
    },
  }]
}
);


module.exports = mongoose.model("User", schema);
