const express = require("express");

const router = express.Router();

const verifyJWT = require("../middleware/verifyJWT");
const checkRole = require("../middleware/checkRole");


router.get(
   "/dashboard",
   verifyJWT,
   checkRole("client"),
   (req, res) => {

      res.json({
         message: "Welcome Client Dashboard",
      });
   }
);

module.exports = router;