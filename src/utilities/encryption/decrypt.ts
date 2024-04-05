import CryptoJS from "crypto-js";
export interface DecryptedInterface {
  userId: string;
}
const decryptData = (encryptedData: string) => {
  // Encrypted data received in the API
  const encryptionKey: string = process.env.ENCRYPTION_KEY || "";
  // console.log(encryptionKey) // Use the same key used for encryption
  const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Base64));
  return decryptedData as DecryptedInterface;
};

export default decryptData;
