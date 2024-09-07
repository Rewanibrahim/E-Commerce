import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html,attachments=[]) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "irewan28@gmail.com",
      pass: "uuxnykkodjzpxrqp",
    },
  });

  const info = await transporter.sendMail({
    from: '"Rewan" <irewan28@gmail.com>',
    to: to ? to : "irewan28@gmail.com",
    subject: subject ? subject : "Hello",
    html: html ? html : "Hello world?",
    attachments
  });

  if (info.accepted.length) {
    return true;
  }

  return false;
};