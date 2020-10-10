import crypto from "crypto";
import { Crypto as CryptoConfig } from "./config";

const { algorithm = "sha256", secret = "secret" } = CryptoConfig;
export const encrypt = (data: string) =>
  crypto.createHmac(algorithm, secret).update(data).digest(`hex`);

export default {
  encrypt,
};
