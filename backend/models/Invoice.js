const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
   {
      client: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },

      amount: {
         type: Number,
         required: true,
      },

      description: {
         type: String,
         required: true,
      },

      status: {
         type: String,
         enum: ["Pending", "Paid"],
         default: "Pending",
      },
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model(
   "Invoice",
   invoiceSchema
);