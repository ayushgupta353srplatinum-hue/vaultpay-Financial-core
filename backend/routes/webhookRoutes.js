const express = require("express");
const router = express.Router();

const stripe = require("../config/stripe");
const Invoice = require("../models/Invoice");

const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
   const sig = req.headers["stripe-signature"];

   let event;

   try {
      event = stripe.webhooks.constructEvent(
         req.body,
         sig,
         process.env.STRIPE_WEBHOOK_SECRET
      );

      console.log("✅ Stripe Webhook Verified");

   } catch (err) {
      console.error(`❌ Webhook Signature Verification Failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
   }

   // Stripe ko instantly response bhej do
   res.status(200).json({ received: true });

   // PAYMENT SUCCESS EVENT
   if (event.type === "checkout.session.completed") {

      const session = event.data.object;

      const invoiceId = session.metadata?.invoiceId;

      if (!invoiceId) {
         console.warn("⚠️ No invoiceId found in Stripe metadata");
         return;
      }

      try {

         const updatedInvoice = await Invoice.findByIdAndUpdate(
            invoiceId,
            { status: "Paid" },
            { new: true }
         ).populate("client");

         console.log(`✅ Invoice ${invoiceId} marked as PAID`);

         if (updatedInvoice && updatedInvoice.client) {

            const doc = new PDFDocument({ margin: 50 });

            let chunks = [];

            doc.on("data", (chunk) => chunks.push(chunk));

            doc.on("end", async () => {

               try {

                  const pdfBuffer = Buffer.concat(chunks);

                  if (
                     !process.env.NODEMAILER_EMAIL ||
                     !process.env.NODEMAILER_APP_PASSWORD
                  ) {
                     console.error("❌ SMTP ENV Missing");
                     return;
                  }

                  const transporter = nodemailer.createTransport({
                     service: "gmail",
                     auth: {
                        user: process.env.NODEMAILER_EMAIL,
                        pass: process.env.NODEMAILER_APP_PASSWORD,
                     },
                  });

                  await transporter.sendMail({
                     from: `"VaultPay" <${process.env.NODEMAILER_EMAIL}>`,
                     to: updatedInvoice.client.email,
                     subject: "Payment Receipt",
                     text: `Payment received successfully for invoice ${updatedInvoice._id}`,
                     attachments: [
                        {
                           filename: `receipt-${updatedInvoice._id}.pdf`,
                           content: pdfBuffer,
                           contentType: "application/pdf",
                        },
                     ],
                  });

                  console.log("📬 Receipt Email Sent");

               } catch (mailError) {

                  console.error("❌ Email Error:", mailError.message);

               }

            });

            // PDF CONTENT
            doc.fontSize(24).text("VaultPay Payment Receipt");

            doc.moveDown();

            doc.fontSize(14).text(`Invoice ID: ${updatedInvoice._id}`);

            doc.text(`Client: ${updatedInvoice.client.name}`);

            doc.text(`Email: ${updatedInvoice.client.email}`);

            doc.text(`Amount: ₹${updatedInvoice.amount}`);

            doc.text(`Status: ${updatedInvoice.status}`);

            doc.text(`Description: ${updatedInvoice.description}`);

            doc.moveDown();

            doc.text("Payment Successfully Verified.");

            doc.end();
         }

      } catch (error) {

         console.error("❌ Database Update Error:", error.message);

      }

   }

});

module.exports = router;