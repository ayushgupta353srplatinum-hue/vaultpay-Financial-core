const express = require("express");

const router = express.Router();

const verifyJWT = require("../middleware/verifyJWT");

router.get(
   "/protected",
   verifyJWT,
   (req, res) => {

      res.json({
         message: "Protected route accessed",
         user: req.user,
      });
   }
);

module.exports = router;