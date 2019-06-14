const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const models = require('../models');
const mailer =require('../config/mailer');

router.get("/search", async function(req, res){
  const session_user = (req.session.userId);
  const district = await models.District.find({});
  const region = await models.Region.find({});
  const city = await models.City.find({});

  if(session_user){
    models.User.findOne({_id:session_user},function(err, user){
      const city_name = user.city_name;
      models.User.find({city_name:city_name,role:'photographer'},function(err,user){
      res.render("search.hbs",{district,region,city,session_user,user});
      });
    });
  }
  else{
    models.User.find({role:'photographer'}).sort({_id:-1}).limit(12).find(function(err,user){
        res.render("search.hbs",{district,region,city,session_user,user});
    });
  }
});

router.get("/gallery", async (req, res)=>{
  const session_user = (req.session.userId);
  const back_href = '/';
  const user  = await models.User.findOne({_id:session_user});
  const file = await models.File.find({});
  const main_img = file[0];
  res.render("gallery.hbs",{
    user,
    file,
    session_user,
    main_img,
    back_href
  });
});

router.get("/singin", async (req, res)=>{
  const district = await models.District.find({});
  const region = await models.Region.find({});
  const city = await models.City.find({});
  res.render("singin.hbs",{
    district,
    region,
    city
  });
});

router.get("/login", async (req, res)=>{
  const district = await models.District.find({});
  const region = await models.Region.find({});
  const city = await models.City.find({});
  res.render("login.hbs",{
    district,
    region,
    city
  });
});

router.get("/acount", async (req, res)=>{
  const session_user = req.session.userId;
  if(session_user !== undefined){
    const user = await models.User.findOne({_id: session_user});
    const file = await models.File.find({user: session_user});

      res.render("acount.hbs",{
        user,
        file,
        session_user
      });
  }
  else{
    res.render("login.hbs");
  }
});

router.get('/photographer/:id', async (req,res)=>{
  const session_user = req.session.userId;
  const photographer_id = req.params.id;
  const user = await models.User.findOne({_id: photographer_id});
  const file = await models.File.find({user: photographer_id});
  res.render("photographer.hbs",{
    user,
    file,
    session_user
  });
});

router.get('/dialog/:id_dialog/:id_recipient', async (req,res)=>{
    const dialog_id = req.params.id_dialog;
    const recipient_id = req.params.id_recipient;
    const user_id = req.session.userId;
    try {
      const sender = await models.User.findOneAndUpdate(
        {_id: user_id, 'dialog._id':dialog_id},
        {$set:{'dialog.$.new_messange':0, 'new_messange':0}}
      );
        const recipient = await models.User.findOne({_id:recipient_id});
        const dialog = await models.Dialog.findOne({_id:dialog_id});

        global.user_id = req.session.userId;

        res.render("dialog.hbs",{
          dialog,
          recipient,
          sender,
          user_id
        });
      } catch (e) {
        console.log(e);
      }
});

router.get('/gallery/:id',async (req,res)=>{
  const user_id = req.params.id;
  const session_user = req.session.userId;
  const back_href = '/site/photographer/' + user_id;
  const user = await models.User.findOne({_id:session_user});
  const file = await models.File.find({user:user_id});
  const main_img = file[0];
  res.render("gallery.hbs",{
    user,
    file,
    session_user,
    main_img,
    back_href
  });
});

router.get("/showimage/:id", async (req, res)=>{
  const user = await models.User.findOne({_id: req.session.userId});
  const file = await models.File.findOne({_id: req.params.id});
  res.render("image.hbs",{
    user,
    file,
    session_user
  });
});

router.get('/edit', async (req,res)=>{
  const session_user = req.session.userId;
  if(req.session.userId){
    const user = await models.User.findOne({_id: req.session.userId});
    const user_district = await models.District.findOne({district:user.district_id});
    const district_name = user_district.name;
    const user_region = await models.Region.findOne({region:user.region_id});
    const region_name = user_region.name;
    const district = await models.District.find({});
    const region = await models.Region.find({});
    const city = await models.City.find({});
    res.render("edit.hbs",{
      user,
      district,
      region,
      city,
      district_name,
      region_name,
      session_user
    });
  }
  else{
   res.render("login.hbs");
  }
});

router.get('/chat', async (req,res)=>{
  const session_user = req.session.userId;
  const user = await models.User.findOne({_id: session_user});
  res.render("messange.hbs",{
    user,
    session_user
  });
});

module.exports = router;
