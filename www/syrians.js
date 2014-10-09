var gaPlugin;
var toast;
var tracking = false;

function onAndroid(){
	return( /android/i.test(navigator.userAgent.toLowerCase()) );
}
function onDeviceReady() {
	alert("DeviceReady");
	if(onAndroid()){
	    gaPlugin = window.plugins.gaPlugin;
	    toast = window.plugins.toast;
	    gaPlugin.init(function(){tracking=true;}, function(){tracking=false;}, "UA-55575592-1", 30);
	    gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 1,  localStorage.getItem('apptheme'));
	//	gaPlugin.trackPage( nativePluginResultHandler, nativePluginErrorHandler, window.location.pathname.substring(url.lastIndexOf('/')+1));
	    gaPlugin.trackPage( function(){toast.show("Success Tracking page: " + window.location.pathname.substring(url.lastIndexOf('/')+1),"long","bottom")}, function(){toast.show("Error Tracking page: " + window.location.pathname.substring(url.lastIndexOf('/')+1),"long","bottom")}, window.location.pathname.substring(url.lastIndexOf('/')+1));
	}
}

function backhome(){	
	this.render = function(){
		if(onAndroid()){
			return('<a class="ui-link ui-btn-left ui-btn ui-icon-home ui-btn-icon-left ui-shadow ui-corner-all" href="#" data-icon="carat-l"  data-role="button" data-ajax="false" data-rel="back">عودة</a>');
		}else{
			return('<a class="ui-link ui-btn-left ui-btn ui-icon-home ui-btn-icon-left ui-shadow ui-corner-all" href="index.html" data-icon="home"  data-role="button" data-ajax="false">الرئيسية</a>');
		}
	};
}

function syrians_share_app(){
	navigator.share('أدعوك للاطلاع على دليل المغتربين السوريين https://play.google.com/store/apps/details?id=com.alayham.syrians');	
}

function updatetheme(){
	  localStorage.setItem('apptheme',$( "input:radio[name=apptheme]:checked" ).val());
	  location.reload();
}

function homesection(sectionid,sectiontitle){
	this.id=sectionid;
	this.title=sectiontitle;
	this.varname='section' + this.id;
	this.html="";
	this.links = [];
	
	if(localStorage.getItem(this.varname) == 1){
		this.selected = " checked";
	}else{
		if(localStorage.getItem(this.varname) == 0){
			this.selected = "";
		}else{ //undefinded, show by default;
			this.selected = " checked";
			localStorage.setItem(this.varname,'1');
		}
	}
	this.addlink=function(linkurl,linktitle){
		this.links[this.links.length] = [linkurl,linktitle,linkurl.replace(/[^a-z0-9]/gi,'')]
	}
	this.renderoption=function(){
		var txt = '';
		for(j=0; j<this.links.length;j++){
			txt += $("<div/>").append(
				$("<input/>",{
				type: 'checkbox',
				"data-mini": "true",
				name: this.links[j][2],
				id: this.links[j][2],
				checked: (localStorage.getItem(this.links[j][2]) == 0 ? false : true),
			}).addClass('linkvisibility')).append($('<label/>',{for: this.links[j][2]}).text(this.links[j][1])).html();
			
		}
		var opt=$('<div/>').append(
			$('<input/>',{
				type: "checkbox",
				name: this.varname,
				id: this.varname,
				checked: (localStorage.getItem(this.varname) == 0 ? false : true),
				'data-mini' : "true"
			}).addClass("sectionvisibility")
			).append(
			$('<label/>',{
				for: this.varname,
			}).text(this.title)
			).append($('<div/>',{
				id: this.varname + "sublinks",
				"data-role": "controlgroup"
			}).addClass("sublinks").css("display", localStorage.getItem(this.varname) == 0 ? "none" : "block").html(txt)
			).html();
		console.log(opt);
		return(opt);
	}	
	this.rendersection=function(){
		if(localStorage.getItem(this.varname) == 0){
			return("");
		}
		var txt = "";
		txt += '<div id="' + this.varname + '" class="homecontainer" data-role="collapsible" data-inset="false" data-mini="true" data-collapsed="false">' +
	  	    	'<legend>' + this.title + '</legend>' +
	  	    	'<div class="ui-grid-a ui-responsive collapsiblecontent">';
		txt += this.html;
		var linknum=0;
		for(i=0; i<this.links.length; i++){
			if(localStorage.getItem(this.links[i][2]) == 0){
				
			}else{
				txt += '<a id="' + this.links[i][2]  +   '" class="ui-block-' + (linknum % 2 == 0 ? "a" : "b") + ' homebutton" data-mini="true" data-role="button" data-ajax="false" href="' + this.links[i][0] +  '">' + this.links[i][1] + '</a>'
				linknum++;
			}
		}
	  	txt += '</div></div>';
	  	return(txt);
	}
}
function updatesections(){
    for (i = 0; i < sectionlist.length; i++) {
    	localStorage.setItem(sectionlist[i].varname,($('#' + sectionlist[i].varname + '').is(':checked') ? 1 : 0));
  	}      
}
var sectionlist = [];

//sectionlist[0]=	new homesection("tv", "التلفزيون السوري");
sectionlist[1]=	new homesection("intheworld", "السوريون في العالم");
sectionlist[2]=	new homesection("connectsyria", "التواصل مع سوريا");
sectionlist[3]=	new homesection("culture", "تقافة وتعليم");
sectionlist[4]=	new homesection("about", "عن التطبيق");

//sectionlist[0].html ='<iframe width="100%" height="250" src="http://www.youtube.com/embed/videoseries?list=PLdnH0tm73Ekm5yvRzmWNbj7e-1ffaAaML" frameborder="0" allowfullscreen></iframe>';
sectionlist[1].addlink('syria_embassy.html','دليل السفارات السورية');
sectionlist[1].addlink('counsular_services_outside.html','دليل الخدمات القنصلية');
sectionlist[1].addlink('military_service.html','شؤون التجنيد');
sectionlist[1].addlink('expat_associations.html','النوادي السورية في العالم');
sectionlist[2].addlink('live_syrian_tv.html','التلفزيون والإذاعة');
sectionlist[2].addlink('news_tishreen.html','الأخبار: جريدة تشرين');
sectionlist[2].addlink('phones.html','الاتصال هاتفيا مع سوريا');
sectionlist[2].addlink('directory.html','دليل المواقع السورية');
sectionlist[2].addlink('invest_in_syria.html','دليل الاستثمار والأعمال');
sectionlist[2].addlink('donate_to_syria.html','إرسال التبرعات');
sectionlist[3].addlink('about_syria.html','معلومات عن سوريا');
sectionlist[3].addlink('schoolbag.html','الحقيبة الالكترونية للكتب المدرسية');
sectionlist[3].addlink('colors.html','تعليم الألوان للأطفال');
sectionlist[4].addlink('whatsnew.html','ما الجديد');
sectionlist[4].addlink('about.html','عن التطبيق');



$(document).ready(function(){
	//onDeviceReady();  //Not firing normally, will check why later;
	$('.pagefooter').load('includes/footer.html');
	$('.linkvisibility').click(function(){
		localStorage.setItem($(this).attr('id'),($(this).is(':checked') ? 1 : 0));
	});
	$('.sectionvisibility').change(function(){
		localStorage.setItem($(this).attr('id'),($(this).is(':checked') ? 1 : 0));
		$('#' + $(this).attr('id') + "sublinks").toggle();
	});
	$(document).on('click', '[rel="external"],.linksource', function (e) {
	    e.preventDefault();
	    var targetURL = $(this).attr("href");

	    window.open(targetURL, "_system");
	});
	
	showDebugInfo();
});

if (!localStorage.getItem('apptheme')){
  localStorage.setItem('apptheme','syria');
}


$("<link/>", {
     rel: "stylesheet",
     type: "text/css",
     href: "jquery-mobile/themes/" + localStorage.getItem('apptheme') + ".css"
  }).appendTo("head");

