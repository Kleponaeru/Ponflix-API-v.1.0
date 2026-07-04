import CryptoJS from "crypto-js";

function decodeBase64Json(data: string) {
  const decoded = CryptoJS.enc.Base64.parse(data).toString(
    CryptoJS.enc.Utf8
  );

  try {
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function decodeMirror(mirror: string, token: string) {
  if (!mirror) return null;

  const key = token;

  const decrypted = CryptoJS.AES.decrypt(mirror, key).toString(
    CryptoJS.enc.Utf8
  );

  try {
    return JSON.parse(decrypted);
  } catch {
    return decodeBase64Json(decrypted);
  }
}