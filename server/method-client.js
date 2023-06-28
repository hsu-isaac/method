import 'dotenv/config';
import {Method, Environments} from "method-node";

const methodKey = process.env.METHOD_KEY
const method = new Method({
  apiKey: methodKey,
  env: Environments.dev,
});


export function createIndividualEntity (firstName, lastName) {
  return method.entities.create({
    type: 'individual',
    individual: {
      first_name: firstName,
      last_name: lastName,
      phone: '+15121231111'
    }
  });
};

export function createCorporationEntity(name, dba, ein, address1, city, state, zip) {
  return method.entities.create({
    type: 'llc',
    corporation: {
      name: name,
      dba: dba,
      ein: ein,
      owners: [],
    },
    address: {
      line1: address1,
      line2: [],
      city: city,
      state: state,
      zip: zip,
    }
  });
};

export function createSourceAccount(corporationId, routing, number) {
  return method.accounts.create({
    holder_id: corporationId,
        ach: {
          routing: routing,
          number: number,
          type: 'checking',
      }
    });
};

export function findMerchantIdPlaid(plaidId) {
  return method.merchants.list({"provider_id.plaid": plaidId});
};

export function createLiabilityAccount(individualId, merchantId, accountNumber) {
  return method.accounts.create({
    holder_id: individualId,
    liability: {
      mch_id: merchantId,
      account_number: accountNumber,
    }
  });
};

export function createPayment(amount, source, destination) {
  return method.payments.create({
    amount: amount,
    source: source,
    destination: destination,
    description: 'Loan test',
  });
}
