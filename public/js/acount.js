$(document).ready( function() {
    $("#fl_inp").change(function(){
         var filename = $(this).val().replace(/.*\\/, "");
         $("#fl_nm").html(filename);
    });
});

  $('#fileinfo').on('submit',function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var data = 'image';
console.log(formData);
    $.ajax({
      type:'POST',
      url:'/api/upload/'+data,
      data: formData,
      processData:false,
      contentType:false,
      success:function(r){
        console.log(r);
       $(location).attr('href','/redactor');
      },
      error:function(e){
        console.log(e);
      }
    });
  });

  $(".removeLink").click(function () {
            var id = $(this).attr("id");
  DeleteImage(id);
  });
  function DeleteImage(id){
      $.ajax({
        url:'/api/deleteimage/'+id,
        contentType: "application/json",
        method: "DELETE",
        success:function(){
          location.reload();
      }
    })
  }

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
    })
  }

function openBlock(el) {
	// el.parentNode - взять родительский элемент
	// el.parentNode.childNodes - взять все дочерние элементы родителя
	// и положить их в массив kids
	var kids = el.parentNode.childNodes;

	// прокрутить в цикле все элементы массива kids
	for (var k = 0; k < kids.length; k++) {
		var child = kids[k];

		// если имя класса текущего элемента равно this_block_is_hidden,
		// то выполнить ниже следующие инструкции
		if (child && child.className == "delete") {

			// если блок не виден, то показать его
			if (child.style.display != 'block') {
				child.style.display = 'block';
			}

			// иначе скрыть его
			else {
				child.style.display = 'none';
			}
		}
	}
}
