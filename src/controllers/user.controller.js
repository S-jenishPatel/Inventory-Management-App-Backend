const User = require("../models/user.model");
const {
  uploadOnCloudinary,
  destroyOnCloudinary,
} = require("../config/cloudinary");
const jwt = require("jsonwebtoken");

const generateAccessAndRefreshTokens = async (id, res) => {
  try {
    const user = await User.findById(id);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    res
      .status(500)
      .send("Error while generating access token and refresh token");
  }
};

const signup = async (req, res) => {
  const { username, password, email, phoneNumber } = req.body;

  if (!username || !email || !password) {
    res.status(400).send("All Fields are required");
  }

  const ExistingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (ExistingUser) {
    res.status(409).send("Username or Email already exists");
  }

  const userImage = req.file?.path;

  //   if (!userImage) {
  //     res.status(400).send("User Image is required");
  //   }

  const imageObject = await uploadOnCloudinary(userImage);
  //   if (!imageURL) {
  //     res.status(500).send("Failed to upload on Cloudinary");
  //   }

  const newUser = await User.create({
    username,
    password,
    email,
    phoneNumber,
    image: imageObject ? imageObject.url : "",
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    res.status(500).send("Failed to register the user in the database");
  }

  return res
    .status(200)
    .json({ message: "User Registered Successfully", data: createdUser });
};

const login = async (req, res) => {
  const { username, email, password } = req.body;

  if ((!username && !email) || !password) {
    res.status(400).send("Username/Email and Password are required");
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (!existingUser) {
    res.status(404).send("Username/Email entered is incorrect");
  }

  const isPasswordCorrect = await existingUser.checkPassword(password);
  if (!isPasswordCorrect) {
    res.status(401).send("Password entered is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    existingUser._id,
    res
  );

  const loggedInUser = await User.findById(existingUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({ message: "User logged in sucessfully", data: loggedInUser });
};

const logout = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "User logged out successfully" });
};

const regenerateTokens = async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    res.status(401).send("Unauthorized request");
  }

  const decodedToken = await jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken._id);
  if (!user) {
    res.status(401).send("Invalid Refresh Token");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    res.status(401).send("Refresh Token Expired");
  }

  const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json({ message: "JWT Tokens Refreshed Successfully" });
};

const changeCurrentPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.checkPassword(oldPassword);

  if (!isPasswordCorrect) {
    res.status(400).send("Incorrect Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json({ message: "Password changed successfully" });
};

const getUser = (req, res) => {
  return res
    .status(200)
    .json({ message: "User fetched successfully", data: req.user });
};

const updateUser = async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    res.status(400).send("No field to update");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        email,
        phoneNumber,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json({ message: "User updated successfully", data: user });
};

const updateUserImage = async (req, res) => {
  const imagePath = req.file?.path;

  if (!imagePath) {
    res.status(400).send("Image is required");
  }

  const imageObject = await uploadOnCloudinary(imagePath);

  if (!imageObject.url) {
    return res.status(400).send("Failed to upload on Cloudinary");
  }

  //   Delete old image
  const existingUser = await User.findById(req.user?._id);

  const getPublicId = (imageURL) => imageURL.split("/").pop().split(".")[0];
  const public_id = getPublicId(existingUser.image);

  await destroyOnCloudinary(public_id);
  //   Delete old image

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        image: imageObject.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json({ message: "Image updated successfully", data: user });
};

module.exports = {
  signup,
  login,
  logout,
  getUser,
  updateUser,
  changeCurrentPassword,
  updateUserImage,
  regenerateTokens,
};
