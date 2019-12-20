function init(){
    siteLoad();
    $('#menuButton').on('click', menuToggle);
    jQuery('#main').on( "swipeleft", closeMenu)
    $('main').on('click', closeMenu);
    $('a').on('click', Link);
    $('#zendpagina textarea').on('click', fadeEverythingElse);
    $('#zendpagina textarea').blur(function(){
        becomeVisible();
    });
    $('#zendpagina button').on('click', sendMessage);
    $('#facebookComments textarea').on('click', openMessage);
    $('#sendForm #terugknop').on('click', closeMessage);
    $('#sendForm button').on('click', closeMessage);
    $('#sendForm button').on('click', send);
    $('form button').on('click', sendMail);
    randomTip();
}

var menuOpen = false;
var messageOpen = false;

function menuToggle() {
    if(menuOpen == true){
        TweenLite.to($('#menu'), 0.2 , {left:'-67%'});
        menuOpen = false;
    } else {
        TweenLite.to($('#menu'), 0.2 , {left:'0%'});
        menuOpen = true;
    }

}

function openMenu(){
    if(menuOpen == false){
        TweenLite.to($('#menu'), 0.2 , {left:'0%'});
        menuOpen = true;
    }
}

function closeMenu(){
    if(menuOpen == true){
        TweenLite.to($('#menu'), 0.2 , {left:'-67%'});
        menuOpen = false;
    }
}

function Link(e){
    e.preventDefault();
    TweenLite.to($('main'), 0.2 , {opacity:0});
    TweenLite.to($('#menu'), 0.2 , {left:'-67%'});
    var link = $(this).attr('href');
    setTimeout(function(){ window.location.replace(link); }, 500);
}


function siteLoad(){
    var t1 = new TimelineLite();
    t1.to($('main'), 0.2 , {opacity:1});
    $('main').children().each(function () {
        var id = this.id;
        var completeId = "#" + id;
        t1.from( $(completeId), 0.2 , {opacity:0});
    });
}

function openMessage(e){
    e.preventDefault();
    $('#sendForm textarea').focus();
    if(messageOpen == false){
        TweenLite.to($('#sendForm'), 0.2 , {left:'0%'});
        menuOpen = true;
    }
}

function fadeEverythingElse() {
    TweenLite.to($('nav'), 0.6 , {opacity:'0'});
    TweenLite.to($('main h2'), 0.6 , {opacity:'0'});
    TweenLite.to($('#tip'), 0.6 , {opacity:'0'});
    TweenLite.to($('button'), 0.6 , {opacity:'1'});
}

function becomeVisible(){
    TweenLite.to($('nav'), 0.6 , {opacity:'1'});
    TweenLite.to($('main h2'), 0.6 , {opacity:'1'});
    TweenLite.to($('#tip'), 0.6 , {opacity:'1'});
    TweenLite.to($('button'), 0.6 , {opacity:'0'});
}

function sendMessage(e){
    e.preventDefault();
    TweenLite.to($('#inzenden'), 0.6 , {opacity:'0', height:0});
    TweenLite.to($('main > h2'), 0.6 , {text:'Bedankt!'});
}

function send(e){
    e.preventDefault();
    TweenLite.to($('#sendForm'), 0.3 , {left:'100%'});
    TweenLite.to($('#facebookComments form'), 0.6 , {opacity:'0', height:0});
    $('#vraag').empty();
    $('#vraag').append('Bedankt!');
}

function sendMail(e){
    e.preventDefault();
    $('main form').empty();
    $('#mailing p').empty();
    $('#mailing p').append('Bedankt voor je mail!');
}


function closeMessage(e){
    e.preventDefault();
    TweenLite.to($('#sendForm'), 0.2 , {left:'100%'});
    var text = $('#sendForm textarea').val();
    $('#facebookComments textarea').append(text);
}

function randomTip(){
    var randomNumb = Math.floor((Math.random() * 4) + 1);
    if(randomNumb == 1){
        $('#tip h2').append('"Het duurt 25 jaar voordat kauwgom verteerd."');
    } else if(randomNumb == 2){
        $('#tip h2').append('"Er gaan dagelijks 10 vogels dood doordat kauwgom aan hun bek vastplakt."');
    } else if(randomNumb == 3){
        $('#tip h2').append('#Kauwgomloos');
    }else {
        $('#tip h2').append('"Kauwgom kan de bodem van de grond vergiftigen."');
    }
}

var getUrl = window.location;
var baseUrl = getUrl.protocol + "//" + getUrl.host + '/' + getUrl.pathname.split('/')[1];
var finalUrl = "http://" +baseUrl.split('/')[2] + '/api/vote';

function getVotes(){
    $.ajax({
        dataType: "json",
        url: finalUrl,
        success: voteGetter
    })
}

function voteGetter(data){
    var totalCount = data.length;
    var yesCount = 0;
    //console.log(yesCount);
    for(i=0; i< data.length; i++){
        if(data[i].vote == true){
            yesCount++;
        }
    }

    var yesProcent = 100 / totalCount * yesCount;

    console.log(yesProcent);
    $('#greenBar').css('width', yesProcent + "%");
    $('#procentStemmen').text(Math.ceil(yesProcent) + "%");
    $('#aantalStemmen').text(totalCount);

}

getVotes();

init();