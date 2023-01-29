const express = require ("express");

const cartsRepo = require("../repositories/carts");
const productsRepo = require("../repositories/products");
const cartShowTemplate = require("../views/carts/show");

const router = express.Router();

router.post("/cart/products", async (req, res) => {

    // 1 figure out the cart - does this user have a cart yet or no

    let cart;
    if (!req.session.cartId) {
        // we dont have a cart we need to create one, and store the cart id on the req.session.cartId property
        cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;
    } else {
        // we have a cart, lets get it from the repository
        cart = await cartsRepo.getOne(req.session.cartId);
    }

    // Ha az admin panelról törölnek egy itemet, amire én az oldal frissítése előtt még rá tudnék kattintani -> ne crasholjon a szerver
    const isValidItem = await productsRepo.getOne(req.body.productId);
    if (!isValidItem) return res.redirect ("/");
    // 
    
    // 2 Either increment quantity of existing product, or add new product to items array
    const existingItem = cart.items.find(item => item.id === req.body.productId);

    if (existingItem) {
        // increment quantity and save cart
        existingItem.quantity++;
    } else {
        // add new product id to items array
        cart.items.push({ id: req.body.productId, quantity: 1 });
    }

    await cartsRepo.update(cart.id, {
        items: cart.items
    })

    res.redirect("/cart");
})

router.get("/cart", async (req, res) => {
    
    // list the cart
    if (!req.session.cartId) return res.redirect("/");

    const cart = await cartsRepo.getOne(req.session.cartId);

    for (let item of cart.items) {

        const product = await productsRepo.getOne(item.id);
        // hogy ezt a product-t be tudjuk dobni a template-be egyszerűen, simán hozzádobjuk az item objecthoz, s csá. De nem updateljük a repo-t
        item.product = product;
    }
    res.send(cartShowTemplate({ items: cart.items }));
});

router.post("/cart/:id/delete", async (req, res) => {

    if (!req.session.cartId) return res.redirect("/"); 

    const cart = await cartsRepo.getOne(req.session.cartId);
    const id = req.params.id;

    const filteredCart = cart.items.filter(piece => {
        return piece.id!==id;
    })

    await cartsRepo.update(req.session.cartId, { items: filteredCart });

    res.redirect("/cart");
});

module.exports = router;
