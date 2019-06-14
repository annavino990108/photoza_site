const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  messange:[{
    sender_id:{
      type:String,
      required:true,
    },
    sender_name:{
      type:String,
      required:true,
    },
    recipient_id:{
      type:String,
      required:true,
    },
    text_mess:{
      type:String,
      required:true,
    },
    status:{
      type:Boolean,
      required:true,
    },
    date:{
      type:String,
      required:true,
    }
  }]
});

module.exports = mongoose.model("Dialog", schema);
