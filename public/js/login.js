//login
function LoginUser(userEmail,userPassword) {
   $.ajax({
     url:'/api/login',
     contentType:'application/json',
     type:'POST',
     data:JSON.stringify({
       email:userEmail,
       password:userPassword,
     }),
   }).done(function (data){
     if(!data.ok){
     $('#form_title').after('<div class="error">'+data.error+'</div>');
     $('#pasw_update').after('<div class="error">'+data.error+'</div>');
      if(data.fields){
         data.fields.forEach(function(item){
           $('input[name='+item+']').addClass('error-field');
         });
       }
     }else{
      $(location).attr('href','/site/acount');
     }
   });
 }

  $("#login_form").submit(function (e) {
    e.preventDefault();
   var email = this.elements["email"].value;
   var password = this.elements["password"].value;
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
   if(reg.test(email) == false) {
     $('#form_title').after('<div class="error">Введите корректный e-mail</div>');
     return false;
  }else{LoginUser(email,password);}
 });
//resert_password
function ResertPassword(email) {
$.ajax({
 url:'/api/resertpassword',
 contentType:'application/json',
 type:'PUT',
 data:JSON.stringify({
   email:email,
 }),
}).done(function (data){
 if(!data.ok){
  $('#form_title_resert').after('<div class="error">'+data.error+'</div>');
  if(data.fields){
     data.fields.forEach(function(item){
       $('input[name='+item+']').addClass('error-field');
     });
   }
 }else{
   //$(location).attr('href','/acount');
   $('#resetForm_one').hide();
   $('#resetForm_two').show();
 }
});
}

$("#reset_password").click(function (e) {
$('#loginForm').hide();
$('#resetForm').show();
$('#resetForm_one').show();
});

$("#btn-reg").click(function (e) {
$('#loginForm').hide();
$('#regForm').show();
});

$("#send_pass").submit(function (e) {
e.preventDefault();
var email = this.elements["user_email"].value;

ResertPassword(email);
});
//Confirm password

$("#recover_pass").submit(function (e) {
e.preventDefault();
var data = $('#send_pass').serializeArray();
var email = data[0].value;
var password = this.elements["confirm_password"].value;

LoginUser(email,password);
});

//singin
function VerifUser(email,secret_token) {
  $.ajax({
    url:'/api/verif',
    contentType:'application/json',
    type:'PUT',
    data:JSON.stringify({
      email,
      secret_token,
    }),
  }).done(function (data){
    if(!data.ok){
      $('#form_title_verif').after('<div class="error">'+data.error+'</div>');
     if(data.fields){
        data.fields.forEach(function(item){
          $('input[name='+item+']').addClass('error-field');
        });
      }
    }else{
      //$('.singin h2').after('<p class="success">ОТЛИЧНО!</p>');
      $(location).attr('href','/site/acount');
    }
  });
}

$("#verifi").click(function (e) {
  e.preventDefault();
  var email = $("#email").val();
  var secret_token = this.elements["secret_token"].value;
 VerifUser(email,secret_token);
});

function SinginUser(firstName,lastName,userEmail,userPassword,district,region,city,roleUser) {
  $.ajax({
    url:'/api/singin',
    contentType:'application/json',
    type:'POST',
    data:JSON.stringify({
      firstName:firstName,
      lastName:lastName,
      email:userEmail,
      password:userPassword,
      district_id:district,
      region_id:region,
      city_id:city,
      role:roleUser
    }),
  }).done(function (data){
    if(!data.ok){
      $('#form_title_reg').after('<div class="error">'+data.error+'</div>');
     if(data.fields){
        data.fields.forEach(function(item){
          $('input[name='+item+']').addClass('error-field');
        });
      }
    }else{
      $('#regForm').hide();
      $('#codeForm').show();
    }
  });
}

$('input').on('focus',function(){
  $('div.error').remove();
  $('p.success').remove();
  $('input').removeClass('error-field');
});

 $("#singinForm").submit(function (e) {
   e.preventDefault();
  var email = this.elements["email"].value;
  var password = this.elements["password"].value;
  var firstName = this.elements["firstName"].value;
  var lastName = this.elements["lastName"].value;
  var district = document.querySelector('#district').value;
  var region = document.querySelector('#region').value;
  var city = document.querySelector('#city').value;
  var role = this.elements["role"].value;

  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
   if(reg.test(email) == false) {
     $('#form_title_reg').after('<div class="error">Введите корректный e-mail</div>');
     return false;
  }else{
      SinginUser(firstName,lastName,email,password,district,region,city,role);
  }
});
