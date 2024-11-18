const express = require("express");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
require('dotenv').config();


const app = express();
const PORT = process.env.APP_PORT;

const MB_SITE_URL = process.env.MB_SITE_URL; // Replace with your Metabase URL
const MB_EMBEDDING_SECRET_KEY = process.env.MB_EMBEDDING_SECRET_KEY; // Replace with your Metabase secret key

// Database connection
// Import database connection from dbconfig.js
const db = require('./dbconfig');


app.use(express.static("public"));
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "./views");

// Middleware to check authentication
function checkAuth(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    req.session.redirectTo = req.path;
    return res.redirect('/login');
}
// Middleware to redirect authenticated users away from the login page
function redirectIfAuthenticated(req, res, next) {
    if (req.session.userId) {
        return res.redirect('/signed_dashboard');
    }
    next();
}

function checkAdmin(req, res, next) {
    if (req.session.role === 'admin') {
        return next();
    }
    return res.status(403).send("Access Denied");
}


// Routes
// app.get("/admin", checkAuth, checkAdmin, (req, res) => {
//     db.query('SELECT username, role FROM users', (err, results) => {
//         if (err) throw err;
//         res.render("admin", { users: results, MB_SITE_URL, MB_EMBEDDING_SECRET_KEY });
//     });
// });

app.get("/contact", (req, res) => {
    res.render("contact", { userId: req.session.userId });
});

app.get("/", (req, res) => res.render("index", { userId: req.session.userId }));

app.get("/check_session", (req, res) => {
    if (req.session.userId) {
        res.json({ valid: true });
    } else {
        res.json({ valid: false });
    }
});





app.route("/login")
.get(redirectIfAuthenticated, (req, res) => {
      const error = req.session.error;
      req.session.error = null;
      res.render("login", {error});
})


    .post((req, res) => {
        const { username, password } = req.body;
        db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
            if (err) {
                console.error(err);
                req.session.error = "An error occurred, please try again.";
                return res.redirect("/login");
            }
            if (results.length > 0) {
                const user = results[0];
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err){
                        console.error(err);
                        req.session.error = "An error occurred, please try again.";
                        return res.redirect("/login");
                    }
                    if (isMatch) {
                        req.session.userId = user.id;
                        req.session.username = user.username;
                        req.session.role = user.role; 
                        return res.redirect(req.session.redirectTo || '/signed_dashboard');
                    } else {
                        req.session.error = "Incorrect password";
                        return res.redirect("/login");
                        
                    }
                });
            } else {
                req.session.error = "Username not found";
                return res.redirect("/login");
            }
        });
    });

app.get("/logout", (req, res) => {
    req.session.destroy( err => {
        if(err){
            return res.redirect('/signed_dashboard');
        }
        res.clearCookie('connect.sid');
        res.redirect("/login");

    });
    // res.redirect("/");
});

// app.post("/generate_token", checkAuth, checkAdmin, (req, res) => {
//     const unsignedToken = req.body;

//     const token = jwt.sign(unsignedToken, MB_EMBEDDING_SECRET_KEY);
//     res.json({ token });
// });


app.get("/signed_dashboard", checkAuth, (req, res) => {
    const userId = req.session.userId;
    const username= req.session.username;
    const role = req.session.role;

    // let dashboardId;
    if (role === 'admin') {
        return res.redirect('/admin');
        // dashboardId = 34; // Admin dashboard ID
    } 
        
    const dashboardId = role === 'student' ? 1 : null;

   if (dashboardId === null) {
        return res.status(403).send("Access Denied");
    }
   
    // db.query('SELECT username FROM users WHERE id = ?', [userId], (err, results) => {
    //     if (err) throw err;
    //     if (results.length > 0) {
    //         const username = results[0].username;

            const unsignedToken = {
                resource: { dashboard: dashboardId},
                params: {},
                exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
    };

    const token = jwt.sign(unsignedToken, MB_EMBEDDING_SECRET_KEY);
    // console.log("Your token:", token);
    const iframeUrl = `${MB_SITE_URL}/embed/dashboard/${token}#bordered=true&titled=true`;
    res.render("dashboard", { username, iframeUrl });
    
});

app.get("/admin", checkAuth, checkAdmin, (req, res) => {
    const username = req.session.username;
    // const dashboardId = 66; // Admin initial dashboard ID
    // const unsignedToken = {
    //     resource: { dashboard: dashboardId },
    //     params: {},
    //     exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
    // };
    // const token = jwt.sign(unsignedToken, MB_EMBEDDING_SECRET_KEY);
    // const iframeUrl = `${MB_SITE_URL}/embed/dashboard/${token}#bordered=true&titled=true`;
    res.render("admin", { username, MB_SITE_URL });
});

app.post("/generate_token", checkAuth, checkAdmin, (req, res) => {
    const { dashboardId } = req.body;
    console.log('Received dashboardId:', dashboardId);

    const unsignedToken = {
        resource: { dashboard:  parseInt(dashboardId) },
        params: {},
        exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
    };

    const token = jwt.sign(unsignedToken, MB_EMBEDDING_SECRET_KEY,{
         algorithm: 'HS256'
    
    });
    console.log('Generated token:', token);
    res.json({ token });

    
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
