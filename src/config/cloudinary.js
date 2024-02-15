const { v2 } = require("cloudinary");
const fs = require("fs");

v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    //upload the file on cloudinary
    const cloudinaryResponseObject = await v2.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);

    return cloudinaryResponseObject;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const destroyOnCloudinary = async (public_id) => {
  try {
    return await v2.uploader.destroy(public_id);
  } catch (error) {
    return null;
  }
};

module.exports = { uploadOnCloudinary, destroyOnCloudinary };
