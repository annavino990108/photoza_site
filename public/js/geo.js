var district = document.querySelector('#district');
var region = document.querySelector('#region');
var city = document.querySelector('#city');

function FindRegion(district_id) {
   $.ajax({
     url:'/api/findregion',
     contentType:'application/json',
     type:'POST',
     data:JSON.stringify({
       district_id:district_id,
     }),
   }).done(function (data){
     if(data.ok){
       city.options[city.options.length] = new Option('Город');
       region.options[region.options.length] = new Option('Регион');
        data.region.forEach(function(item){
          region.options[region.options.length] = new Option(item.name,item.region);
        })
     }
   });
 }

 function FindCity(region_id) {
    $.ajax({
      url:'/api/findcity',
      contentType:'application/json',
      type:'POST',
      data:JSON.stringify({
        region_id:region_id,
      }),
    }).done(function (data){
      if(data.ok){
        city.options[city.options.length] = new Option('Город');
         data.city.forEach(function(item){
           city.options[city.options.length] = new Option(item.name,item.city);
         })
      }
    });
  }

  district.addEventListener('change', function(){
    var id = this.value;
    region.options.length = 0;
    city.options.length = 0;
    FindRegion(id);
  });

  region.addEventListener('change', function(){
    var id = this.value;
    city.options.length = 0;
    FindCity(id);
  });
