const express = require("express");
const path = require("path");
const morgan = require("morgan");
const colors = require("colors");
const sgMail = require("@sendgrid/mail");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 1232;

require("dotenv").config();

// const logStuff = function (req, res, next) {
//   console.log("test log");
//   console.log(req.headers);
//   next();
// };
// app.use(logStuff);

// app.options("*", cors());'
app.options("/api", cors()); // enable pre-flight request for POST request
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/api", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;

  const msg = {
    to: "jaredar@gmail.com",
    from: `jaredar@gmail.com`,
    subject: `Portfolio Message: ${subject}`,
    text: `Name: ${name}\n Email: ${email}\n Message: ${message}`,
    html: `<strong>Name: ${name}\n Email: ${email}\n Message: ${message}</strong>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }

  res.sendStatus(200).end();
});

app.listen(port, () => console.log(`SERVER ON @ ${port}!`.cyan));
