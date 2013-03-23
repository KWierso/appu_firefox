
var bg_response = undefined;

function read_minutes() {
    var minutes = parseFloat($('#input-minutes').val());
    if (minutes == NaN || (minutes % 1 != 0)) {
	console.log('Enter only valid minutes');
	$("#error-message").text('Please enter a valid number');
	$("#accept-minutes").addClass('error');
    }
    else {
	$("#accept-minutes").removeClass('error');
	message = {};
	message.type = "status_change";
	message.status = "disable";
	message.minutes = minutes;
	chrome.extension.sendMessage("", message, function() {});
	self.close();
    }
    return false;
}

function disable() {
    $('.dropdown-toggle').dropdown('toggle');
    $('#enter-minutes').show();
    //$('body').css({'width': '220px', 'min-height': '100px'});
    $('#input-minutes').focus();
}

function enable() {
    message = {};
    message.type = "status_change";
    message.status = "enable";
    chrome.extension.sendMessage("", message, function() {});
    self.close();
    return false;
}

function openTab(url) {
    chrome.tabs.create({ url: url });
    window.close();
}

function report() {
    openTab(chrome.extension.getURL('report.html'));
    self.close();
    return false;
}

function sign_in() {
    openTab(chrome.extension.getURL('sign_in.html'));
    self.close();
    return false;
}

function sign_out() {
    chrome.extension.sendMessage("", {
	'type' : 'sign-out',
    });
    self.close();
    return false;
}

function options() {
    openTab(chrome.extension.getURL('options.html'));
    self.close();
    return false;
}

function footprint() {
    openTab(chrome.extension.getURL('myfootprint.html'));
    self.close();
    return false;
}

function about() {
    openTab('http://appu.gtnoise.net/');
    self.close();
    return false;
}

function send_feedback() {
    openTab(chrome.extension.getURL('feedback.html'));
    self.close();
    return false;
}

function show_menu(response) {
    console.log("here here 1");
    //$('body').css('background-color', 'green');

    if (response.status == "not-signed-in") {
	//$('#sign-in-menu-list').addClass('.dropdown-menu-displayed');
	$('#sign-in-menu').dropdown('toggle');
	
// 	var classList = $('#sign-in-menu-div').attr('class').split(/\s+/);
// 	$.each( classList, function(index, item){
// 		console.log("Here here: Class: " + item);
// 	    });

	console.log("here here 2: " + $('#sign-in-menu').dropdown);
    }
    if (response.status == "signed-in") {
	$('#login-name').html(" " + response.login_name);
	$('body').css('background-color', 'green');

	$('#sign-out-menu-list').css('display', 'block');
	$('#sign-out-menu-list').css('position', 'static');

	console.log("Here here: Sending message displayed");

	m = {
	    height : $('#sign-out-menu-list').height(),
	    width: $('#sign-out-menu-list').width()
	}

	self.port.emit("displayed", m);

	//$('#sign-out-menu').dropdown('toggle');
	bg_response = response;
	if (bg_response.appu_status == 'disabled') {
	    $("#appu-signedin-menu-icon").attr("src", "images/appu_new19_offline.png");
	}
	console.log("here here 3");
    }
    console.log("here here 4");
}

self.port.on("resized", function() {
	console.log("Panel resized, isShowing: " + self.isShowing123);
	console.log("Panel resized, height: " + $('body').height() + ", width: " + $('body').height());
    })

document.addEventListener('DOMContentLoaded', function () {

	console.log("Here here: contentloaded");
    $("#disable").on("click", function() { disable();});
    $('#disable-submit').on('click', read_minutes);

    $("#enable").on("click", enable);
    $("#report").on("click", report); 
    $("#options").on("click", options) 
    $("#footprint").on("click", footprint); 
    $("#about").on("click", about); 
    $("#feedback").on("click", send_feedback); 

    $("#sign-in").on("click", sign_in); 
    $("#sign-out").on("click", sign_out); 
});

$(document).ready(function() {
    $('#disable').tooltip({
	'title' : 'Disable Appu across all tabs',
	'placement' : 'up',
	'delay': { 'show': 500, 'hide': 0 },
    });

    $('#enable').tooltip({
	'title' : 'Enable Appu across all tabs',
	'placement' : 'up',
	'delay': { 'show': 500, 'hide': 0 },
    });

    $('#enter-minutes').hide();

//     chrome.extension.sendMessage("", {
// 	'type' : 'get-signin-status',
//     }, show_menu);

    show_menu({
	    status : "signed-in"
	});

    $('body').css({'max-width': '200px', 'max-height': '200px'});
});
