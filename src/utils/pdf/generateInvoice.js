import fs from "fs";
import PDFDocument from "pdfkit";
import path from "path";
import QRCode from "qrcode";

export const generateInvoice = async (req, res) => {
  try {
    const order = req.order;

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    const invoicePath = path.join(
      "invoices",
      `invoice-${order._id.toString()}.pdf`
    );

    const stream = fs.createWriteStream(invoicePath);
    doc.pipe(stream);

    // ------------------- Header -------------------
    const logoPath = path.resolve("public/logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 80 });
    }

    doc.fontSize(20).text("Invoice", 0, 50, { align: "center" }).moveDown();

    doc
      .fontSize(12)
      .text(`Invoice ID: ${order._id}`)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`)
      .text(`Client: ${order.user?.name} (${order.user?.email})`)
      .moveDown();

    // ------------------- Table -------------------
    doc.fontSize(14).text("Order Details:", { underline: true }).moveDown(0.5);
    doc.fontSize(12);

    order.products.forEach((item, index) => {
      const { product, quantity, priceAtPurchase } = item;
      doc.text(
        `${index + 1}. ${
          product?.title
        } - Qty: ${quantity} x $${priceAtPurchase} = $${(
          quantity * priceAtPurchase
        ).toFixed(2)}`
      );
    });

    doc.moveDown();
    doc
      .fontSize(14)
      .text(`Total: $${order.totalAmount.toFixed(2)}`, { align: "right" });

    // ------------------- QR Code -------------------
    const invoiceDownloadURL = `${req.protocol}://${req.get(
      "host"
    )}/api/orders/${order._id}/invoice`;

    const qrImageData = await QRCode.toDataURL(invoiceDownloadURL);

    doc
      .addPage()
      .fontSize(18)
      .text("Download Invoice QR Code", { align: "center" })
      .moveDown(2);

    doc.image(qrImageData, {
      fit: [200, 200],
      align: "center",
      valign: "center",
    });

    doc.end();

    stream.on("finish", () => {
      res.download(invoicePath);
    });
  } catch (error) {
    console.error("Error generating invoice:", error.message);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};
