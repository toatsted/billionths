$(document).ready(function () {

    $(document).on('click', "#populateTransactions", getTransactions);

    var transactions = [];

    var $transactionContainer = $(".transaction-container");


    //Get all user transactions
    function getTransactions(event) {
        event.preventDefault();

        $.get("/api/transactions", function (data) {
            transactions = data;
            initalizeRows();
        });
    }

    function initalizeRows() {
        $transactionContainer.empty();
        var rowsToAdd = [];
        for (var i = 0; i < transactions.length; i++) {
            rowsToAdd.push(createNewRow(transactions[i]));
        }
        $transactionContainer.prepend(rowsToAdd);
    }




});