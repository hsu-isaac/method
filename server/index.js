const express = require("express");
const PORT = process.env.PORT || 3001;
const multer = require("multer");
const upload = multer();
const xml2js = require ("xml2js");
require('dotenv').config();
const methodKey = process.env.METHOD_KEY
console.log(methodKey)

const { Method, Environments } = require("method-node");
const method = new Method({
  apiKey: methodKey,
  env: Environments.dev,
});




const app = express();

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/api/uploadfile", upload.any() , async (req, res, next) => {
  let xml = req.files[0].buffer.toString();
  let xmlObj = await xml2js.parseStringPromise(xml);
  let xmlJsonString = JSON.stringify(xmlObj);
  let xmlJsonObj = JSON.parse(xmlJsonString);

  const entityIndividual = await method.entities.create({
    type: 'individual',
    individual: {
      first_name: xmlJsonObj.row.Employee[0].FirstName[0],
      last_name: xmlJsonObj.row.Employee[0].LastName[0],
      phone: '+15121231111'
    }
  });
  console.log("Individual", entityIndividual)

  const entityCorporation = await method.entities.create({
    type: 'c_corporation',
    corporation: {
      name: xmlJsonObj.row.Payor[0].Name[0],
      dba: xmlJsonObj.row.Payor[0].DBA[0],
      ein: xmlJsonObj.row.Payor[0].EIN[0],
      owners: [],
    },
    address: {
      line1: xmlJsonObj.row.Payor[0].Address[0].Line1[0],
      line2: (xmlJsonObj.row.Payor[0].Address[0].Line2 || [])[0],
      city: xmlJsonObj.row.Payor[0].Address[0].City[0],
      state: xmlJsonObj.row.Payor[0].Address[0].State[0],
      zip: xmlJsonObj.row.Payor[0].Address[0].Zip[0],
    },
  });
  console.log("Corporation", entityCorporation)

  const accountACH = await method.accounts.create({
    holder_id: entityCorporation.id,
    ach: {
      routing: xmlJsonObj.row.Payor[0].ABARouting[0],
      number: xmlJsonObj.row.Payor[0].AccountNumber[0],
      type: 'checking',
    },
  });
  console.log("accountACH", accountACH);

  const merchant = await method.merchants.list({"provider_id.plaid": xmlJsonObj.row.Payee[0].PlaidId[0]});
  console.log("merchant", merchant);

  const accountLiability = await method.accounts.create({
    holder_id: entityIndividual.id,
    liability: {
      mch_id: merchant[0].mch_id,
      account_number: xmlJsonObj.row.Payee[0].LoanAccountNumber[0],
    }
  });
  console.log("liability", accountLiability);

 const toCent = amount => {
  return parseInt(parseFloat(amount.substring(1)) * 100);
 };

 let paymentInCents = toCent(xmlJsonObj.row.Amount[0]);

  const payment = await method.payments.create({
    amount: paymentInCents,
    source: accountACH.id,
    destination: accountLiability.id,
    description: 'Loan test',
  });

});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
