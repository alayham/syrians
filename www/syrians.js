var toast;
var tracking = false;
var pagename = window.location.pathname.substring(window.location.pathname.lastIndexOf("/"));
var onAndroid = navigator.userAgent.match(/Android/i);
var refreshInterval= 1000 * 60 * 30;

function logmessage(msg){
	console.log(msg);
	sessionStorage.setItem("log",pagename + ": " + msg + "\n" + sessionStorage.getItem("log"));
}

if (!localStorage.getItem('apptheme')){
	  localStorage.setItem('apptheme','syria');
	}
/*
var gaPlugin;

function initSuccessHandler(){
	tracking=true;
	logmessage("gaPlugin Init Success")
    gaPlugin.setVariable( nativePluginResultHandler, nativePluginErrorHandler, 1,  localStorage.getItem('apptheme'));
	gaPlugin.trackPage( trackSuccessHandler, trackErrorHandler, pagename);
	//gaPlugin.exit(exitSuccessHandler, exitErrorHandler);
}
function initErrorHandler(){
	logmessage("gaPlugin Init Error")
}

function trackSuccessHandler(){
	logmessage("gaPlugin Track Success")
}

function trackErrorHandler(){
	logmessage("gaPlugin Track Error")
}
function exitSuccessHandler(){
	logmessage("gaPlugin Exit Success")
}

function exitErrorHandler(){
	logmessage("gaPlugin Exit Error")
}



function nativePluginResultHandler(){
	//alert("tracking " + pagename);
}

function nativePluginErrorHandler(){}
*/
function onDeviceReady() {
//	onAndroid = true;
//    gaPlugin = window.plugins.gaPlugin;
//    gaPlugin.init(initSuccessHandler, initErrorHandler, "UA-55575592-1", 10);
}



function newssource(sourceUrl,displaytag,newscount){
	this.url = sourceUrl;
	this.tag = displaytag;
	if(newscount){
		this.count = newscount;
	}else{
		this.count = 200;
	}
	this.items = [];
	this.process = function(s){return(s);}
}

function shownews(newspage){
  var txt="";
  var i=0;
  if(newspage.items){
    logmessage("Rendering news items for " + newspage.tag);
    for(i=0;i<newspage.items.length;i++){
      txt += '<li><a rel="external" data-ajax="false" href="' + newspage.items[i].link  + '"><h3>' + newspage.items[i].title + '</h3>' + ( newspage.items[i].description == null ? '<div class="newsdate">' + newspage.items[i]["y:published"].day + "<br />" + newspage.items[i]["y:published"].month_name + '</div>' : '<div class="newsdate">' + newspage.items[i]["y:published"].day + "<br />" + newspage.items[i]["y:published"].month_name + '</div><p>' + newspage.items[i].description + '</p>') + '</a></li>';
    }
  }else{
    logmessage("No News Items to render");
    txt = "<li>فشل تحديث الأخبار</li>";
  }
  $('#' + newspage.tag).html(txt);
  $('#' + newspage.tag).listview();
}

function fetchItems(newspage){
  $.getJSON(newspage.url,
          function(data,status){
            if(status=="success"){
              var refreshDate = new Date();
              var jsontxt = newspage.process(JSON.stringify(data.value.items));
              localStorage.setItem(newspage.tag + 'Items',jsontxt);
              newspage.items=JSON.parse(jsontxt);
              localStorage.setItem(newspage.tag + 'refreshdate', refreshDate.valueOf());
            }else{
              logmessage("AJax request failed to update news data for " + newspage.tag);
            }
            shownews(newspage);
          }
   );	
}

function loadItems(newspage){
  var now = new Date();
  if(localStorage.getItem(newspage.tag + 'refreshdate')){
	  logmessage('Last refresh date for ' + newspage.tag + " is " + localStorage.getItem(newspage.tag + 'refreshdate'))
	  var refreshDate = new Date(parseInt(localStorage.getItem(newspage.tag + 'refreshdate')));	  
  }else{
	  
  }
  if(!refreshDate || now.valueOf() - refreshDate.valueOf() >= refreshInterval ){
	  logmessage("Cached data for " + newspage.tag + " is old, trying to fetch new data");
  	fetchItems(newspage);
  }else{
    var jsontxt = localStorage.getItem(newspage.tag + 'Items');
    if (jsontxt == null){
    	logmessage("No Cached data for " + newspage.tag +  ", trying to fetch new data");   	
  	  fetchItems(newspage);
    }else{
    	logmessage("Using cached data for " + newspage.tag)
      newspage.items=JSON.parse(jsontxt);
      shownews(newspage);
    }
  }
}

function backhome(){	
	this.render = function(){
		if(onAndroid){
			return('<a class="ui-link ui-btn-left ui-btn ui-icon-home ui-btn-icon-left ui-shadow ui-corner-all" href="#" data-icon="carat-l"  data-role="button" data-ajax="false" data-rel="back">عودة</a>');
		}else{
			return('<a class="ui-link ui-btn-left ui-btn ui-icon-home ui-btn-icon-left ui-shadow ui-corner-all" href="index.html" data-icon="home"  data-role="button" data-ajax="false">الرئيسية</a>');
		}
	};
}

function syrians_share_app(){
	navigator.share('أدعوك للاطلاع على دليل المغتربين السوريين https://play.google.com/store/apps/details?id=com.alayham.syrians');	
}

function lcShare(tagid){
	var element=$("#" + tagid).clone();
	element.find(".nocopy,.ui-collapsible-heading-status").remove();
	var txt = element.text().replace(/(\s)+/g, " ");
	console.log(txt);
  if(onAndroid){
	navigator.share(txt + "\n" + 'من دليل المغتربين السوريين https://play.google.com/store/apps/details?id=com.alayham.syrians');	
  }	
}
function lcCopy(tagid){
  var element=$("#" + tagid).clone();
  element.find(".nocopy,.ui-collapsible-heading-status").remove();
  var txt = element.text().replace(/(\s)+/g, " ");
  if(onAndroid){
	  window.plugins.clipboard.copy(txt + "\n" + 'من دليل المغتربين السوريين https://play.google.com/store/apps/details?id=com.alayham.syrians');	
  }	
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
			this.selected = "";function lcShare(tagid){

		}else{ //undefinded, show by default;
			this.selected = " checked";
			localStorage.setItem(this.varname,'1');
		}
	}
	this.addlink=function(linkurl,linktitle,linkimage){
		var defaultlinkimage = "flag.jpg";
		if(!linkimage)
			linkimage = defaultlinkimage;
		this.links[this.links.length] = [linkurl,linktitle,linkurl.replace(/[^a-z0-9]/gi,''),linkimage]
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
		return(opt);
	}	
	this.rendersection=function(){
		if(localStorage.getItem(this.varname) == 0){
			return("");
		}
		var txt = "";
		txt += '<div id="' + this.varname + '" class="homecontainer" data-role="collapsible" data-inset="false" data-mini="true" data-collapsed="false">' +
	  	    	'<legend>' + this.title + '</legend>' +
	  	    	'<div class="collapsiblecontent">';
		txt += this.html;
		txt += '<ul class="sectionlinks responsive-2-4">';
		for(i=0; i<this.links.length; i++){
			if(localStorage.getItem(this.links[i][2]) == 0){
				
			}else{
				txt += '<li><a id="' + this.links[i][2]  +   '" data-ajax="false" href="' + this.links[i][0] +  '">'  + 
						'<div class="linkimage"><img src="images/' + this.links[i][3] + '" title="الانتقال إلى قسم ' +  this.links[i][1] + '" /></div>' +
						'<div class="linktext">' + this.links[i][1] + '</div>' +
						'</a></li>'
			}
		}
	  	txt += '</ul></div></div>';
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
sectionlist[1].addlink('syria_embassy.html','دليل السفارات السورية','Syria_coat_of_arms.png');
sectionlist[1].addlink('counsular_services_outside.html','دليل الخدمات القنصلية','moex.png');
sectionlist[1].addlink('military_service.html','شؤون التجنيد','Syria_Armed_Forces_Emblem.png');
sectionlist[1].addlink('expat_associations.html','النوادي السورية في العالم','syrians_abroad.png');
sectionlist[2].addlink('live_syrian_tv.html','التلفزيون والإذاعة','Syriatvlogo.png');
sectionlist[2].addlink('news_sana.html','الأخبار: سانا','sana.png');
sectionlist[2].addlink('news_tishreen.html','الأخبار: جريدة تشرين','tishreen.jpg');
sectionlist[2].addlink('phones.html','الاتصال هاتفيا مع سوريا','syria_phone.png');
sectionlist[2].addlink('directory.html','دليل المواقع السورية','sy_tld_logo.png');
sectionlist[2].addlink('invest_in_syria.html','دليل الاستثمار والأعمال','syrecon.png');
sectionlist[2].addlink('donate_to_syria.html','إرسال التبرعات','daam.png');
sectionlist[3].addlink('about_syria.html','معلومات عن سوريا','about_syria.jpg');
sectionlist[3].addlink('schoolbag.html','الحقيبة الالكترونية للكتب المدرسية','syria_ecurricula.png');
sectionlist[3].addlink('colors.html','تعليم الألوان للأطفال','colors.png');
sectionlist[4].addlink('whatsnew.html','ما الجديد');
sectionlist[4].addlink('about.html','عن التطبيق');

$(document).ready(function(){
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
	$('.savedoption').change(function(){
		localStorage.setItem("option" + $(this).attr('id'),($(this).is(':checked') ? 1 : 0));
	});
	$('.jqmfilter').blur(function(){
		localStorage.setItem($(this).attr("id"),$(this).val())
		
	});
	$('.jqmfilter').each(function(){
		$(this).val( localStorage.getItem($(this).attr("id")));
	});
	$(".localcommands").each(function(){
		var hostElement = $(this).children(".ui-collapsible-content");
		var elementID = "";
		if($(this).prop("id")){
			elementID = $(this).prop("id");
		}else{
			elementID = "lc" + Math.floor((Math.random() * 100000000) + 1);
			$(this).attr("id",elementID);
		}
		$("<div/>",{"class": "lc nocopy"}).append($("<a/>",{
			"class" : "ui-link ui-btn ui-icon-share ui-btn-icon-notext ui-btn-inline ui-corner-all",
			"href" : "#",
			"data-for" : elementID,
		}).text("مشاركة").click(function(){lcShare(elementID); return(false);})).append($("<a/>",{
			"class" : "ui-link ui-btn ui-icon-clipboard ui-btn-icon-notext ui-btn-inline ui-corner-all",
			"href" : "#",
			"data-for" : elementID,
		}).text("نسخ").click(function(){lcCopy(elementID); return(false);})).prependTo(hostElement);
		
	});
	$('.savedoption').each(function(){
		if(localStorage.getItem("option" + $(this).attr("id")) == 1){
			$(this).prop('checked',true);
		}
	})
});


$("<link/>", {
     rel: "stylesheet",
     type: "text/css",
     href: "jquery-mobile/themes/" + localStorage.getItem('apptheme') + ".css"
  }).appendTo("head");
