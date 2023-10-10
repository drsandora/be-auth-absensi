const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const secretKey = 'rxhchVEpoHx0HHyczja2dZAFtnjlQqsH'; // 256 bits (32 bytes) for AES-256
const iv = 'f2EkuiB2eHccCUcy';

const {
  APP_SECRET,
  TEMP_SECRET
} = require("../config");


module.exports.Encrypt = (text) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

module.exports.Decrypt = (text) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports.FormateData = (data) => {
    if (data) {
      return { data };
    } else {
      throw new Error("Data Not found!");
    }
  };

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let encrypted = cipher.update(enteredPassword, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted == savedPassword;
};

module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "3600s" });
  } catch (error) {
    return error;
  }
};
// { username: 'dasce', loginpemakai_id: 2 }
module.exports.GenerateTempSignature = async (payload) => {
  try {
    return await jwt.sign(payload, TEMP_SECRET, { expiresIn: "360S" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateTempToken = async (payload) => {
  try {
    jwt.verify(payload.temp_token, TEMP_SECRET, (err, decode) =>{
      if(err) throw new Error("Token Not Valid!");
    });
    return await jwt.sign({payload}, APP_SECRET, { expiresIn: "60S" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    return false;
  }
};