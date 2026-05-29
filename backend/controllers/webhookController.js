const stripe = require("../config/stripe");

const Invoice = require("../models/Invoice");

const User = require("../models/User");

const generateReceipt = require("../services/receiptService");

const sendEmail = require("../services/emailService");

const stripeWebhook = async (req, res) => {

   const sig =
      req.headers["stripe-signature"];

   let event;

   try {

      event =
         stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env
               .STRIPE_WEBHOOK_SECRET
         );

   } catch (err) {

      console.log(
         "Webhook Signature Failed"
      );

      return res.status(400).send(
         `Webhook Error: ${err.message}`
      );
   }

   // PAYMENT SUCCESS
   if (
      event.type ===
      "checkout.session.completed"
   ) {

      try {

         const session =
            event.data.object;

         const invoiceId =
            session.metadata.invoiceId;

         // CHECK EXISTING INVOICE
         const existingInvoice =
            await Invoice.findById(
               invoiceId
            );

         // ALREADY PAID
      if (
   existingInvoice.status ===
   "Paid"
) {

   console.log(
      "Invoice already paid"
   );

   return res.json({
      received: true,
   });
}

         // UPDATE INVOICE
         const updatedInvoice =
            await Invoice.findByIdAndUpdate(
               invoiceId,
               {
                  status: "Paid",
               },
               {
                  returnDocument:
                     "after",
               }
            );

         console.log(
            "Invoice marked as PAID"
         );

         // GET CLIENT
         const client =
            await User.findById(
               updatedInvoice.client
            );

         // GENERATE PDF
         const pdfPath =
            await generateReceipt(
               updatedInvoice
            );

         console.log(
            "PDF Receipt Generated"
         );

         // SEND EMAIL
         await sendEmail(
            client.email,
            pdfPath
         );

         console.log(
            "Receipt Email Sent"
         );

      } catch (error) {

         console.log(
            error.message
         );
      }
   }

   res.json({
      received: true,
   });
};

module.exports = {
   stripeWebhook,
};