const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  user:{
     type: String,
     required:true,
   },
   path:{
     type:String,
     required:true,
   },
  imgshort:{
     type:String,
     required:true,
   },
   comments:[{
     userId:{
       type: String,
       required: true,
     },
     userName:{
       type: String,
       required: true,
     },
     userComment:{
       type: String,
       required: true,
     },
     date:{
       type:String,
       required:false,
     },
     image:{
       type:String,
       required:false,
     },
   }],
});

module.exports = mongoose.model("File", schema);
