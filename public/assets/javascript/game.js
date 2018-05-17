var portfolioWorth;
var cash;
var portfolioCoins = [];
var symbol = "";
var price;
var buyAmount = 0;
var coinId;

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

    app.delete("/api/posts/:id", function (req, res) {
        db.Post.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (dbPost) {
            res.json(dbPost);
        });
    });
    // Every half hour update portfolio worth
    setInterval(portfolioWorthUpdater, 1800000);

}

// On selecting a coin from dropdown menu create request for its current price
$(".coin").on("click", function() {
    coinId = $(this).val();
    let queryUrl = "https://api.coinmarketcap.com/v2/ticker/" + coinId + "/";

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
    event.preventDefault();

    if (parseFloat(buyAmount) > 0) {
        let buyPrice = Math.floor(price * buyAmount);

        if (buyPrice > cash) {
            alert("You do not have enough funds to make this purchase.")
        } else {

            cash = Math.floor(cash - buyPrice);
            // userId is undefined until we get auth working

            var newPurchase = {
                userId: userId,
                coin: symbol,               
                coinId: coinId,
                purchasePrice: price,
                purchaseAmount: buyAmount,
                currentCash: cash
                
            };

            $.post("/api/new", newPurchase)
                .then(function(data){
                    console.log(data);
                });
    
        }
    } else {
        alert("Please enter a valid number.");
    }
})

function portfolioWorthUpdater () {

}