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
/*
$(document).ready(function(){
	$('.pagefooter').load('includes/footer.html');
});
*/
if (!localStorage.getItem('apptheme')){
  localStorage.setItem('apptheme','syria');
}
$("<link/>", {
     rel: "stylesheet",
     type: "text/css",
     href: "jquery-mobile/themes/" + localStorage.getItem('apptheme') + ".css"
  }).appendTo("head");

