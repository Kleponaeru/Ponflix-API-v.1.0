import CryptoJS from "crypto-js";

const KEY = "3&!librawasoraurl==";

const CryptoJSAesJson = {
  stringify(cipherParams: CryptoJS.lib.CipherParams) {
    const json: any = {
      ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64),
    };

    if (cipherParams.iv) {
      json.iv = cipherParams.iv.toString();
    }

    if (cipherParams.salt) {
      json.s = cipherParams.salt.toString();
    }

    return JSON.stringify(json);
  },

  parse(jsonStr: string) {
    const json = JSON.parse(jsonStr);

    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(json.ct),
    });

    if (json.iv) {
      cipherParams.iv = CryptoJS.enc.Hex.parse(json.iv);
    }

    if (json.s) {
      cipherParams.salt = CryptoJS.enc.Hex.parse(json.s);
    }

    return cipherParams;
  },
};

export function decryptLib(lib: string) {
  const decoded = Buffer.from(lib, "base64").toString("utf8");

  const decrypted = CryptoJS.AES.decrypt(decoded, KEY, {
    format: CryptoJSAesJson,
  });

  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
}