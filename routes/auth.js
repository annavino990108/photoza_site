const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const models = require('../models');
const mailer =require('../config/mailer');

router.post('/singin', async(req,res)=>{
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const district_id = req.body.district_id;
  const region_id = req.body.region_id;
  const city_id = req.body.city_id;
  const role = req.body.role;

  if(!firstName || !lastName || !email || !password || !district_id || !region_id || !city_id || !role){
    const fields = [];
    if(!firstName) fields.push('firstName');
    if(!lastName) fields.push('lastName');
    if(!email) fields.push('email');
    if(!password) fields.push('password');
    if(!district_id) fields.push('district');
    if(!region_id) fields.push('region');
    if(!city_id) fields.push('city');
    if(!role) fields.push('role');
    res.json({
      ok:false,
      error:'Все поля должны быть заполнены',
      fields
    });
  }else{

 const user =  await  models.User.findOne({email});
  if(!user){
    try {
      const date = new Date();
      const user_secret_token = Math.round((Math.random() * (9999 - 1000) + 1000));
      //const hash = bcrypt.hash(password, null, null, function(err, hash){});
      bcrypt.hash(password, null, null, async function(err, hash){
      const city = await models.City.findOne({city:city_id});
      const name_city = city.name;
      const user = await models.User.create({
          firstName,
          lastName,
          district_id:district_id,
          region_id:region_id,
          city_id:city_id,
          city_name:name_city,
          role,
          email,
          password:hash,
          active:false,
          secret_token:user_secret_token,
          rating:1,
          date:date,
          image:'/public/images/user.png',
          cost_works:'',
          web_site:'',
          about_youself:'',
          new_messange:0
        });

        mailer(user.email, 'Подтверждение регистрации', `Код подтверждения: ${user_secret_token}`);
        res.json({
          ok:true,
        });

      });
    }catch (e) {
      res.json({
        ok:false,
        error:'Ошибка, попробуйте позже!',
      });
    }
  }else {
    res.json({
      ok:false,
      error:'Данный email уже используется',
      fields:['email']
    });
  }
};
});

//ПОДТВЕРЖДЕНИЕ РЕГИСТРАЦИИ
router.put('/verif', async(req,res)=>{
  const secret_token = req.body.secret_token;
  const email = req.body.email;
  if(!secret_token){
    res.json({
      ok:false,
      error:'Введите код',
    });
  }
  const user = await models.User.findOne({email});
  if(user.secret_token == secret_token){
  try {
      console.log(user.secret_token);
      const id = user._id;
      await models.User.findOneAndUpdate({_id: id}, {active:true}, {new: true}, function(err, user){
        if(err) return console.log(err);

        req.session.userId = user.id;
        req.session.userEmail = user.email;
        res.json({
          ok:true,
        });
      });
  } catch (e) {
    res.json({
      ok:false,
      error:'Ошибка, попробуйте позже!',
    });
  }
}else{
  res.json({
    ok:false,
    error:'Неверный код',
  });
}
});
//ВХОД
router.post('/login', async(req,res)=>{

  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password){
    const fields = [];

    if(!email) fields.push('email');
    if(!password) fields.push('password');
    res.json({
      ok:false,
      error:'Все поля должны быть заполнены',
      fields
    });
  }else{
    try {
      const user = await models.User.findOne({email});
        if(!user){
          res.json({
            ok:false,
            error:'Введенные данные неверны',
            fields:['email','password']
          });
        }else{
          bcrypt.compare(password,user.password,function(err,result){
            if(!result){
              res.json({
                ok:false,
                error:'Неверный пароль',
                fields:['password']
              });
            }else if (user.active == false) {
              res.json({
                ok:false,
                error:'Регистрация не была подтверждена',
              });
            }else{
              req.session.userId = user.id;
              req.session.userEmail = user.email;
              res.json({
                ok:true,
                user
              });
            }
          });
        }
    } catch (e) {
      res.json({
        ok:false,
        error:'Ошибка, попробуйте позже!',
      });
    }
  }
});

//ВЫХОД
router.get('/logout',(req,res)=>{
  if(req.session){
    req.session.destroy(() =>
  {
    res.redirect('/');
  });
  }
});
//СБРОС ПАРОЛЯ
function gen_password(){
    var new_password = "";
    var symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!№%?*_";
    for (var i = 0; i < 8; i++){
        new_password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }
    return new_password;
}

router.put('/resertpassword',async (req,res)=>{
  const new_password = await gen_password();
  const email = req.body.email;
  if(!email){
    const fields = [];
    if(!email) fields.push('email');
    res.json({
      ok:false,
      error:'Все поля должны быть заполнены',
      fields
    });
  }else{
    try {
      const user = await models.User.findOne({email});
      if(user == null){
        res.json({
          ok:false,
          error:"Данный email не зарегистрирован"
        });
      }
      bcrypt.hash(new_password, null, null, async function(err, hash){
        await models.User.findOneAndUpdate(
          {_id: user._id}, {password:hash}, {new: true},
          function(err, user){
            if(err) return console.log(err);

            mailer(user.email, 'Изменение пароля', `Новый пароль: ${new_password}`);
            res.json({
              ok:true,
            });
        });
      });
    } catch (e) {
      res.json({
        ok:false,
      });
    }
  }
});

module.exports = router;
