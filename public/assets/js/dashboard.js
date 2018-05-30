$(document).ready(function () {

    $(document).on('click', "#populateTransactions", getTransactions);
    $(document).on('click', ".deleteTransaction", deleteTransaction);

    var transactions = [];



    //Get all user transactions
    function getTransactions(event) {
        event.preventDefault();

        $.get("/api/transactions", function (data) {
            transactions = data;
            console.log(transactions);
            initalizeRows();
        });
    }

    function initalizeRows() {
        $("#purchasedCryptos").empty();

        for (var i = 0; i < transactions.length; i++) {
            var purchase = {
                id: transactions[i].id,
                coin: transactions[i].coin,
                coinId: transactions[i].coinId,
                purchaseAmount: transactions[i].purchaseAmount,
                purchasePrice: transactions[i].purchasePrice,
                purchaseDate: transactions[i].createdAt
            };

            $("#purchasedCryptos").prepend("<div class='card'><div class='card-header'>" + purchase.coin + "<button class='deleteTransaction btn btn-danger' value='" + purchase.id + "'>Delete</button></div><div class='card-body'><div class='row'><div class='col'><h5 class='card-title'>Purchased on: " + purchase.purchaseDate + "</h5><p class='card-text'>Amount Purchased: " + purchase.purchaseAmount + "  |  Purchase Price: $" + purchase.purchasePrice + "</p></div></div></div></div>");
        }
    }

    function deleteTransaction(event) {
        event.stopPropagation();
        var id = $(this).val();

        $.delete("/api/transactions" + id).then(getTransactions);
    }
});