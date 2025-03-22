const express = require("express");
const router = express.Router();
const {
  getTemplate,
  postTemplate,
  singleTemplate
} = require("../controllers/templateControllers");

// user sign up or create a new account 
router.post("/add-template", postTemplate);

// // user login 
// router.post("/signin", loginUser);

// get all users information 
router.get("/template", getTemplate);
// get a specif user information
router.get("/template/:id", singleTemplate );
// // update a specific user information 
// router.patch("/users/:id", updateUser);
// // delete a specific user information 
// router.delete("/users/:id", deleteUser);

module.exports = router;
