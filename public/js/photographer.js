function Rating(rating) {
  var ph_id =  document.getElementById("userId").value;
  $('input:checkbox').prop("disabled", true);

 $.ajax({
     url:'/api/rating',
     contentType:'application/json',
     type:'POST',
     data:JSON.stringify({
       ph_id:ph_id,
       rating:rating,
     }),
   }).done(function (data){
     if(data.ok){
       console.log(data.data);
        const elements = document.getElementById("rating");
        elements.remove();

        $('#userId').after('<span  id="rating">Рейтинг:'+data.data+'</span>');
     }else{

     }
   });
 };

$('#check-indicator1').click(function() {
    var rating = 5;
    Rating(rating);
});
$('#check-indicator2').click(function() {
    var rating = 4;
    Rating(rating);
});
$('#check-indicator3').click(function() {
    var rating = 3;
    Rating(rating);
});
$('#check-indicator4').click(function() {
    var rating = 2;
    Rating(rating);
});
$('#check-indicator5').click(function() {
    var rating = 1;
    Rating(rating);
});
