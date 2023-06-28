
import express from "express";
import multer from "multer";
import xml2js from "xml2js";
import {
        createIndividualEntity,
        createCorporationEntity,
        createSourceAccount,
        findMerchantIdPlaid,
        createLiabilityAccount,
        createPayment
        } from "./method-client.js";

const PORT = process.env.PORT || 3001;
const upload = multer();
const app = express();

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/api/uploadfile", upload.any() , async (req, res, next) => {
  let xml = req.files[0].buffer.toString();
  let xmlObj = await xml2js.parseStringPromise(xml);
  let xmlJsonString = JSON.stringify(xmlObj);
  let xmlJsonObj = JSON.parse(xmlJsonString);

  const toCent = amount => {
    return parseInt(parseFloat(amount.substring(1)) * 100);
  };

  xmlJsonObj.root.row.forEach(async (payment) => {

    // Create individual entity
    const entityIndividual = await createIndividualEntity(
      payment.Employee[0].FirstName[0],
      payment.Employee[0].LastName[0]
      );

    // Create corporation entity
    const entityCorporation = await createCorporationEntity(
      payment.Payor[0].Name[0],
      payment.Payor[0].DBA[0],
      payment.Payor[0].EIN[0],
      payment.Payor[0].Address[0].Line1[0],
      payment.Payor[0].Address[0].City[0],
      payment.Payor[0].Address[0].State[0],
      payment.Payor[0].Address[0].Zip[0]
      );

    // Create source account
    const accountACH = await createSourceAccount(
      entityCorporation.id,
      payment.Payor[0].ABARouting[0],
      payment.Payor[0].AccountNumber[0]
      );

    // Find merchant ID
    const merchant = await findMerchantIdPlaid(payment.Payee[0].PlaidId[0]);

    // Create liability account
    const accountLiability = await createLiabilityAccount(
      entityIndividual.id,
      merchant[0].mch_id,
      payment.Payee[0].LoanAccountNumber[0]
      );

    // Convert payment to cents
    const paymentInCents = toCent(payment.Amount[0]);

    // Create payment
    const paymentInfo = await createPayment(
      paymentInCents,
      accountACH.id,
      accountLiability.id
    );
 });
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
