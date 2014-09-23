function syrians_share_app(){
	navigator.share('أدعوك للاطلاع على دليل المغتربين السوريين https://play.google.com/store/apps/details?id=com.alayham.syrians');	
}
$(document).on('click', '[rel="external"],.linksource', function (e) {
    e.preventDefault();
    var targetURL = $(this).attr("href");

    window.open(targetURL, "_system");
});