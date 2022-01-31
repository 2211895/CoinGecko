var coinData;

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

$(document).ready(function(){
    var coinId= $.urlParam('id');
    if (coinId!==null && coinId!=="") {
        requestCoinGeckoData(coinId);
    }
});

function parseCoinData(res, priceFormatter, marketCapFormatter) {
    coinData=res;
    var coin=coinData[0];
    var coinImage = coin['image'];
    var coinName = coin['name'];
    var marketCapRank = coin['market_cap_rank'];
    var currentPrice = priceFormatter.format(coin['current_price']);
    var marketCap = marketCapFormatter.format(coin['market_cap']);
    var marketCapChangePercentage24h = coin['market_cap_change_percentage_24h']<0 ? coin['market_cap_change_percentage_24h'] : '+' + coin['market_cap_change_percentage_24h'];
    var high24h = priceFormatter.format(coin['high_24h']);
    var low24h = priceFormatter.format(coin['low_24h']);
    var symbol = coin['symbol'].toUpperCase();
    var totalSupply = coin['total_supply'] !== null ? coin['total_supply'] : 'N/A';
    createHTML(coinImage, coinName, marketCapRank, currentPrice, marketCap, marketCapChangePercentage24h, high24h, low24h, symbol, totalSupply)

}

function createHTML(image, name, rank, price, marketCap, percentage24h, high, low, symbol, totalSupply) {
    var target= $("#coin-detail");
    target.append("<div class='detail-header'><img src='" + image + "' height='100' width='100'/><h1 class='coin-name'>- " + name + "</h1></div></div><div class='row'><div class='col-12 col-lg-5' ><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae rhoncus magna. Maecenas et lacus eros. Aenean ultricies erat sapien, in eleifend lorem rhoncus eu. Cras dapibus nibh ac hendrerit laoreet. Vestibulum ut urna lectus. Pellentesque commodo orci ut magna bibendum, fermentum venenatis libero maximus. Etiam nec risus vehicula, varius ante non, semper massa. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nunc at odio felis. Nunc dignissim sed nibh et gravida. Aliquam at bibendum massa. Nullam tristique, nunc vestibulum efficitur imperdiet, lacus nulla scelerisque risus, ut lacinia orci neque non erat. Etiam blandit imperdiet egestas.</p><p>Suspendisse placerat nibh libero, sed iaculis augue rhoncus a. Praesent posuere, eros a rutrum egestas, risus tellus laoreet felis, a consequat est erat vel diam. Maecenas vestibulum maximus magna, id ornare purus egestas a. Quisque ultricies erat orci, id pretium nulla sagittis ac. Duis feugiat dapibus diam, vitae vulputate ex fermentum id. Praesent arcu dui, congue nec pretium sit amet, scelerisque eu est. Etiam efficitur tincidunt nulla, et lobortis libero ultricies eget. Donec vehicula ante neque, et tristique sem iaculis eget. Phasellus ligula nulla, fringilla non fringilla vel, efficitur id urna. Donec risus tortor, mollis ut gravida a, pretium ac tellus. Vestibulum sit amet eros nisi. Nunc cursus posuere massa vel ornare.</p></div><div class='col-5 col-lg-2 offset-lg-1'><ul class='details-param'><li>Name:</li><li>Ranking:</li><li>Value:</li><li>Market cap:</li><li>Last 24h:</li><li>High 24h:</li><li>Low 24h:</li><li>Symbol:</li><li>Total coins:</li></ul></div><div class='col-6 col-lg-2 '><ul class='extra-details'><li>"+ name + "</li><li>#"+ rank + "</li><li>"+ price + "</li><li>"+ marketCap + "</li><li>"+ percentage24h + "%</li><li>"+ high + "</li><li>"+ low + "</li><li>"+ symbol + "</li><li>"+ totalSupply + "</li></ul></div></div></div>");
}

function requestCoinGeckoData(coinId) {
    $.ajax({
        url:'https://api.coingecko.com/api/v3/coins/markets?ids='+coinId+'&vs_currency=usd',
        headers:{
            'Content-Type': 'application/json'
        },
        method: 'GET',
        dataType: 'json',
        data: '',
        success: function(res){
            parseCoinData(res, priceFormatter, marketCapFormatter);
        }
    });
}

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null) {
       return null;
    }
    return decodeURI(results[1]) || 0;
}