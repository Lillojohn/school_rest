setInterval(check, 200);
var apiCount = 0;
var apiCompare = 0;
var getUrl = window.location;
var baseUrl = getUrl.protocol + "//" + getUrl.host + '/' + getUrl.pathname.split('/')[1];
var finalUrl = "http://" +baseUrl.split('/')[2] + '/api/vote';
console.log(finalUrl);

function getVotes(){
    $.ajax({
        dataType: "json",
        url: finalUrl,
        success: voteGetter
    })
}

function voteGetter(data){
    voteCount = data.length;

}

var firstTime = false;
var secondTime = false;

function check(){
    getVotes();
    compareVotes();
}

function compareVotes(){
    if(firstTime == true){
        if(apiCount != voteCount){
            apiCount = voteCount;
            if(secondTime == true){
                $('h2').text('Bedankt voor het stemmen');
                $('p').css('display', 'none');
                $('img').css('display', 'block');
            }
        }
        secondTime = true;
    }
    firstTime = true;


}

setInterval(begin, 40000);

function begin(){
    $('h2').text('Ik heb last van kauwgom op de grond.');
    $('p').css('display', 'block');
    $('img').css('display', 'none');
}

