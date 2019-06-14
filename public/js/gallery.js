$(".showImage").click(function () {
    var id = $(this).attr("id");
ShowImage(id);
});
function ShowImage(id){
  $.ajax({
    url:'/api/showimage/'+id,
    contentType: "application/json",
    method: "POST",
    success:function(){
  }
}).done(function (data){
  if(data.ok){
      document.getElementById("slide1").remove();
     $('.title-box').after('<div id="slide1"><img src="'+data.url_img+'" alt="" width=600px height=auto/></div>');
     if(document.getElementById("imageId")){
     document.getElementById("imageId").remove();
     $('#userId').after('<input type="text" class="name" name="imageId" id="imageId" value="'+data.id_img+'"  style="display:none">');
    }
     if(document.getElementById("comments__all")){
       const elements = document.getElementsByClassName("comments__all");
       while (elements.length > 0) elements[0].remove();
     }
     data.comments.forEach(function(item){
     $('#list-comment').after('<div class="comments__all" id="comments__all"><div class="photo" id="photo"><img src="'+item.image+'"></div>');
     $('#photo').after('<div class="information"><div class="box-data" id="box-data"><div class="name">'+item.userName+'</div><div class="date">'+item.date+'</div></div>');
     $('#box-data').after('<div class="text">'+item.userComment+'</div></div></div>');
     });
  }
});
}

//comments
function CommentUser(user_image,userId,imageId,userName,userComment) {
$.ajax({
  url:'/api/comments',
  contentType:'application/json',
  type:'POST',
  data:JSON.stringify({
    user_image:user_image,
    userId:userId,
    imageId:imageId,
    userName:userName,
    userComment:userComment
  }),
}).done(function (data){
  if(data.ok){
    console.log(userName);
     /*if(document.getElementById("comments__all")){
       const elements = document.getElementsByClassName("comments__all");
       while (elements.length > 0) elements[0].remove();
     }*/
    // data.comments.forEach(function(item){
      var d = new Date();
      var m = d.getMonth() + 1;
      var date = d.getDate()+'.'+m+'.'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes();
     $('#list-comment').after('<div class="comments__all" id="comments__all"><div class="photo" id="photo"><img src="'+user_image+'"></div>');
     $('#photo').after('<div class="information"><div class="box-data" id="box-data"><div class="name">'+userName+'</div><div class="date">'+ date+'</div></div>');
     $('#box-data').after('<div class="text">'+userComment+'</div></div></div>');
     //});
  }
});
}

$("#commentForm").submit(function (e) {
 e.preventDefault();
var user_image = this.elements["user_image"].value;
var userId = this.elements["userId"].value;
var imageId = this.elements["imageId"].value;
var userName = this.elements["userName"].value;
var userComment = this.elements["comment"].value;

$('#comment').val('');
var err = userComment.replace(/\s/g, '');
if(err !== ''){
CommentUser(user_image,userId,imageId,userName,userComment);
}else{
  $('#comment').val('');
}
});
