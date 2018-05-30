var symbol = "";
var price;
var coinAmount = 1;
var coinId;

var money;
var cryptos;
var transactions = [];

// ===========================================
// Transactions page
// ===========================================
$(document).ready(function () {

    $(document).on("click", "#buyTransaction", buyTransaction);
    
    

    $.ajax({
        url: "https://api.coinmarketcap.com/v2/ticker/?limit=10",
        method: "GET"
    }).then(function (res) {
        cryptos = res.data;
        // console.log(cryptos)

        // Grabs the default coin (Bitcoin) and displays its information to the page
        coinId = $('#coinDropdown').val();
        $("#coinIcon").html(`<img height="32" width="32" src="https://unpkg.com/@icon/cryptocurrency-icons/icons/${cryptos[coinId].symbol.toLowerCase()}.svg" />`)
        $("#coinName").html(`<h3>Current ${cryptos[coinId].name} Price:`);
        $("#coinPrice").html(`<h4 id="cryptoPrice">$${cryptos[coinId].quotes.USD.price}`);

        // Function to update the crypto information displayed on the page depending on which crypto is selected
        $('#coinDropdown').change(function () {
            coinId = $('#coinDropdown').val();
            let queryUrl = "https://api.coinmarketcap.com/v2/ticker/" + coinId + "/";

            $("#coinIcon").html(`<img height="32" width="32" src="https://unpkg.com/@icon/cryptocurrency-icons/icons/${cryptos[coinId].symbol.toLowerCase()}.svg" />`)
            $("#coinName").html(`<h3>Current ${cryptos[coinId].name} Price:`);
            $("#coinPrice").html(`<h4 id="cryptoPrice">$${cryptos[coinId].quotes.USD.price}`);
        });
        });


    getUserMoney();

    function getUserMoney(event) {
        $.ajax({
            url: "/api/user",
            method: "GET"
        }).then(function (res) {
            money = res.money;
            $("#moneyAmount").html("$ " + money);
        });
    }

    function updateUserMoney(event) {
        $.ajax({
            url: "/api/user",
            type: "PUT",
            data: money
        }).then(getUserMoney);
    }

    // This function inserts a new transactions into our database
    function buyTransaction(event) {
        event.preventDefault();

        

        var purchasePrice = cryptos[coinId].quotes.USD.price;
        coinAmount = $("#coinAmount").val();
        // Grab the symbol of the crypto being purchased
        var coinSymbol = cryptos[coinId].symbol;
        // Determine the cost of the overall transaction
        var transactionCost = purchasePrice * coinAmount;

        console.log(transactionCost);

        if (money < transactionCost) {
            window.alert("Not enough money to complete transaction!")
        } else {

            var transaction = {
                coin: coinSymbol,
                coinId: coinId,
                purchasePrice: purchasePrice,
                purchaseAmount: coinAmount
            };

            money -= transactionCost;

            $.post("/api/transactions", transaction).then(updateUserMoney);



            
        }

    };

});
// ===========================================
// ===========================================