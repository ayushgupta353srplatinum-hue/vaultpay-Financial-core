const stripe = require("../config/stripe");

const Invoice = require("../models/Invoice");

const createCheckoutSession = async (
   req,
   res
) => {

   try {

      const invoice = await Invoice.findById(
         req.params.id
      );

      if (!invoice) {
         return res.status(404).json({
            message: "Invoice not found",
         });
      }


      if (
         req.user.role === "client" &&
         invoice.client.toString() !== req.user.id
      ) {
         return res.status(403).json({
            message: "Forbidden Access",
         });
      }

      const session =
         await stripe.checkout.sessions.create({

            payment_method_types: ["card"],

            line_items: [
               {
                  price_data: {
                     currency: "usd",

                     product_data: {
                        name: invoice.description,
                     },

                     unit_amount:
                        invoice.amount * 100,
                  },

                  quantity: 1,
               },
            ],

            mode: "payment",

            success_url:
               "http://localhost:5173/payment-success",

            cancel_url:
               "http://localhost:5173/payment-cancel",

            metadata: {
               invoiceId: invoice._id.toString(),
            },
         });

      res.json({
         url: session.url,
      });

   } catch (error) {

      res.status(500).json({
         message: error.message,
      });
   }
};

module.exports = {
   createCheckoutSession,
};