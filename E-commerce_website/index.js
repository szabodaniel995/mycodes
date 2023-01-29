const ngrok = require('ngrok');

const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session"); 

const authRouter = require("./routes/admin/auth");
const adminProductsRouter = require("./routes/admin/products");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");

const app = express();

app.use(express.static("./public")); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieSession({
    keys: ["asdwqefdasd123ewqedsa"] 
}));

app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartsRouter);
 

app.listen(80, () => { 
    console.log("Listening");
});

(async function() {
  const url = await ngrok.connect({ authtoken:"2L05wZSBvwhYkTsjez8JfjdEKJN_7XtLrVpXefdmnWAbwrDQr" });
  console.log(url);
})();
 

