var $btn= $('<input type="button" value="MAC&PARDUS Zoom Aç" style="position: fixed;top: 55px;right:10px;" id="ekle"/>').click(goFrame);
var $url="https://uygulama-ebaders.eba.gov.tr/ders/FrontEndService//studytime/getteacherstudytime";
var $data="status=2&type=1&pageNumber=1&pageSize=25";
var $buton=0;
var $kim=0;
$("body").append($btn);
$("#ekle").hide();



chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
   if (msg.action == 'SendIt') {
	var arr = window.location.toString().split('/');
	$.each( arr, function( index, value ) {
			console.log(value);
			if(value.substring(0,15)=="livesessionview") 
			{
				var $div='<div id="dersler" style="position: fixed;top: 55px;right:200px;"><strong>MAC&PARDUS Zoom Aç</strong> <br></div>';
				$("body").append($div);
       
				$.ajax({
					  url : "https://uygulama-ebaders.eba.gov.tr/ders/FrontEndService//studytime/getteacherstudytime",
					  method : "POST",
					  headers : {
						"Content-Type" : "application/x-www-form-urlencoded",
						"Accept" : "json"
					  },
					  data : "status=2&type=1&pageNumber=1&pageSize=25",
					  withCredentials : true,
					  crossDomain : true,
					  xhrFields : {
						withCredentials : true
					  },
					  dataType : "json",
					  success : function(resp) {
						  console.log(resp.success);
						  if(resp.success==true) 
						  {
							  $kim=1;
						  } else if(resp.success==false) 
						  {
							$kim=2;
						  }
						  if($kim==1)
							{
								$url="https://uygulama-ebaders.eba.gov.tr/ders/FrontEndService//studytime/getteacherstudytime";
								$data="status=1&type=2&pageNumber=1&pageSize=25";
								$buton=1;
							} else if($kim==2)
							{
								$url="https://uygulama-ebaders.eba.gov.tr/ders/FrontEndService//studytime/getstudentstudytime";
								$data="status=1&type=2&pagesize=25&pagenumber=0";
								$buton=1;
							}
					if ($kim>0)
						{

                $("#ekle").show();
                $("#dersler").show();
          

               $.ajax({
                url : $url,
                method : "POST",
                headers : {
                  "Content-Type" : "application/x-www-form-urlencoded",
                  "Accept" : "json"
                },
                data : $data,
                withCredentials : true,
                crossDomain : true,
                xhrFields : {
                  withCredentials : true
                },
                dataType : "json",
                success : function(resp) {
                  var result = resp.studyTimeList;
                  var dersler = [];
                  var dersText = "";
                  var id = 1;
                var zaman=1000*60*60*5;//2 saat içindeki dersler 
                console.log(result);
                  for (var i in result) {
                    if ((new Date).getTime() + zaman > result[i].startdate) {
                      dersler.push(result[i]);
                      dersText = dersText + (id.toString() + ") " + result[i].title + " (" + result[i].ownerName + ")\n");
                      
                      $("#dersler").append('<div><button type="button" class="mybtn" style="margin-top:2px;display: block;" value="" id="'+result[i].id+'">'+ result[i].title + ' (' + result[i].ownerName+' '+result[i].ownerSurname+ ') </button></div>');
                      
                      id = id + 1;
                    }
                  }
                  if (dersler.length == 0) {
                    $("#dersler").append('<span style="color:#fff"> Aktif canlı ders yok !!!</span>');

                    return;
                  } 
                }
              });
						}
					}
				});

      } else if(value.substring(0,14)=="liveMiddleware") 
      {        
        
             $.ajax({
              url : "https://ders.eba.gov.tr/ders/getlivelessoninfo",
              method : "POST",
              headers : {
                "Content-Type" : "application/x-www-form-urlencoded",
                "Accept" : "json"
              },
              data : "",
              withCredentials : true,
              crossDomain : true,
              xhrFields : {
                withCredentials : true
              },
              dataType : "json",
              success : function(resp) {
                console.log(resp);
                var result = resp.liveLessonInfo.studyTime;
                var txt="Şu an "+result.studyTimeTitle +" ("+result.ownerName+") Canlı Dersin var gitmek istiyor musun?";
        
          var r = confirm(txt);
  
            if (r == true) {
          
              window.location = result.meetingStartUrl;
            
            } else {
              //window.location="https://ders.eba.gov.tr/ders/";
          
            }
          
              
            
          
        },error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert("Bilgiler alınamadı. EBA'ya devam edip Canlı Dersler Bölümünden canlı derse katılabilirsin.");
        }
      });
        
        
        
      }else 
      {
        $("#ekle").hide();
        $("#dersler").remove();
      }
	});
	}
});

function git(id) {
  
  $.ajax({
    url : "https://uygulama-ebaders.eba.gov.tr/ders/FrontEndService//livelesson/instudytime/start",
    method : "POST",
    headers : {
      "Content-Type" : "application/x-www-form-urlencoded",
      "Accept" : "json"
    },
    data : {
      "studytimeid" : id,
      "tokentype" : "asdasd"
    },
    withCredentials : true,
    crossDomain : true,
    xhrFields : {
      withCredentials : true
    },
    dataType : "json",
    success : function(resp2) {
      console.log(resp2);
      if(resp2.success==true)
      {
        window.location = resp2.meeting.url + "?tk=" + resp2.meeting.token;
      } else alert("Hata oluştu. Tekrar deneyin !!!");
      
    }
  });

}

function goFrame() {
	console.log($url);
    $.ajax({
  url : $url,
  method : "POST",
  headers : {
    "Content-Type" : "application/x-www-form-urlencoded",
    "Accept" : "json"
  },
  data : $data,
  withCredentials : true,
  crossDomain : true,
  xhrFields : {
    withCredentials : true
  },
  dataType : "json",
  success : function(resp) {
    var result = resp.studyTimeList;
    var dersler = [];
    var dersText = "";
    var id = 1;
	var zaman=1000*60*60*5;//5 saat içindeki ders zamanlaması  
	console.log(result);
    for (var i in result) {
		
      if ((new Date).getTime() + zaman >result[i].startdate) {
        dersler.push(result[i]);
        dersText = dersText + (id.toString() + ") " + result[i].title + " (" + result[i].ownerName + ")\n");
        id = id + 1;
      }
    }
    if (dersler.length == 0) {
      alert("aktif ders yok");
      return;
    }
    var selectedDers = prompt("Seçim yapınız (sadece rakam girin):\n\n" + dersText);
    var ders = dersler[parseInt(selectedDers) - 1];
	if(ders==null) 
	{
    alert("Seçimi iptal ettiniz. Buton çalışmazsa sayfayı yenileyip tekrar deneyin !!!");
    return;
	}
    $.ajax({
      url : "https://uygulama-ebaders.eba.gov.tr/ders/FrontEndService//livelesson/instudytime/start",
      method : "POST",
      headers : {
        "Content-Type" : "application/x-www-form-urlencoded",
        "Accept" : "json"
      },
      data : {
        "studytimeid" : ders.id,
        "tokentype" : "asdasd"
      },
      withCredentials : true,
      crossDomain : true,
      xhrFields : {
        withCredentials : true
      },
      dataType : "json",
      success : function(resp2) {
        window.location = resp2.meeting.url + "?tk=" + resp2.meeting.token;
      }
    });
  }
});
}
$(document).on('click', '.mybtn', function(){
  $(this).after('<div class="loader"></div>')
  git($(this).attr('id'));
  //alert( $(this).attr('id') );
  // Will give the id value for the clicked button
});