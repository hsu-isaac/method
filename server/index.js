
import express from "express";
import multer from "multer";
import xml2js from "xml2js";
import { createIndividualEntity } from "./method-client.js";

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
    const entityIndividual = await createIndividualEntity(payment.Employee[0].FirstName[0], payment.Employee[0].LastName[0]);
    console.log(entityIndividual)

    // Create corporation entity
    console.log(payment.Payor[0].Address[0])
    const entityCorporation = await method.entities.create({
      type: 'llc',
      corporation: {
        name:   payment.Payor[0].Name[0],
        dba:    payment.Payor[0].DBA[0],
        ein:    payment.Payor[0].EIN[0],
        owners: [],
      },
      address: {
        line1:  payment.Payor[0].Address[0].Line1[0],
        line2: (payment.Payor[0].Address[0].Line2 || [])[0],
        city:   payment.Payor[0].Address[0].City[0],
        state:  payment.Payor[0].Address[0].State[0],
        zip:    payment.Payor[0].Address[0].Zip[0],
      },
    });

    // Create source account
    const accountACH = await method.accounts.create({
      holder_id: entityCorporation.id,
      ach: {
        routing: payment.Payor[0].ABARouting[0],
        number:  payment.Payor[0].AccountNumber[0],
        type:    'checking',
      },
    });

    // Find merchant ID
    const merchant = await method.merchants.list({"provider_id.plaid": payment.Payee[0].PlaidId[0]});

    // Create liability account
    const accountLiability = await method.accounts.create({
      holder_id: entityIndividual.id,
      liability: {
        mch_id:         merchant[0].mch_id,
        account_number: payment.Payee[0].LoanAccountNumber[0],
      }
    });

    // Convert payment to cents
    let paymentInCents = toCent(payment.Amount[0]);

    // Create payment
    const paymentInfo = await method.payments.create({
      amount: paymentInCents,
      source: accountACH.id,
      destination: accountLiability.id,
      description: 'Loan test',
    });
 });
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
