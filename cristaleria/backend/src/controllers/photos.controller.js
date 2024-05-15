const { Cloudinary } = require('../../config')
const path = require("path");
const fs = require("fs");
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: Cloudinary.cloud,
    api_key: Cloudinary.apiKey,
    api_secret: Cloudinary.apiSecret
});

async function uploadImage( imgPath, nameImg ) {
  const response = await cloudinary.uploader.upload(imgPath)
  let route = (await response).secure_url;
  const img = nameImg;
  let router = path.join(__dirname, `../../public/images/${img}`);                                                                                                                      
  try {
    await fs.unlinkSync(router);                                                                                                
    console.log(` file removed ${router}`);                                                                     
  } catch (err) {
    console.error(err);
  }
  return route;
}

module.exports = {
    uploadImage
}