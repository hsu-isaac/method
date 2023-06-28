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
}
