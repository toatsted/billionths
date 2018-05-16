var portfolioWorth;
var cash;
var portfolioCoins = [];
var symbol = "";
var price;
var buyAmount = 0;

// Start new game and list the coins available on a dropdown menu
function newGame () {
    cash = 10000;
    portfolioWorth = 0;

    $.ajax({
        url: "https://api.coinmarketcap.com/v2/listings/",
        method: "GET"
    }).then(function (res) {
        for (let i = 0; i < res.data.length; i++) {
            $("#coinDropdown").append("<a class='dropdown-item coin' value='" + res.data[i].id + "'>" + res.data[i].symbol + "</a>")
        }
    });

    // Every half hour update portfolio worth
    setInterval(portfolioWorthUpdater, 1800000);

}

// On selecting a coin from dropdown menu create request for its current price
$(".coin").on("click", function() {
    var coinId = $(this).val();
    var queryUrl = "https://api.coinmarketcap.com/v2/ticker/" + coinId + "/";

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then( function (res) {
        symbol = res.data.symbol;
        price = res.data.quotes.USD.price;

        $("#selectedCoinSymbol").html(symbol);
        $("#selectedCoinPrice").html("$" + price);

    })
})

// After selecting coin, input amount to buy (decimals allowed) and check for necessary funds
$("#coinBuy").on("click", function() {
    if (parseFloat(buyAmount) > 0) {
        let buyPrice = Math.floor(price * buyAmount);

        if (buyPrice > cash) {
            alert("You do not have enough funds to make this purchase.")
        } else {
            let purchaseDate = Date.now();
            let newPurchase = {
                coin: symbol,
                purchaseStats: {
                    purchasePrice: price,
                    purchaseAmount: buyAmount,
                    purchaseDate: purchaseDate
                }
            };

            portfolioCoins.push(newPurchase);
            
            cash = Math.floor(cash - buyPrice);

        }
    } else {
        alert("Please enter a valid number.");
    }
})

// Update portfolio total worth, triggered on first buy and then updates every half hour
function portfolioWorthUpdater () {
    // need to see database structure to pull relevant the relevant info to create the ajax call
}