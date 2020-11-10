import crypto from "crypto";
import { Crypto as CryptoConfig } from "./config";

const { algorithm, secret } = CryptoConfig;

const encrypt = (data: string) =>
  crypto.createHmac(algorithm, secret).update(data).digest(`hex`);

export { encrypt };
export default { encrypt };
