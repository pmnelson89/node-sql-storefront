//dependencies 
const mysql = require("mysql");
const inquirer = require("inquirer");

//create connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost", 
    port: 3306, 
    user: "root", 
    password: "America$1776",
    database: "bamazon"
});

//connect to mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId + "\n");
    start();
});

function start() {

    //display items
    showItems();

    //prompt to ask what item and quantity
    inquirer
        .prompt([
            {
                name: "whatProduct",
                type: "input",
                message: "Enter the Item ID of the product you wish to purchase."
            },
            {
                name: "howMany", 
                type: "input", 
                message: "How many would you like to buy?"
            }
        ])
        .then(function(answer) {
            let productChoice = answer.whatProduct;
            let amount = answer.howMany;
            checkout(productChoice, amount);
        });
}

//function to diplay items for sale
function showItems() {
    connection.query("SELECT * FROM products", function(err, result) {
        if (err) throw err;

        console.log("\nItems for sale: \n");
        let productArray = [];
        for (let i = 0; i < result.length; i ++) {
            productArray.push(
                "Product: " + result[i].product_name + 
                " | Item ID: " + result[i].item_id +
                " | Price: " + result[i].price
            );
            console.log(productArray[i] + "\n");
        }
        console.log("===============================================");

    });
}

//function to complete an order
function checkout(itemId, amount) {
    connection.query("SELECT * FROM products WHERE item_id = " + itemId, function(err, res){
        if (err) throw err;

        if (amount <= res[0].stock_quantity) {
            let total = res[0].price * amount;
            console.log("\nThanks for ordering " + res[0].product_name + "!");
            console.log("Your total is: " + total + "\n");

            // connection.query("UPDATE products SET stock_quantity = stock_quantity - " + amount + "WHERE item_id = " + itemId);
        } else {
            console.log("\nThere is insufficient stock to complete your order." + "\n");
        };
    });
}