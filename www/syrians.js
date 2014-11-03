var toast;
var tracking = false;
var pagename = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
var onAndroid = navigator.userAgent.match(/Android/i);
var refreshInterval= 1000 * 60 * 30;
var ParseInitialized = false;
var gaPlugin;
var pagetimer;
var sectionlist = [];
var themelist = [];
var translist = [];

function clickEvent(){
	return( onAndroid ? "tap" : "click" );
}

function logmessage(msg){
	console.log(msg);
	//sessionStorage.setItem("loger",pagename + ": " + msg + "\n" + sessionStorage.getItem("loger"));
}

if (!localStorage.getItem('apptheme')){
  localStorage.setItem('apptheme','syria');
}
if (!localStorage.getItem('hometrans')){
  localStorage.setItem('hometrans','flip');
}

function checkConnection(){
	return(!(navigator.connection.type === Connection.UNKNOWN &&
		     navigator.connection.type === Connection.NONE));
}

function gaInitSuccess(){
	logmessage("GA Initialized");
    gaPlugin.setVariable( gaSetVarSuccess, gaSetVarFailed, 1, localStorage.getItem('apptheme'));
    gaPlugin.trackPage( gaTrackSuccess, gaTrackFailed, pagename);
}

function gaInitError(){
	logmessage("GA Init Failed")
}

function gaTrackSuccess(){
	logmessage("GA Tracking Success");
}
function gaTrackFailed(){
	logmessage("GA Tracking failed");
}

function gaSetVarSuccess(){
	logmessage("GA Setvar Success");
}

function gaSetVarFailed(){
	logmessage("GA Setvar failed");
}
function gaEventSuccess(){
	logmessage("Tracking Event Succeeded");
}
function gaEventFailed(){
	logmessage("Tracking Event Failed");
}

function onOnline(){
	$('body').removeClass("offline").addClass("online");
	logmessage("Internet Connected");
}
function onOffline(){
	$('body').addClass("offline").removeClass("online");
	logmessage("Internet Disconnected");
}

function InitParse(){
	if(!ParseInitialized){
		var PARSE_APP = "2G96h8o7oIjVIw23DDSkuw7QkwwAVPqViSwUamHJ";
		var PARSE_JS = "1OPOeESsXbA2EtgiwjNm8KFeM8zohigBuEYoEQ4Y";
		Parse.initialize(PARSE_APP, PARSE_JS);
		ParseInitialized = true;
	}
}

function theme(themeid,themetitle){
	this.id=themeid;
	this.title=themetitle;
	if(localStorage.getItem('apptheme') == themeid){
		this.selected = " checked";
	}else{
		this.selected = "";
	}
	this.render=function(){
		return(
			'<label for="' + this.id + '">' + 
			this.title + 
			'<input type="radio" name="apptheme" value="' + this.id + '" id="' + this.id + '" onChange="updatetheme();"' + this.selected + ' />' +
			'</label>');
	}	
}
function hometransition(transid,transtitle){
	  this.id=transid;
	  this.title=transtitle;
	  if(localStorage.getItem('hometrans') == transid){
	    this.selected = " checked";
	  }else{
	    this.selected = "";
	  }
	  this.render=function(){
	    return(
	      '<label for="trans' + this.id + '">' + 
	      this.title + 
	      '<input type="radio" name="hometrans" value="' + this.id + '" id="trans' + this.id + '" onChange="updatetrans();"' + this.selected + ' />' +
	      '</label>');
	  } 
	}



function initOptions(){
	themelist = [
		new theme("syria", "التصميم الافتراضي"),
		new theme("shadi", "تصميم شادي"),
		new theme("mazen", "تصميم مازن"),
		new theme("nadia", "تصميم ناديا"),
		new theme("samer", "تصميم سامر"),
		new theme("sami", "تصميم سامي")
	];
	
	translist = [
	  new hometransition("none","None"),        
	  new hometransition("fade","Fade"),        
	  new hometransition("pop","Pop"),        
	  new hometransition("flip","Flip (default)"),        
	  new hometransition("turn","Turn"),        
	  new hometransition("flow","Flow"),        
	  new hometransition("slidefade","Slide Fade"),        
	  new hometransition("slide","Slide"),        
	  new hometransition("slideup","Slide UP"),        
	  new hometransition("slidedown","Slide Down"),        
	]
	
}


function updatetheme(){
	localStorage.setItem('apptheme',$( "input:radio[name=apptheme]:checked" ).val());
	location.reload();
}

function updatetrans(){
	localStorage.setItem('hometrans',$( "input:radio[name=hometrans]:checked" ).val());	
	$.mobile.defaultPageTransition = localStorage.getItem('hometrans');
}


function onDeviceReady() {
	logmessage("Device Ready");
	onAndroid = true;
    $(document).on("online", onOnline);
    $(document).on("offline", onOffline);
    if(checkConnection()) {
        $(document).trigger("online");
    } else {
        $(document).trigger("offline");
    }
    if(window.device){
        logmessage("Cordova: " + device.cordova);
        logmessage("Model: " + device.model);
        logmessage("Platform: " + device.platform);
        logmessage("UUID: " + device.uuid);
        logmessage("Version: " + device.version);
        sessionStorage.setItem("device", device.model + "-" + device.uuid);
        logmessage("Device ID: " + sessionStorage.getItem("device"));
    }
    gaPlugin = window.plugins.gaPlugin;
    if(gaPlugin){
        gaPlugin.init(gaInitSuccess, gaInitError, "UA-55575592-1", 10);    	
    }else{
    	logmessage("gaPlugin Not found");
    }
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
              if(gaPlugin){
            	  gaPlugin.trackEvent( gaEventSuccess, gaEventFailed, "Network", "News", "refresh", pagename);
              }else{
            	  logmessage("gaPlugin Not found");
              }

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
			return('<a class="ui-link ui-btn-left ui-btn ui-icon-home ui-btn-icon-left ui-shadow ui-corner-all" href="#" data-icon="carat-l"  data-role="button" data-rel="back">عودة</a>');
		}else{
			return('<a class="ui-link ui-btn-left ui-btn ui-icon-home ui-btn-icon-left ui-shadow ui-corner-all" href="index.html" data-icon="home"  data-role="button" data-ajax="false">الرئيسية</a>');
		}
	};
}

function syrians_share_app(){
	navigator.share('أدعوك للاطلاع على دليل المغتربين السوريين https://play.google.com/store/apps/details?id=com.alayham.syrians');
    if(gaPlugin){
    	gaPlugin.trackEvent( gaEventSuccess, gaEventFailed, "User", "Share", "App", pagename);
    }else{
  	  logmessage("gaPlugin Not found");
    }

}

function lcShare(tagid){
  var element=$("#" + tagid).clone();
  element.find(".nocopy,.ui-collapsible-heading-status").remove();
  element.find("a").each(function(){
	  switch($(this).attr("href").substring(0,4)){
	  case "http": $(this).text(($(this).text().substring(0,4) == "www." ? "Website" : $(this).text()) + ": " + $(this).attr("href")); break;
	  case "tel:": $(this).text( "Telephone: " + $(this).text()); break;
	  case "mail": $(this).text( "Email: " + $(this).text()); break;
	  };
  });
  element.find(".embassy_address").each(function(){$(this).text("Address: " + $(this).text());});
		  
  var txt = document.title + "\n" + element.text().replace(/([ \t])+/g, " ");
  console.log(txt);
  if(onAndroid){
	navigator.share( txt + "\n" + 'من دليل المغتربين السوريين https://play.google.com/store/apps/details?id=com.alayham.syrians');	
  }	
  if(gaPlugin){
	  gaPlugin.trackEvent( gaEventSuccess, gaEventFailed, "User", "Share", "Content", tagid);
  }else{
	  logmessage("gaPlugin Not found");
  }
}
function lcCopy(tagid){
  var element=$("#" + tagid).clone();
  element.find(".nocopy,.ui-collapsible-heading-status").remove();
  var txt = element.text().replace(/(\s)+/g, " ");
  if(onAndroid){
	  window.plugins.clipboard.copy(txt);	
  }	
  if(gaPlugin){
	  gaPlugin.trackEvent( gaEventSuccess, gaEventFailed, "User", "Copy", "Content", tagid);	  
  }else{
	  logmessage("gaPlugin Not found");
  }
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
				txt += '<li><a class="homelink" data-ajax="' + (this.links[i][0].substring(0,1) == "#" ? "true":"true")  +  '" href="' + this.links[i][0] +  '">'  + 
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
function initSections(){
	
	sectionlist[0]=	new homesection("news", "الأخبار والإعلام");
	sectionlist[1]=	new homesection("intheworld", "السوريون في العالم");
	sectionlist[2]=	new homesection("connectsyria", "التواصل مع سوريا");
	sectionlist[3]=	new homesection("education", "تعليم");
	sectionlist[4]=	new homesection("culture", "تقافة");
	sectionlist[5]=	new homesection("about", "عن التطبيق");
	
	sectionlist[0].addlink('news_sana.html','الأخبار المحلية: سانا','sana.png');
	sectionlist[0].addlink('news_tishreen.html','الأخبار: جريدة تشرين','tishreen.jpg');
	sectionlist[0].addlink('news_sana_politics.html','الأخبار السياسية: سانا','sana.png');
	sectionlist[0].addlink('live_syrian_tv.html','التلفزيون والإذاعة','Syriatvlogo.png');
	
	sectionlist[1].addlink('syria_embassy.html','دليل السفارات السورية','Syria_coat_of_arms.png');
	sectionlist[1].addlink('counsular_services_outside.html','دليل الخدمات القنصلية','moex.png');
	sectionlist[1].addlink('military_service.html','شؤون التجنيد','Syria_Armed_Forces_Emblem.png');
	sectionlist[1].addlink('expat_associations.html','النوادي السورية في العالم','syrians_abroad.png');
	
	sectionlist[2].addlink('phones.html','الاتصال هاتفيا مع سوريا','syria_phone.png');
	sectionlist[2].addlink('syriaair.html','رحلات السورية للطيران','syriaair.png');
	sectionlist[2].addlink('directory.html','دليل المواقع السورية','sy_tld_logo.png');
	sectionlist[2].addlink('invest_in_syria.html','دليل الاستثمار والأعمال','syrecon.png');
	sectionlist[2].addlink('donate_to_syria.html','إرسال التبرعات','daam.png');
	
	sectionlist[3].addlink('student_affairs.html','الطلاب المغتربين','students.png');
	sectionlist[3].addlink('schoolbag.html','الحقيبة الالكترونية للكتب المدرسية','syria_ecurricula.png');
	sectionlist[3].addlink('colors.html','تعليم الألوان للأطفال','colors.png');
	
	sectionlist[4].addlink('about_syria.html','معلومات عن سوريا','about_syria.jpg');
	sectionlist[4].addlink('media_resources.html','أغاني وتسجيلات','play.png');
	
	sectionlist[5].addlink('whatsnew.html','ما الجديد');
	sectionlist[5].addlink('contact.html','الاتصال مع مطور التطبيق',"contact.png");
	sectionlist[5].addlink('help.html','المساعدة والشروحات');
	sectionlist[5].addlink('about.html','عن التطبيق');
}

function checkEmail(emailAddress) {
	  var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
	  var sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
	  var sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
	  var sQuotedPair = '\\x5c[\\x00-\\x7f]';
	  var sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
	  var sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
	  var sDomain_ref = sAtom;
	  var sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')';
	  var sWord = '(' + sAtom + '|' + sQuotedString + ')';
	  var sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
	  var sLocalPart = sWord + '(\\x2e' + sWord + ')*';
	  var sAddrSpec = sLocalPart + '\\x40' + sDomain; // complete RFC822 email address spec
	  var sValidEmail = '^' + sAddrSpec + '$'; // as whole string

	  var reValidEmail = new RegExp(sValidEmail);

	  if (reValidEmail.test(emailAddress)) {
	    return true;
	  }

	  return false;
	}

function validateContactForm(){
	var valid=true;
  $("#messageresult").html(" ");
  if(!checkEmail($("#contactemail").val())){
    $("#messageresult").append("عنوان البريد الالكتروني غير صحيح<br />");
    valid=false;    
  }
  if($("#contactname").val().length<=5){
	  $("#messageresult").append("الاسم المدخل قصير جدا، الرجاء إدخال الاسم الكامل<br />");
	  valid=false;    
	}
  if($("#contacttext").val().length<=5){
	    $("#messageresult").append("نص الرسالة المدخل قصير جدا، الرجاء إدخال أكثر من 10 أحرف<br />");
	    valid=false;    
	  }
	return(valid);
}

function injectFooter(){
	$(".pagefooter").html(
			'      <div role="navigation" class="ui-navbar" data-role="navbar" data-iconpos="right">' +
		'        <ul class="ui-grid-c">' +
		'	        <li class="ui-block-a"><a class="ui-link ui-btn ui-icon-bullets ui-btn-icon-right" data-ajax="false" href="options.html" data-icon="bullets">خيارات</a></li>' +
		'	        <li class="ui-block-b"><a class="ui-link ui-btn ui-icon-home ui-btn-icon-right" rel="external" data-icon="home" href="http://syrians.alayham.com">الموقع</a></li>' +
		'	        <li class="ui-block-c"><a class="ui-link ui-btn ui-icon-action ui-btn-icon-right" rel="external" data-icon="action" href="https://m.facebook.com/groups/syrianexpats/">المجموعة</a></li>' +
		'	        <li class="ui-block-d"><a class="ui-link ui-btn ui-icon-share ui-btn-icon-right" href="" data-icon="share" onclick="syrians_share_app(); return false;">مشاركة</a></li> ' +
		'        </ul>' +
		'      </div>');
	$('.pagefooter').toolbar( { "role": "footer", "tapToggle": "true" , "position" : "fixed", "theme": "a"}).toolbar("refresh");
	
}
function injectBackButton(){
	$("<a/>",{
		"href": "#",
		"class": "backbutton ui-link ui-btn ui-icon-back ui-btn-icon-notext ui-btn-left ui-corner-all",
		"data-rel": "back",
		"click": function(e){
			e.preventDefault();
			parent.history.back();
		}
	}).text("back").appendTo($(".ui-page .ui-header"));
//	var btnhome= new backhome(); 
//	$(".withback").prepend(btnhome.render());
}

function injectMenuButton(){
	$(".ui-header").append('<a class="ui-link ui-btn-right ui-btn ui-shadow ui-icon-bars ui-btn-icon-notext ui-corner-all" data-role="button" href="#rightpanel">القائمة</a>');
}
function injectlocalcommands(){
	
    $(".localcommands").each(function(){
        var hostElement = $(this).children(".ui-collapsible-content");
        var elementID = "";
        if($(this).prop("id")){
          elementID = $(this).prop("id");
        }else{
          return(true); //Do not work on collapsibles that don't have a uuid
          elementID = "lc" + Math.floor((Math.random() * 100000000) + 1);
          $(this).attr("id",elementID);
        }
        $("<div/>",{"class": "lc nocopy"}).append($("<a/>",{
          "class" : "ui-link ui-btn ui-icon-share ui-btn-icon-notext ui-btn-inline ui-corner-all",
          "href" : "#",
        }).text("مشاركة").on(clickEvent(),function(){lcShare(elementID); return(false);})).append($("<a/>",{
          "class" : "ui-link ui-btn ui-icon-clipboard ui-btn-icon-notext ui-btn-inline ui-corner-all",
          "href" : "#",
        }).text("نسخ").on(clickEvent(),function(){lcCopy(elementID); return(false);})).prependTo(hostElement);
        
      });
    
}

function preparefilters(){
	$('.jqmfilter').blur(function(){
		localStorage.setItem($(this).attr("id"),$(this).val())
		
	});
	$('.jqmfilter').each(function(){
		$(this).val( localStorage.getItem($(this).attr("id")));
	});	
}

$(document).on("mobileinit", function(){
	$.mobile.defaultPageTransition = localStorage.getItem('hometrans');
	$.mobile.page.prototype.options.addBackBtn = true;
});

$(document).ready(function(){
	injectFooter();
	injectMenuButton();
	$(document).on(clickEvent(), '[rel="external"],.linksource', function (e) {
	    e.preventDefault();
	    var targetURL = $(this).attr("href");
	    
	    if(gaPlugin){
	  	  gaPlugin.trackEvent( gaEventSuccess, gaEventFailed, "User", "Click", "link", targetURL);
	    }else{
	  	  logmessage("gaPlugin Not found");
	    }
	    window.open(targetURL, "_system");

	});

    $( ":mobile-pagecontainer" ).on( "pagecontainerbeforechange", function( event, ui ) {

    });
	
    $( ":mobile-pagecontainer" ).on( "pagecontainerchange", function( event, ui ) {

	});
    $( ":mobile-pagecontainer" ).on( "pagecreate", function( event, ui ) {
    	injectFooter();
    	injectMenuButton();
    	injectBackButton();
    	injectlocalcommands();
    	preparefilters();
    	$.mobile.defaultPageTransition = localStorage.getItem('hometrans');
    });
	$( "body>[data-role='panel']" ).panel();

});

$("<link/>", {
     rel: "stylesheet",
     type: "text/css",
     href: "jquery-mobile/themes/" + localStorage.getItem('apptheme') + ".css"
  }).appendTo("head");
