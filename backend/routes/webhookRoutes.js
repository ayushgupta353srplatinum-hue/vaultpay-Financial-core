const express = require("express");
const router = express.Router();
const stripe = require("../config/stripe"); // Apne purane standard path ke hisaab se check kar lena
const Invoice = require("../models/Invoice");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
   const sig = req.headers["stripe-signature"];
   let event;

   try {
      event = stripe.webhooks.constructEvent(
         req.body,
         sig,
         process.env.STRIPE_WEBHOOK_SECRET
      );
   } catch (err) {
      console.error(`❌ Webhook Signature Verification Failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
   }

   res.json({ received: true });

   if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const invoiceId = session.metadata?.invoiceId;

      if (!invoiceId) {
         console.warn("⚠️ Webhook session caught without metadata invoiceId.");
         return;
      }

      try {
     
         const updatedInvoice = await Invoice.findByIdAndUpdate(
            invoiceId,
            { status: "Paid" },
            { new: true }
         ).populate("client"); 
         
         console.log(`✅ Webhook Core: Invoice ${invoiceId} marked as PAID securely.`);

         if (updatedInvoice && updatedInvoice.client) {
            // 
            const doc = new PDFDocument({ margin: 50 });
            let chunks = [];
            
            doc.on("data", (chunk) => chunks.push(chunk));
            
    
            doc.on("end", async () => {
               try {
                  const pdfBuffer = Buffer.concat(chunks);

          
                  if (!process.env.NODEMAILER_EMAIL || !process.env.NODEMAILER_APP_PASSWORD) {
                     console.error("❌ Email System Error: SMTP Keys missing inside environment configurations.");
                     return;
                  }

                  const transporter = nodemailer.createTransport({
                     service: "gmail",
                     auth: {
                        user: process.env.NODEMAILER_EMAIL,
                        pass: process.env.NODEMAILER_APP_PASSWORD,
                     },
                  });

                  const transmissionLayout = {
                     from: `"Nexus Corporate Services" <${process.env.NODEMAILER_EMAIL}>`,
                     to: updatedInvoice.client.email,
                     subject: `Verified Financial Receipt Invoice Reference Ledger: #${updatedInvoice._id.toString().substring(0,8)}`,
                     text: `Dear ${updatedInvoice.client.name},\n\nWe have successfully received your electronic payment asset mapping of ₹${updatedInvoice.amount}. Your official verified PDF transaction documentation ledger is attached hereto securely.\n\nBest Regards,\nEvelyn Croft - CFO Office Ledger Core Network.`,
                     attachments: [
                        {
                           filename: `Nexus_Transaction_Receipt_${updatedInvoice._id}.pdf`,
                           content: pdfBuffer,
                           contentType: "application/pdf"
                        }
                     ]
                  };

                  console.log(`⏳ Initiating mail transmission route to client: ${updatedInvoice.client.email}`);
                  await transporter.sendMail(transmissionLayout);
                  console.log(`📬 Automated Transaction receipt securely mailed to target client node.`);
                  
               } catch (mailError) {
                  console.error("=================== 🚨 EMAIL/SMTP SYSTEM ERROR 🚨 ===================");
                  console.error("Reason:", mailError.message);
                  console.error("Server are not crash");
                  console.error("====================================================================");
               }
            });
            doc.fillColor("#1e3a8a").fontSize(22).text("NEXUS CORPORATE SERVICES", 50, 50);
            doc.fillColor("#64748b").fontSize(10).text("New York, NY, USA | VaultPay Verified Financial Core Engine", 50, 75);
            
            doc.save();
            doc.fontSize(60).fillColor("#10b981").opacity(0.12);
            doc.rotate(35, { origin: [300, 300] });
            doc.text("VERIFIED PAID VOUCHER", 110, 210);
            doc.restore();

            doc.moveTo(50, 95).lineTo(550, 95).strokeColor("#cbd5e1").lineWidth(1).stroke();

            doc.fillColor("#0f172a").fontSize(13).text("SECURE SYSTEM TRANSACTION AUDIT LOG", 50, 115);
            doc.fontSize(9).fillColor("#334155")
               .text(`Vault Ledger Token Ref ID: ${updatedInvoice._id}`, 50, 140)
               .text(`Target Customer Identity: ${updatedInvoice.client.name}`, 50, 155)
               .text(`Client Gateway Address: ${updatedInvoice.client.email}`, 50, 170)
               .text(`Settlement Status Indicator: TRANSACTION CLEARED / SUCCESSFUL`, 50, 185);

            doc.moveTo(50, 205).lineTo(550, 205).strokeColor("#cbd5e1").stroke();

            doc.fontSize(11).fillColor("#1e293b").text("Description of Consultancy Services Formulated:", 50, 225);
            doc.fontSize(10).fillColor("#475569").text(updatedInvoice.description || "Enterprise System Infrastructure Support Contracts Phase III", 50, 245);
            
            doc.fontSize(15).fillColor("#111827").text(`Total Outlay Amount Settled: ₹${updatedInvoice.amount}.00 INR`, 50, 295, { bold: true });

            doc.end();
         }
      } catch (error) {
         console.error(`Thread Logic Error inside DB context: ${error.message}`);
      }
   }
});

module.exports = router;