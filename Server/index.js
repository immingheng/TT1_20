const express = require("express");
const cors = require("cors");
const session = require("express-session");

// Import DB
const Pool = require('pg').Pool;
const { response } = require("express");
const e = require("express");
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    // database: 'DBSMarketplace',
    database: 'dbsmarketplace',
    password: 'password',
    port: 5432,
  })
// const pool = require("./app/config/db.config")
// import pool from "./app/config"
console.log(pool)

/** ------------------------------------- EXPRESS ------------------------------------- */

const app = express();
app.use(express.json());
app.use(cors({
    origin: `http://localhost:4000`,
    credentials: true
}));
app.use(
    session({
        secret: `dbs-secret`,
        resave:true,
        saveUninitialized: true,
    })
);

/** ------------------------------------- AUTHENTICATION ------------------------------------- */

// POST: Check user ## UNCOMPLETE
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req?.body;

        // SQL COMMAND: SELECT * FROM <table>
        const searchCount = await pool.query("SELECT COUNT(*) FROM customer WHERE username = $1 AND password = $2", [username, password]);
        
        const { count } = searchCount.rows[0];

        if (parseInt(count) > 0){
            // This is bad, passing password to the front
            const user = await pool.query("SELECT * FROM customer WHERE username = $1 AND password = $2", [username, password]);

            res.json(user.rows[0]) 
        } else {
            res.json(false) // Send false if count = 0
        }

    } catch (error) {
        console.log(error.message)
    }
});

/** ------------------------------------- ROUTES ------------------------------------- */

// POST: Login user


// GET: Logout user

// GET: Get logged in User

// GET: All Products
app.get("/product", async (req, res) => {
    try {

        // SQL COMMAND: SELECT * FROM <table>
        const allProducts = await pool.query("SELECT * FROM product");

        res.json(allProducts.rows) // Only return the first entry from res["rows"] instead of returning everything

    } catch (error) {
        console.log(error.message)
    }
});

// GET: All Categories
app.get("/category", async (req, res) => {
    try {

        // SQL COMMAND: SELECT * FROM <table>
        const allCategories = await pool.query("SELECT * FROM category");

        res.json(allCategories.rows) // Only return the first entry from res["rows"] instead of returning everything

    } catch (error) {
        console.log(error.message)
    }
});

// GET: Return a list of all products from the OrderItem table
app.get("/orderitem", async (req, res) => {
    try {

        // SQL COMMAND: SELECT * FROM <table>
        const allOrderItems = await pool.query("SELECT * FROM order_item");

        res.json(allOrderItems.rows) // Only return the first entry from res["rows"] instead of returning everything

    } catch (error) {
        console.log(error.message)
    }
});

// GET: Return a order with status pending
app.get("/getOrder/:customerid", async(req, res) => {
    try {
        const customerid = req.params.customerid
        pool.query(`SELECT id FROM orders WHERE customer_id = ${customerid} AND status = 0`, (error, results) => {
            if (error) {
                console.log("error")
                console.log(error)
            }
            res.status(200).json(results.rows)
        })
    } catch (error) {
        console.log(error.message)
    }
})

app.post("/createOrder/:customerid", async(req, res) => {
    try {
        const customerid = req.params.customerid
        const order = await pool.query(`INSERT INTO orders (customer_id, status) VALUES (${customerid}, 0)`)
        // orderid = order.rows[0].id
        // console.log(orderid)
        res.status(200).json(order)
    } catch (error) {
        console.log(error.message)
    }
})

// POST: Insert products added from frontend cart into database
app.post("/add", async (req, res) => {
    try {
        const { customerid, productid, qty } = req?.body;
        // const customerid = req.params.customerid
        // const productid = req.params.productid
        // const qty = req.params.qty
        console.log(customerid, productid, qty)

        pool.query(`SELECT price FROM product WHERE id = ${productid} `, (error, results) => {
            if (error) {
                console.log(error)
            }
            const price = results.rows[0].price
            const total_price = parseFloat(qty) * parseFloat(price)
            var orderid;
            if (results.rows.length != 0) { 
                pool.query(`SELECT id FROM orders WHERE customer_id = ${customerid} AND status = 0`, (error, results) => {
                    if (error) {
                        console.log(error)
                    }
                    if (results.rows.length != 0) {
                        orderid = results.rows[0].id  
                    } else {
                        pool.query(`INSERT INTO orders (customer_id, status) VALUES (${customerid}, 0)`, (error, results) => {                          
                            pool.query(`SELECT id FROM orders WHERE customer_id = ${customerid} AND status = 0`, (error, results) => {
                                if (error) {
                                    console.log(error)
                                }
                                if (results.rows.length != 0) {
                                    orderid = results.rows[0].id  
                                } 
                            })
                        })        
                    }
                    pool.query(`SELECT product_qty FROM order_item WHERE product_id = ${productid} AND order_id = ${orderid}`, (error, results) => {
                        if (error) {
                            console.log(error)
                        }
                        if (results.rows.length != 0) {
                            var newQty = results.rows[0].product_qty + parseInt(qty)
                            var newTotalPrice = parseFloat(newQty) * parseFloat(price)
                            console.log(newTotalPrice.toFixed(2))
                            pool.query(`UPDATE order_item SET product_qty = ${newQty}, total_price = ${newTotalPrice.toFixed(2)} WHERE order_id = ${orderid} AND product_id = ${productid}`, (error, results) => {
                                if (error) {
                                    console.log(error)
                                    res.status(400).json(error)
                                } else {
                                    res.status(200).json(results.rows)
                                }
                            })
                        } else {
                            pool.query(`INSERT INTO order_item(product_id, order_id, product_qty, total_price) VALUES (${productid}, ${orderid}, ${qty}, ${total_price})`, (error, results) => {
                                if (error) {
                                    console.log(error)
                                    res.status(400).json(error)
                                } else {
                                    res.status(200).json(results.rows)
                                }
                            })
                        }
                        // res.status(200).json("ok")
                    })
                })
                
            } else {
                res.status(400).json(error)
            }
        })

    } catch (error) {
        console.log(error.message)
    }
});

// POST: Delete from the OrderItem table

// Need a method to check if user is logged in


/** SERVER LISTEN AT PORT 4000 */

// GET: Return a list of all products from the OrderItem table
app.get("/orderitem", async (req, res) => {
    try {

        // SQL COMMAND: SELECT * FROM <table>
        const allOrderItems = await pool.query("SELECT * FROM order_item");

        res.json(allOrderItems.rows) // Only return the first entry from res["rows"] instead of returning everything

    } catch (error) {
        console.log(error.message)
    }
});

// POST: Delete from the OrderItem table
app.delete("/orderitem/delete/:customerid/:productid", async (req, res) => {
    try {
        const customerid = req.params.customerid
        const productid = req.params.productid
        pool.query(`SELECT id FROM orders WHERE customer_id = ${customerid} AND status = 0`, (error, results) => {
            orderid = results.rows[0].id 
            pool.query(`DELETE FROM order_item WHERE product_id = ${productid} AND order_id = ${orderid} `, (error, results) => {
                if (error) {
                    console.log(error)
                    res.status(400).json(error)
                } else {
                    res.status(200).json(results.rows)
                    console.log("Item Deleted")
                }
            })
        })
    } catch (error) {
        console.log(error.message)        
    }
});

app.get("/getgrandtotal/:customerid", async (req, res) => {
    try {
        const customerid = req.params.customerid
        pool.query(`SELECT id FROM orders WHERE customer_id = ${customerid} AND status = 0`, (error, results) => {
            console.log(results.rows)
            orderid = results.rows[0].id 
            pool.query(`SELECT sum(total_price) FROM order_item where order_id = ${orderid}`, (error, results) => {
                res.status(200).json(results.rows[0])
            })
        })
        
    } catch (error) {
        console.log(error.message)        
    }
});

// POST: Checkout order, update status from pending(0) to purchased(1)
app.post("/checkoutOrder/:orderid", async (req, res) => {
    try {
        const orderid = req.params.orderid
        pool.query(`Update orders SET status = 1, created_at = current_timestamp  WHERE id = ${orderid}`, (error, results) => {
            if (error) {
                console.log(error)
                res.status(400).json(error)
            } else {
                res.status(200).json("ok")
                pool.query(`SELECT * FROM order_item WHERE order_id = ${orderid}`, (error, results) => {
                    for (let index in results.rows) {
                        data = results.rows[index]
                        var productId = data.product_id
                        pool.query(`SELECT * FROM product WHERE id = ${productId}`, (error, results) => {
                            if (error) {
                                console.log(error)
                                res.status(400).json(error)
                            }
                            var currentQty = results.rows[0].qty
                            var newQty = currentQty - parseInt(data.product_qty)
                            console.log()
                            pool.query(`UPDATE product SET qty = ${newQty} WHERE id = ${productId}`);
                        })
                    }
                })
            }
        })
    } catch (error) {
        console.log(error.message)        
    }
});
// Need a method to check if user is logged in


// Get cart grand total
// POST: Delete from the OrderItem table
app.get("/grandtotal/:customerid", async (req, res) => {
    try {

        pool.query(` SELECT SUM(total_price) FROM order_item`, (error, results) => {
            total = results.rows[0].id 
            pool.query(`DELETE FROM order_item WHERE product_id = ${productid} AND order_id = ${orderid} `, (error, results) => {
                if (error) {
                    console.log(error)
                    res.status(400).json(error)
                } else {
                    res.status(200).json(results.rows)
                    console.log("Item Deleted")
                }
            })
        })
    } catch (error) {
        console.log(error.message)        
    }
});

/** SERVER LISTEN AT PORT 4000 */

app.listen(4000, () => {
    console.log('Server has started on port 4000')
});