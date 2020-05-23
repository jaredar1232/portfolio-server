const express = require("express");
const path = require("path");
const morgan = require("morgan");
const colors = require("colors");
const sgMail = require("@sendgrid/mail");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 1232;

// app.use(cors());
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.get("/", (req, res) => {
  console.log(process.env.FRONT_END_URL);
  console.log(req.headers);
});

app.post("/", async (req, res) => {
  console.log(process.env.FRONT_END_URL);
  console.log(req.headers);

  const name = req.body.name;
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;

  const msg = {
    to: "jaredar@gmail.com",
    from: `${email}`,
    subject: `${subject}`,
    text: `Name: ${name}. Message: ${message}`,
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

  res.sendStatus(200).res.end();
});

app.listen(port, () => console.log(`SERVER ON @ ${port}!`.cyan));
