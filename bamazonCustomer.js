//dependencies 
const mysql = require("mysql");
const inquirer = require("inquirer");

//create connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost", 
    port: 3306, 
    user: "root", 
    password: "",
    database: "bamazon"
});

//connect to mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId + "\n");
    start();
});

//function to display the sales prompts
function showPrompt() {

    //prompt to ask what item and quantity
    inquirer
        .prompt([
            {
                name: "whatProduct",
                type: "input",
                message: "Enter the Item ID of the product you wish to purchase.",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "howMany", 
                type: "input", 
                message: "How many would you like to buy?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer) {
            let choiceId = answer.whatProduct;
            let amount = answer.howMany;

            //Pull item from database
            connection.query("SELECT * FROM products WHERE item_id =?", [choiceId], function(err, res) {
                if (err) throw err;

                if (res.length === 0) {
                    
                    console.log("\n\n===============================================");
                    console.log("ERROR: Invalid Item ID.");
                    console.log("===============================================\n\n");

                    start();
                } else
        
                //Calculate order total
                if (amount <= res[0].stock_quantity) {
                    let total = parseFloat(res[0].price * amount);
                    console.log("\nThanks for ordering " + res[0].product_name + "!");
                    console.log("Your total is: $" + total + "\n");
                    console.log("===============================================");

                    //Update inventory
                    connection.query("UPDATE products SET ? WHERE ?", [
                        {
                            stock_quantity: res[0].stock_quantity - amount
                        },
                        {
                            item_id: choiceId
                        }
                    ], function(err) {
                        if (err) throw err;
                        console.log("Inventory Updated.");
                        console.log("===============================================\n");

                        connection.end();
                    });
                } else {
                    console.log("\nThere is insufficient stock to complete your order." + "\n");
                    connection.end();
                };
            });        
        });
}

//function to diplay items for sale
function start() {
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
        showPrompt();
    });
}