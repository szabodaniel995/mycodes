const express = require("express");
const multer = require("multer");

const productsRepo = require("../../repositories/products");
const cartsRepo = require("../../repositories/carts");
const productsNewTemplate = require("../../views/admin/products/new");
const productsIndexTemplate = require("../../views/admin/products/index");
const productsEditTemplate = require("../../views/admin/products/edit");
const { requireTitle, requirePrice }  = require("./validators");
const { handleErrors, requireAuth } = require("./middlewares");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.get("/admin/products", requireAuth(), async (req, res) => {

    const products = await productsRepo.getAll();

    res.send(productsIndexTemplate({ products }));
});

router.get("/admin/products/new", requireAuth(), (req, res) => {

    res.send(productsNewTemplate({  }));
});

router.post(
    "/admin/products/new", 
    requireAuth(), 
    upload.single("image"), 
    [
        requireTitle,
        requirePrice
    ],
    handleErrors(productsNewTemplate),
    async (req, res) => {

        const details = req.body;

        if (req.file) {
            details.image = req.file.buffer.toString("base64"); 
        }

        await productsRepo.create(details);

        res.redirect("/admin/products"); 
});

router.get("/admin/products/:id/edit", requireAuth(), async (req, res) => {

    const id = req.params.id
    const product = await productsRepo.getOne(id);

    if (!product) {
        return res.send ("Product not found");
    }

    res.send(productsEditTemplate({ product }));
}); 

router.post(
    "/admin/products/:id/edit", 
    requireAuth(), 
    upload.single("image"),
    [
        requireTitle,
        requirePrice
    ],
    handleErrors(productsEditTemplate, async (req) => {
        const product = await productsRepo.getOne(req.params.id);
        return { product: product }
    }),  
    async (req, res) => {

        const changes = req.body;

        if (req.file) {
            changes.image = req.file.buffer.toString("base64");
        }

        try {
            await productsRepo.update(req.params.id, changes);
        } catch(err) {
            return res.send ("Could not find item");
        }

        res.redirect("/admin/products");
});
 
router.post("/admin/products/:id/delete", requireAuth(), async (req, res) => {
    const id = req.params.id;

    await productsRepo.delete(id);

    // Ha az emberek kosarában van 1 item, amit én időközben az admin panelról törlök -> törölje a kosarakból, ne legyen server crash
    const carts = await cartsRepo.getAll();

    const updatedCarts = carts.map((cart) => {
        return {
            id: cart.id,
            items: cart.items.filter((item) => {
                return item.id!==id;
            })
        }
    });

    cartsRepo.writeAll(updatedCarts);
    // 

    res.redirect("/admin/products");
})

module.exports = router;  