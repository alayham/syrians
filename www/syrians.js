$(document).on('click', '[rel="external"],.linksource', function (e) {
    e.preventDefault();
    var targetURL = $(this).attr("href");

    window.open(targetURL, "_system");
});