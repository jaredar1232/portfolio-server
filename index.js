const express = require("express");
const path = require("path");
const morgan = require("morgan");
const colors = require("colors");
const sgMail = require("@sendgrid/mail");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 1232;

const logStuff = function (req, res, next) {
  console.log("test log");
  console.log(req.headers);
  next();
};

// app.use(cors());
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    optionsSuccessStatus: 200,
  })
);
// process.env.FRONT_END_URL;
// allowedHeaders: ["Content-Type", "Authorization"],

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(logStuff);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// app.get("/", (req, res) => {
//   console.log(process.env.FRONT_END_URL);
//   console.log(req.headers);
// });

app.post("/api", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;

  const msg = {
    to: "jaredar@gmail.com",
    from: `jaredar@gmail.com`,
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

  res.sendStatus(200).end();
});

app.listen(port, () => console.log(`SERVER ON @ ${port}!`.cyan));
