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
    menuPrompt();
});

function menuPrompt() {
    inquirer
        .prompt([
            {
                name: "menu",
                type: "list",
                message: "Select Action",
                choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product", "EXIT"]
            }
        ])
        .then(function(answer) {
            switch(answer.menu) {
                case "View Products For Sale":
                    showProducts();
                    break;
                case "View Low Inventory":
                    lowInventory();
                    break;
                case "Add To Inventory":
                    addInventory();
                    break;
                case "Add New Product":
                    addProduct();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        })
}

function showProducts() {
    connection.query("SELECT * FROM products", function(err, result) {
        if (err) throw err;

        console.log("\nItems for sale: \n");
        let productArray = [];
        for (let i = 0; i < result.length; i ++) {
            productArray.push(
                "Product: " + result[i].product_name + 
                " | Item ID: " + result[i].item_id +
                " | Price: " + result[i].price +
                " | Quantity: " + result[i].stock_quantity
            );
            console.log(productArray[i] + "\n");
        }
        console.log("===============================================");
        menuPrompt();
    });
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, result) {
        if (err) throw err;

        console.log("\nItems With Low Stock: \n");
        let lowInvArray = [];
        for (let i = 0; i < result.length; i++) {
            lowInvArray.push(
                "Product: " + result[i].product_name + 
                " | Item ID: " + result[i].item_id +
                " | Price: " + result[i].price +
                " | Quantity: " + result[i].stock_quantity
            );
            console.log(lowInvArray[i] + "\n");
        }
        console.log("===============================================");
        menuPrompt();
    });
}

function addInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
    })
    inquirer
        .prompt([
            {
                name: "choiceId",
                type: "input",
                message: "Enter the item ID for the product you would like to update.",
            }
        ])
        .then(function(answer) {
            restock(answer.choiceId);
        });
}

function restock(itemId) {
    let item = itemId;
    let stockQuant;
    connection.query("SELECT stock_quantity FROM products WHERE item_id=?", [item], function(err, result) {
        if (err) throw err;
        stockQuant = parseFloat(result[0].stock_quantity);
    });

    inquirer
        .prompt([
            {
                name: "addQuantity",
                type: "input",
                message: "How many would you like to add?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer) {
            let addAmount = parseFloat(answer.addQuantity);
            connection.query("UPDATE products SET ? WHERE ?", [
                {
                    stock_quantity: stockQuant + addAmount
                },
                {
                    item_id: item
                }
            ], function(err) {
                if (err) throw err;
            });
            console.log("Inventory Updated.");
            console.log("===============================================");
            showProducts();
        });
}

function addProduct() {
    inquirer
        .prompt([
            {
                name: "newName",
                type: "input",
                message: "Please enter the product name."
            },
            {
                name: "newDept",
                type: "input",
                message: "Please enter the department."
            },
            {
                name: "newPrice",
                type: "input",
                message: "Please enter the price."
            },
            {
                name: "newQuant",
                type: "input",
                message: "Please enter the quantity."
            }
        ])
        .then(function(answer) {
            console.log("Adding New Item: \n" + answer.newName +
                        " | Department: " + answer.newDept +
                        " | Price: " + answer.newPrice +
                        " | Quantity: " + answer.newQuant
            );

            connection.query("INSERT INTO products SET ?", 
                {
                    product_name: answer.newName,
                    department_name: answer.newDept,
                    price: answer.newPrice,
                    stock_quantity: answer.newQuant
                }, 
                function(err) {
                    if (err) throw err;

                    console.log("Product Successfully Added.");
                    console.log("===============================================");
                    menuPrompt();
                }
            );
        });
}