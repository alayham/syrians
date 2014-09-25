function syrians_share_app(){
	navigator.share('أدعوك للاطلاع على دليل المغتربين السوريين https://play.google.com/store/apps/details?id=com.alayham.syrians');	
}

function updatetheme(){
	  localStorage.setItem('apptheme',$( "input:radio[name=apptheme]:checked" ).val());
	  location.reload();
}
$(document).on('click', '[rel="external"],.linksource', function (e) {
    e.preventDefault();
    var targetURL = $(this).attr("href");

    window.open(targetURL, "_system");
});

var themestylesheet=localStorage.getItem('apptheme');
if (themestylesheet.length<3){
  localStorage.setItem(apptheme,'syria');
  themestylesheet=localStorage.getItem(apptheme);
}
$("<link/>", {
     rel: "stylesheet",
     type: "text/css",
     href: "jquery-mobile/themes/" + localStorage.getItem('apptheme') + ".css"
  }).appendTo("head");

