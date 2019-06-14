const express = require('express');
const router = express.Router();
const models = require('../models');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const mkdirp = require('mkdirp');
const config = require('../config/app');
const mailer =require('../config/mailer');

//const rs = () => Math.random().toString(36).slice(-3);

const storage = multer.diskStorage({
  destination:(req,res,cb)=>{
    const user_path = req.session.userId;
    const dir ='/'+ user_path + '/' ;
    req.dir = dir;
    mkdirp(config.DESTINATION + dir, err=>cb(err,config.DESTINATION + dir));
  },
  filename:async(req,file,cb)=>{
    const user_id = req.session.userId;
    const filename = Date.now() + path.extname(file.originalname);
    const dir = req.dir;
    console.log(req.params.id);
if(req.params.id == 'shortImg'){
  console.log(file.originalname);
  const img = await models.File.findOne({user:user_id}).sort({_id:-1});
  //console.log(img_id);
  await models.File.findOneAndUpdate({_id:img._id},{
    imgshort:'/uploads' + dir  + filename,
  });
}else if (req.params.id == 'avatar') {
  await models.User.findOneAndUpdate({_id:req.session.userId},{
    image:'/uploads' + dir  + filename,
  });
}else{
  try {
    await models.File.create({
        user:user_id,
        path:'/uploads' + dir  + filename,
        imgshort:'/uploads' + dir  + filename,
      //  shortImg:"",
    });
  } catch (e) {
    console.log(e);
  }
}
    cb(null,filename);
  }
});

const upload = multer({
  storage,
  limits:{fileSize: 2*1024*1024},
  fileFilter:(req,file,cb)=>{
    const ext = path.extname(file.originalname);
    if(ext !=='.jpg' && ext !=='.png' && ext !=='.jpeg'){
      const err = new Error('Extention')
      err.code = 'EXTENTION';
      return cb(err)
    }
    cb(null, true)
  }
}).single('file');

//upload-image
router.post('/upload/:id',(req,res)=>{
  upload(req, res, err =>{
    let error = '';
    if(err){
      if(err.code === 'LIMIT_FILE_SIZE'){
        error = "Изображение превышает лимит"
      }
      if(err.code === 'EXTENTION'){
        error = 'Неверный формат данных'
      }
    }
    res.json({
      ok:!!error,
      error
    });
  //  res.redirect('/redactor');
  });
});

router.delete('/deleteimage/:id', async (req,res)=>{
  const id_image = req.params.id;
  const file = await models.File.findOne({_id:req.params.id});
  const path = file.path;
  await models.File.findByIdAndDelete(req.params.id, function(err){
        if(err) return console.log(err);
  });

  const fs = require("fs");
  await fs.unlink("/node/p"+path, function(err){
      if (err) {
          console.log(err);
      } else {
          console.log("Файл удалён");
      }
  });
});

router.post("/showimage/:id", async (req, res)=>{
  try {
    const file = await models.File.findOne({
      _id: req.params.id
    })
    res.json({
      ok:true,
      url_img:file.path,
      id_img:file._id,
      comments:file.comments
    });
  } catch (e) {
      console.log(e);
  }
});

router.post('/comments', async (req,res)=>{
  const user_image = req.body.user_image;
  const userId = req.body.userId;
  if(userId){
    const imageId = req.body.imageId;
    const userName = req.body.userName;
    const userComment = req.body.userComment;

    if(userComment){
      const d = new Date();
      const m = d.getMonth() + 1;
      const date = d.getDate()+'.'+m+'.'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes();
      await models.File.findOneAndUpdate(
        {_id: imageId},
        {$push:{comments:
        [{
          userId,
          userName,
          userComment,
          date:date,
          image:user_image,
        }]
        }});
      const file = await models.File.findOne({_id: imageId});
      res.json({
        ok:true,
        comments:file.comments
      });
    }else{
      const fields = [];
      fields.push('userComment');
      res.json({
        ok:false,
        error:'Все поля должны быть заполнены',
        fields
      });
    }
  }else{
    res.json({
      ok:false,
      error:'Необходимо авторизироваться!',
    });
  }
});

router.get('/create_dialog/:id', (req,res)=>{
const recipient_id = req.params.id;
  const sender_id = req.session.userId;

  if(sender_id !== undefined){
    models.User.findOne({_id:sender_id},{ 'dialog':{$elemMatch: {recipient_id:recipient_id}}
    }).then(user=>{
    if(user.dialog[0] !== undefined){
      const dialog_id = user.dialog[0]._id;
      res.redirect('/site/dialog/'+ dialog_id + '/' + recipient_id);
    }else{
    models.Dialog.create({
    }).then(dialog => {
      const dialog_id = dialog._id;
      models.User.findOne({
         _id:sender_id
       }).then(user=>{
         const sender_name = user.firstName + ' ' + user.lastName;
         models.User.findOneAndUpdate({_id: recipient_id},
          {$push:{dialog:[{
               _id:dialog_id,
               name:sender_name,
               recipient_id:sender_id,
               image:user.image,
               new_messange:0,
               date:Date()
             }]}},{new: true}, function(err, user){if(err) return console.log(err);
           });
       });
       models.User.findOne({
          _id:recipient_id
        }).then(user=>{
          const recipient_name = user.firstName + ' ' + user.lastName;
          models.User.findOneAndUpdate({_id: sender_id},
          {$push: {dialog:[{
              _id:dialog_id,
              name:recipient_name,
              recipient_id:recipient_id,
              image:user.image,
              new_messange:0,
              date:Date()
            }]}},{new: true}, function(err, user){if(err) return console.log(err);
            });
        });
          res.redirect('/site/dialog/'+ dialog_id + '/' + recipient_id);
      });
    }
  });
  }else{
     res.render("login.hbs");
  }
});


router.post('/sendmessange', async (req,res)=>{
  const d = new Date();
  const m = d.getMonth() + 1;
  const date = d.getDate()+'.'+m+'.'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes();
  await models.Dialog.findOneAndUpdate({_id: req.body.dialog_id},
  {$push: {messange:
{ $each: [{
  sender_id:req.body.sender_id,
  sender_name:req.body.sender_name,
  recipient_id:req.body.recipient_id,
  text_mess:req.body.messange,
  status:0,
  date:date
}], $position: 0 }
    }});

  const user = await models.User.findOneAndUpdate(
      {_id: req.body.recipient_id, 'dialog._id':req.body.dialog_id},
      {$inc:{'dialog.$.new_messange':1 ,'new_messange':1},date:Date()}
    );

  await  mailer(user.email, 'Новое сообщение', 'У Вас новое сообщение. Зайдите на сайт, чтобы прочитать');
    res.json({
      ok:true,
    });
});

router.post('/edit', async (req,res)=>{
  const userId = req.session.userId;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const district_id = req.body.district_id;
  const region_id = req.body.region_id;
  const city_id = req.body.city_id;
  const about_youself = req.body.about_youself;
  const web_site = req.body.web_site;
  const cost_works = req.body.cost_works;

  if(!firstName || !lastName || !district_id || !region_id || !city_id ){
    const fields = [];
    if(!firstName) fields.push('firstName');
    if(!lastName) fields.push('lastName');
    if(!district_id) fields.push('district_id');
    if(!region_id) fields.push('region_id');
    if(!city_id) fields.push('city_id');
    res.json({
      ok:false,
      error:'Все поля должны быть заполнены',
      fields
    });
  }else{
    const city = await models.City.findOne({city:city_id});
    await models.User.findOneAndUpdate({_id: userId},
      {
        firstName:firstName,
        lastName:lastName,
        district_id:district_id,
        region_id:region_id,
        city_id:city_id,
        city_name:city.name,
        cost_works:cost_works,
        web_site:web_site,
        about_youself:about_youself
      },
     {new: true}, function(err, user){
        if(err) {return console.log(err)
        }else{res.json({
          ok:true,
        });
      };
    });
  }
});

router.post('/rating', async (req,res)=>{
  if(req.body.ph_id !== req.session.userId){
  try {
    const user = await models.User.findOneAndUpdate(
      {_id:req.body.ph_id},
      {$inc:{'rating':req.body.rating}},
      {new: true}
    );
    console.log(user.rating);
    res.json({
      ok:true,
      data:user.rating
    });
  } catch (e) {
    res.json({
      ok:false,
    });
  }
}else{
  res.json({
    ok:false,
  });
}
});

router.post('/sort/:sort', (req,res)=>{
  if(req.params.id == "cost"){
    models.User.find({city_name:city_name,role:'photographer'}).sort({cost:-1}).find(function(err,user){
        res.json({
          ok:true,
          data:user
        });
    });
  }else{
    models.User.find({city_name:city_name,role:'photographer'}).sort({rating:-1}).find(function(err,user){
        res.json({
          ok:true,
          data:user
        });
    });
  }
});

module.exports = router;
