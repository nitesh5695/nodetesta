const express = require("express")
const mongoose = require("mongoose")
const customer_db = require("./customer")
const userLogin = require("./logindb")
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var morgan = require("morgan");

const app = express()
const server = require("http").Server(app)
const path = require('path')
const { truncateSync } = require("fs")
const { request } = require("http")
const static_path = path.join((__dirname, "./public"))

app.use(express.static(static_path))

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
    session({
        key: "user_sid",
        secret: "somerandonstuffs",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 600000,
        },
    })
);


app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie("user_sid");
    }
    next();
});


var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect("/home");
    } else {
        next();
    }
};
app.set('view engine', 'hbs')





app.get('/', sessionChecker, function (req, res) {


    res.render('index');
})

app.post('/login_validate', async function (req, res) {
    try {
        sess = req.session;

        var name = req.body.email;
        var passw1 = req.body.password;

        const insertd = await userLogin.findOne({ email: name })
        req.session.user = insertd.email;
        
        if (insertd.email == name) {
            if (insertd.password == passw1) {
                console.log(insertd.password)
                console.log(passw1)
                res.render('home')
            }
            else {
                res.render("index",{error: " password incorrect"});
            }
        } else {
            res.render("index",{error: " password wrong"});
        }







    } catch (e) {
        console.log(e)
        res.render("index",{error: " invalid username password"});

    }

})
app.get('/home', function (req, res) {


    if (req.session.user && req.cookies.user_sid) {
        res.render('home')
    } else {
        res.render("index",{error: " login please"});
    }
})
app.get('/logout', function (req, res) {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie("user_sid");
        res.render("home");
    } else {
        res.render("index",{error: " successfully logout"});
    }

})
app.get('/create_customer', function (req, res) {


    if (req.session.user && req.cookies.user_sid) {
        res.render('create_customer')
    } else {
        res.render("index",{error: " login please"});
    }
})

app.post('/create_customer', async function (request, res) {
    try {
        const customer = new customer_db();
        customer.name = request.body.name;
        customer.mobile = request.body.mobile;
        customer.gender = request.body.gender;
        customer.items = request.body.items;
        customer.tip = request.body.tip;
        customer.pay_mode = request.body.pay_mode;
        customer.price = request.body.price;
        customer.address = request.body.address;
        const data = await customer.save()
        res.render('create_customer', { message: "customer is successfullt added" })

    } catch (e) {
        console.log(e)
        res.render('create_customer', { message: "customer is already existed" })
    }

})
app.get('/delete_customer', function (req, res) {



    if (req.session.user && req.cookies.user_sid) {
        res.render('delete_customer')
    } else {
        res.render("index",{error: " login please"});
    }
})

app.post('/delete_customer_data', async function (req, res) {
    try {
        cust_name = req.body.name;
        mobile = req.body.mobile;
        await customer_db.deleteOne({ mobile: mobile })
        res.render('delete_customer', { message: "customer is deleted successfully" })
    }
    catch (e) {
        console.log(e)
        res.render('delete_customer', { message: "customer idoes not  existed" })
    }



})
app.get('/edit_customer', function (req, res) {

    if (req.session.user && req.cookies.user_sid) {
        res.render('edit_customer')
    } else {
        res.render("index",{error: " login please"});
    }
})
app.post('/edit_customer_data', async function (req, res) {
    try {
        cname = req.body.name;
        mobile = req.body.mobile;
        var update_name = req.body.update_name;
        value = req.body.value;
        if (update_name == "name") { await customer_db.updateOne({ mobile: mobile }, { $set: { name: value } }) }
        else if (update_name == "address") { await customer_db.updateOne({ mobile: mobile }, { $set: { address: value } }) }
        else if (update_name == "mobile") { await customer_db.updateOne({ mobile: mobile }, { $set: { mobile: value } }) }
        else { await customer_db.updateOne({ mobile: mobile }, { $set: { price: value } }) }
        res.render("edit_customer", { message: "updated successfully" })
    }
    catch (e) {
        console.log(e)
        res.render('delete_customer', { message: "customer idoes not  existed" })
    }

})
app.get('/view_customer', async function (req, res) {



    if (req.session.user && req.cookies.user_sid) {
        const allcustomer = await customer_db.find({})
        console.log(allcustomer[0].name);
        res.render("view_customer", { customer: allcustomer })
    } else {
        res.render("index",{error: " login please"});
    }
})




app.post('/search_customer', async function (req, res) {
    customername = req.body.search;
    const all_customer = await customer_db.find({ name: customername })
    console.log(all_customer)
    if (all_customer[0] == null) {
        res.render("view_customer", { message: "No data found" })
    }
    else {
        console.log("data found");
        res.render("view_customer", { customer: all_customer })
    }
})


server.listen(5000, (req, res) => {
    console.log("nitesh singh");
});