const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const clientId = process.env.GMAIL_CLIENT_ID;
const clientSecret = process.env.GMAIL_CLIENT_SECRET;
const redirectUri = process.env.GMAIL_REDIRECT_URI;
const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);
oauth2Client.setCredentials({ refresh_token: refreshToken });

const sendMail = async (msg) => {
  try {
    if (!msg) {
      throw new Error("no message to send");
    }
    const accessToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "karantemp1122@gmail.com",
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: msg.from,
      to: msg.to,
      subject: msg.subject,
      text: msg.text || "",
      html: msg.html || "",
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log("some error occured", error.message);
  }
};

const msg = {
  from: "karantemp1122@gmail.com",
  to: "karansinghk0@gmail.com",
  subject: "test subject",
  text: "this is email text",
  html: "<h1>this is email text</h1>",
};
sendMail(msg)
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
