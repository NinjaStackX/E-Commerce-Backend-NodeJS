import nodemailer from "nodemailer";
import fs from "fs";

export const sendInvoiceEmail = async (userEmail, orderId, invoicePath) => {
  // like confing
  const transporter = nodemailer.createTransport({
    service: "gmail", // أو استخدم Mailtrap للتجربة
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // like model
  const mailOptions = {
    from: `"Servica" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Order #${orderId} - Invoice`,
    text: "Thanks for your order. Find your invoice attached.",
    attachments: [
      {
        filename: `invoice-${orderId}.pdf`,
        content: fs.createReadStream(invoicePath),
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
