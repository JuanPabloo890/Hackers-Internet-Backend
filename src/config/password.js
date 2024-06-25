
import crypto from 'crypto';

const generateRandomPassword = () => {
    const length = 10;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
};

function generateUniqueId(prefix) {
  const randomNumber = crypto.randomBytes(3).toString('hex').substring(0, 6).toUpperCase();
  return `${prefix}${randomNumber}`;
}
  
export { 
  generateRandomPassword,
  generateUniqueId 
};

