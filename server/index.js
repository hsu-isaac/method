const express = require("express");
const PORT = process.env.PORT || 3001;
const multer = require("multer");
const upload = multer();
const xml2js = require ("xml2js");

const app = express();

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/api/uploadfile", upload.any() , async (req, res, next) => {
  let xml = req.files[0].buffer.toString();
  let xmlObj = await xml2js.parseStringPromise(xml);
  console.log("Parsed XML:", JSON.stringify(xmlObj));
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
