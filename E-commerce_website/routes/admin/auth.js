const express = require("express");

const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPasswordForUser } = require("./validators");
const { handleErrors } = require("./middlewares");
 
const router = express.Router();


router.get("/signup", (req, res) => {
    res.send(signupTemplate({  }));
});

router.post(
    "/signup", 
    [
        requireEmail, 
        requirePassword,
        requirePasswordConfirmation
    ],
    handleErrors(signupTemplate),
    async (req, res) => {{ 

        const { email, password } = req.body;

        // Create a user in our user repo to represent this person
        const user = await usersRepo.create({ email: email, password: password });

        // Add the user id to the cookies -> he is now logged in until logout (until req.session is cleared)
        req.session.userId = user.id;

        res.redirect("/admin/products");
}})

router.get("/signout", (req, res) => {
    req.session.userId = null;

    res.redirect("/signin");
})

router.get("/signin", (req, res) => {
    res.send(signinTemplate({  }));
})

router.post(
    "/signin", 
    [
        requireEmailExists,
        requireValidPasswordForUser
    ], 
    handleErrors(signinTemplate),
    async (req, res) => {
        const { email } = req.body;

        const user = await usersRepo.getOneBy({ email });

        req.session.userId = user.id;

        res.redirect("/admin/products");
})
 
module.exports = router; 