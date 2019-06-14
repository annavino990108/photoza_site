  function Search(city) {
     $.ajax({
       url:'/api/search',
       contentType:'application/json',
       type:'POST',
       data:JSON.stringify({
         city:city
       }),
     }).done(function (data){
       if(data.ok){
         if(data.user.length == 0){
           const elements = document.getElementsByClassName("box-photographer");
           while (elements.length > 0) elements[0].remove();

           $('.search-photographer').after('<p class="null_search">'+'По данному запросу ничего не найдено'+'</p>');
         }else{
           if(document.getElementsByClassName("box-photographer")){
             const elements = document.getElementsByClassName("box-photographer");
             while (elements.length > 0) elements[0].remove();
           }
           console.log(data.user);
           data.user.forEach(function(item){
           $('#list').after('<a  href="/site/photographer/'+item._id+'" class="box-photographer" id="photographer" data-cost="'+item.cost_works+'" data-rating="'+item.rating+'"><div class="photo-av" id="photo"><img src="'+item.image+'"></div>');
           $('#photo').after('<div class="information"><div class="name" id="user_name">Имя:'+item.firstName+' '+item.lastName+'</div>');
           $('#user_name').after('<div class="city" id="user_city">Город:'+item.city_name+'</div>');
           $('#user_city').after('<div class="city" id="user_rating">Рейтинг:'+item.rating+'</div>');
           $('#user_rating').after('<div class="cost">Стоимость съемки:'+item.cost_works+'</div></div></a>');
          });
         }
       }
     });
   }

  btn_search.onclick = function(){
    var city = document.querySelector('#city').value;
    $('p.null_search').remove();
    $('p.list_ph').remove();
    Search(city);
  }

  $('select[name="sort-cost"]').change(function(){
  if ($(this).val()=='sort1') {
    items = $('.photographer-list .box-photographer');
    arItems = $.makeArray(items);
    arItems.sort(function(a, b) {
    	return $(b).data("cost") - $(a).data("cost")
    });
    $(arItems.reverse()).appendTo(".photographer-list");
  }else if ($(this).val()=='sort2') {
    items = $('.photographer-list .box-photographer');
    arItems = $.makeArray(items);
    arItems.sort(function(a, b) {
    	return $(a).data("cost") - $(b).data("cost")
    });
    $(arItems.reverse()).appendTo(".photographer-list");
  }
});

$('select[name="sort-rating"]').change(function(){
if ($(this).val()=='sort1') {
  items = $('.photographer-list .box-photographer');
  arItems = $.makeArray(items);
  arItems.sort(function(a, b) {
    return $(b).data("rating") - $(a).data("rating")
  });
  $(arItems.reverse()).appendTo(".photographer-list");
}else if ($(this).val()=='sort2') {
  items = $('.photographer-list .box-photographer');
  arItems = $.makeArray(items);
  arItems.sort(function(a, b) {
    return $(a).data("rating") - $(b).data("rating")
  });
  $(arItems.reverse()).appendTo(".photographer-list");
}
});
