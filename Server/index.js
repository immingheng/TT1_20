import express from "express";
import cors from "cors";
import session from "express-session";

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

/** ------------------------------------- ROUTES ------------------------------------- */

// POST: Login user

// GET: Logout user

// GET: Get logged in User

// GET: All Products

// GET: All Categories

// GET: Return a list of all products from the OrderItem table

// POST: Insert products added from frontend cart into database

// POST: Delete from the OrderItem table

// Need a method to check if user is logged in