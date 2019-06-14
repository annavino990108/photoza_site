const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const models = require('../models');
const mailer =require('../config/mailer');

router.post('/findregion', async(req,res)=>{
  const district_id = req.body.district_id;
  const region = await models.Region.find({district_id:district_id});
  res.json({
    ok:true,
    region
  });
});

router.post('/findcity', async(req,res)=>{
  const region_id = req.body.region_id;
  const city = await models.City.find({region_id:region_id});
  res.json({
    ok:true,
    city
  });
});

router.post('/search', async(req,res)=>{
  const city_id = req.body.city;
  const user = await models.User.find({
    city_id:city_id,
    role:'photographer'
  });
  res.json({
    ok:true,
    user
  });
});

module.exports = router;
