import CryptoJS from "crypto-js";

function tryDecrypt(payload: string, key: string) {
  try {
    const decoded = CryptoJS.enc.Base64.parse(payload).toString(
      CryptoJS.enc.Utf8,
    );

    const json = JSON.parse(decoded);

    const iv = CryptoJS.enc.Hex.parse(json.iv);
    const salt = CryptoJS.enc.Hex.parse(json.s);
    const ct = json.ct;

    const keyBytes = CryptoJS.PBKDF2(key, salt, {
      keySize: 256 / 32,
      iterations: 1000,
    });

    const decrypted = CryptoJS.AES.decrypt(ct, keyBytes, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const result = decrypted.toString(CryptoJS.enc.Utf8);

    return result || null;
  } catch {
    return null;
  }
}

export function decryptSource(
  src: string,
  token: string,
  xenHash?: string | null,
) {
  const cleanXen = xenHash ?? "";

  const keys: string[] = [
    token,
    cleanXen,
    `${token}${cleanXen}`,
    `${cleanXen}${token}`,
    CryptoJS.MD5(token + cleanXen).toString(),
    CryptoJS.MD5(cleanXen + token).toString(),
  ];

  for (const key of keys) {
    const result = tryDecrypt(src, key);

    if (result) {
      return result;
    }
  }

  console.log("❌ ALL KEYS FAILED");
  return null;
}