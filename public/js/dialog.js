window.scrollTo(0, document.body.scrollHeight);

function SendMessange(sender_id,sender_name,recipient_id,dialog_id,messange) {
   $.ajax({
     url:'/api/sendmessange',
     contentType:'application/json',
     type:'POST',
     data:JSON.stringify({
       sender_id:sender_id,
       sender_name:sender_name,
       recipient_id:recipient_id,
       dialog_id:dialog_id,
       messange:messange
     }),
   }).done(function (data){
     if(data.ok){
       location.reload();
     }
 });
}

$("#messange").submit(function (e) {
  e.preventDefault();
 var sender_id = this.elements["sender_id"].value;
 var sender_name = this.elements["sender_name"].value;
 var recipient_id = this.elements["recipient_id"].value;
 var dialog_id = this.elements["dlg_id"].value;
 var messange = this.elements["mess"].value;
console.log(messange);
 SendMessange(sender_id,sender_name,recipient_id,dialog_id,messange);
});
