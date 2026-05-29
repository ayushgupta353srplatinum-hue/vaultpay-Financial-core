const PDFDocument = require("pdfkit");

const fs = require("fs");

const path = require("path");

const generateReceipt = (
   invoice
) => {

   return new Promise((resolve, reject) => {

      const doc = new PDFDocument();

      const fileName =
         `receipt-${invoice._id}.pdf`;

      const filePath = path.join(
         __dirname,
         "../receipts",
         fileName
      );

      const stream =
         fs.createWriteStream(filePath);

      doc.pipe(stream);

      // TITLE
      doc
         .fontSize(25)
         .text(
            "Nexus Corporate Services",
            {
               align: "center",
            }
         );

      doc.moveDown();

      doc
         .fontSize(20)
         .text("PAYMENT RECEIPT");

      doc.moveDown();

      doc.text(
         `Invoice ID: ${invoice._id}`
      );

      doc.text(
         `Amount: $${invoice.amount}`
      );

      doc.text(
         `Status: ${invoice.status}`
      );

      doc.text(
         `Description: ${invoice.description}`
      );

      doc.moveDown();

      doc
         .fontSize(30)
         .fillColor("green")
         .text("PAID", {
            align: "center",
         });

      doc.end();

      stream.on("finish", () => {
         resolve(filePath);
      });

      stream.on("error", reject);
   });
};

module.exports = generateReceipt;