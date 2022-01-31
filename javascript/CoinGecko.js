'use strict'

var baseAPI = 'https://api.coingecko.com/api/v3/coins/markets?per_page=100&vs_currency=usd';
var coinData;
var altData;
var isShowingFavorites = false;
var favorites = getCookie('favorites') !== '' ? JSON.parse(getCookie('favorites')) : null;

var priceFormatter = new Intl.NumberFormat('en-US',{
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 9,
    minimumFractionDigits: 2,
});

var marketCapFormatter = new Intl.NumberFormat('en-US',{
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});


var extrapriceFormatter = new Intl.NumberFormat('en-US',{
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 9,
    minimumFractionDigits: 2,
});


var extramarketCapFormatter = new Intl.NumberFormat('en-US',{
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
});

$(document).ready(function(){
    requestCoinGeckoData(baseAPI);
});

function parseCoinData(res) {
    coinData=res;
    $('#table-body tr').remove();
    $('#table-body').append("<tr></tr>");

    for(var i=0; i< coinData.length; i++){
        var rowId = 'row-' + coinData[i]["id"];
        var imageUrl = "<img src='"+coinData[i]['image']+"' height='30' width='30' align='center'/>";
        var isFav = isFavorite(coinData[i]["id"]);
        var percentage24h = coinData[i]["market_cap_change_percentage_24h"] !== null ? coinData[i]["market_cap_change_percentage_24h"].toFixed(2): "--" ;
        var lineHtml = createLineHtml(i, coinData[i], rowId,priceFormatter, marketCapFormatter, isFav, imageUrl, percentage24h)
        $('#table-body tr:last').after(lineHtml);
    }
}

function createLineHtml(index, data, rowId, priceForm, marketCapForm, isFav, imageUrl, percentage24h) {
    var rank = data["market_cap_rank"];
    var id = data["id"];
    var name = data["name"];
    var price = priceForm.format(data["current_price"]);
    var marketcap = marketCapForm.format(data["market_cap"]);
    var url = "Details.html?id=" + id;
    var image= imageUrl;
    var percentage24h = percentage24h <0 ? percentage24h : '+' + percentage24h;
    var heartClass = isFav ? "fas fa-heart is-favorite" : "far fa-heart";

    return '<tr id="'+ rowId +'" class="text-center"><th scope="row">' +rank + '</th><td class="text-center">'+ image +'</td><td><a href="' + url +'">' + name + '</a></td><td>' + price + '</td><td class=>' + percentage24h + '%</td><td>' + marketcap +'</td><td class="text-center"><i class="' + heartClass + ' add-favorites" data-coin="'+ id +'"></i></td></tr>';
}

function requestCoinGeckoData(url) {
    $('#favorites').addClass("disabled");
    $.ajax({
        url: url,
        headers:{
            'Content-Type': 'application/json', 
        },
        method: 'GET',
        dataType: 'json',
        data: '',
        success: function(res){
            parseCoinData(res);
            $('#favorites').removeClass("disabled");
        }
    });
}

$('#favorites').click(function(){
    var clicked = $(this);
    if(isShowingFavorites){
        clicked.removeClass("btn-light");
        clicked.addClass("btn-dark");
        requestCoinGeckoData(baseAPI);
    }
    else{
        clicked.removeClass("btn-dark");
        clicked.addClass("btn-light");
        if (favorites !== null) {
            var coinsToShow = favorites.join(",");  
            requestCoinGeckoData('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids='+coinsToShow+'&order=market_cap_desc&per_page=100&page=1&sparkline=false');
        }
        else{
            alert("Não há favoritos");
        }
        
    }
    isShowingFavorites = !isShowingFavorites;
});

$(document).on("click",".add-favorites",function(){
    var clicked = $(this);
    var clickedCoin = clicked.attr("data-coin");
    var isFav = isFavorite(clickedCoin);

    if (isFav) {
        clicked.removeClass("is-favorite");
        clicked.removeClass("fas");
        clicked.addClass("far");
        favorites = favorites.filter(function(f){
            return f !== clickedCoin;
        })
    }
    else{
        clicked.addClass("is-favorite");
        clicked.addClass("fas");
        clicked.removeClass("far");
        if (favorites !== null) {
            favorites.push(clickedCoin);
        }
        else{
            favorites = [clickedCoin];
        }
    }
    var updatedFavorites = JSON.stringify(favorites);
    setCookie('favorites', updatedFavorites, 14);
});

function isFavorite(coin){
    return favorites !== null && favorites.includes(coin);
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
  
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function coinGeckoSearch(url) {
    $.ajax({
        url: url,
        headers:{
            'Content-Type': 'application/json', 
        },
        method: 'GET',
        dataType: 'json',
        data: '',
        success: function(res){
            var result = parseSearchData(res);
            requestCoinGeckoData('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids='+result+'&order=market_cap_desc&per_page=100&page=1&sparkline=false')
        },
    });
}

function parseSearchData(res){
    var searchData=res.coins;
    var searchedCoin="";

    for(var i=0; i< searchData.length; i++){
        var searchId = searchData[i]["id"];
        if(i===0){
            searchedCoin = searchId;
        }
        else{
            searchedCoin = searchedCoin.concat(",",searchId);
        }
        
    }
    console.log(searchedCoin);
    return searchedCoin;  
}

function searchCoin() {
    console.clear();
    var input, filter="";
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    console.log(filter);
    if (filter.length >= 3) {
        coinGeckoSearch('https://api.coingecko.com/api/v3/search?query=' + filter);
    }
    else if (filter.length == 2) {
        requestCoinGeckoData(baseAPI);
    }
}


$('#top10').click(function(){
    if ($(this).text() == "Top 100") {
        requestCoinGeckoData('https://api.coingecko.com/api/v3/coins/markets?per_page=10&vs_currency=usd');
    }
    else{
        requestCoinGeckoData(baseAPI);
    }
});

function changeText(){
    var top10 = $('#top10');
    if (top10.text() == "Top 10") {
        top10.text("Top 100");
    }
    else{
        top10.text("Top 10");
    }
}