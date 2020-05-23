const express = require("express");
const path = require("path");
const morgan = require("morgan");
const colors = require("colors");
const sgMail = require("@sendgrid/mail");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = 1232;

app.use(
  cors({
    origin: [
      "http://localhost:8000",
      "https://eloquent-tereshkova-a18ecc.netlify.app",
    ],
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;

  const msg = {
    to: "jaredar@gmail.com",
    from: `${email}`,
    subject: `${subject}`,
    text: `${message}`,
    html: `<strong>${message}</strong>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }

  res.send("Hello World!");
});

app.listen(port, () => console.log(`SERVER ON @ ${port}!`.cyan));