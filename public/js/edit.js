$(document).ready( function() {
    $("#fl_inp").change(function(){
         var filename = $(this).val().replace(/.*\\/, "");
         $("#fl_nm").html(filename);
    });
});
$('#imgmain').on('submit',function(e){
  e.preventDefault();
  var formData = new FormData(this);
  var data = "avatar";
  $.ajax({
    type:'POST',
    url:'/api/upload/'+data,
    data: formData,
    processData:false,
    contentType:false,
    success:function(r){
     location.reload();
    },
    error:function(e){
      console.log(e);
    }
  });
});

function EditUser(firstName,lastName,district,region,city,about_youself,web_site,cost_works){
  $.ajax({
    url:'/api/edit',
    contentType:'application/json',
    type:'POST',
    data:JSON.stringify({
      firstName:firstName,
      lastName:lastName,
      district_id:district,
      region_id:region,
      city_id:city,
      about_youself:about_youself,
      web_site:web_site,
      cost_works:cost_works
    }),
   }).done(function (data){
     console.log(data);
     if(!data.ok){
     $('.er').after('<p class="error">'+data.error+'</p>');
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

  $("#formEdit").submit(function (e) {
    e.preventDefault();
    var firstName = this.elements["firstName"].value;
    var lastName = this.elements["lastName"].value;
    var district = document.querySelector('#district').value;
    var region = document.querySelector('#region').value;
    var city = document.querySelector('#city').value;
    var about_youself = this.elements["about_youself"].value;
    var web_site = this.elements["web_site"].value;
    var cost_works = this.elements["cost_works"].value;
   EditUser(firstName,lastName,district,region,city,about_youself,web_site,cost_works);
 });
