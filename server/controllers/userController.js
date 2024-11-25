import { hashPassword, matchPass } from "../helpers/authHelper.js";
import { sendMail } from "../config/sendEmail.js";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../config/jwt.js";
import { getUserById, updateUserRoleService } from "../services/userService.js";
import userModel from "../models/userModel.js";

import jwt from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const registrationUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name) {
    return res.status(201).send({
      success: false,
      message: "Name is required!",
    });
  }
  if (!password) {
    return res.status(201).send({
      success: false,
      message: "password is required!",
    });
  }
  if (!email) {
    return res.status(201).send({
      success: false,
      message: "Email is required!",
    });
  }
  try {
    const existing = await userModel.findOne({ email });

    if (existing) {
      return res.status(400).send({
        success: false,
        message: "Email already exists",
      });
    }

    const hash = await hashPassword(password);

    const user = {
      name,
      email,
      password,
    };

    const token = await createToken(user);
    const activationCode = token.activationCode;

    const data = { user: { name: user.name }, activationCode };
    const html = await ejs.renderFile(
      path.join(__dirname, "../mail/activeMail.ejs"),
      data
    );

    try {
      await sendMail({
        email: user.email,
        subject: "Activation your account",
        template: "activeMail.ejs",
        data,
      });

      return res.status(200).send({
        success: true,
        message: `Please check your email: ${user.email} to activate your account!`,
        activationToken: token.token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Failed to send activation email",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Server",
      error: error,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(401).send({
        success: false,
        message: "Please enter email and password",
      });
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Haven't Registration Account yet",
      });
    }

    const match = await matchPass(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid Password",
      });
    }

    sendToken(user, 200, res);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Server",
    });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });

    res.status(200).send({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Server",
    });
  }
};

const createToken = async (user) => {
  try {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign(
      {
        user,
        activationCode,
      },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );
    return { token, activationCode };
  } catch (error) {
    throw new Error("Token creation failed");
  }
};

export const updateAccessToken = async (req, res) => {
  try {
    const refresh_token = req.headers["refresh_token"];
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);

    if (!decoded) {
      return res.status(400).send({
        success: false,
        message: "Invalid Refresh Token",
      });
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User not found",
      });
    }

    const accessToken = jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN, {
      expiresIn: "5m",
    });

    const refreshToken = jwt.sign(
      { id: decoded.id },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "3d",
      }
    );

    req.user = user;

    res.status(200).send({
      success: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// activation user account
export const activeUser = async (req, res) => {
  try {
    const { activation_token, activation_code } = req.body;

    const newUser = jwt.verify(activation_token, process.env.JWT_SECRET);

    if (newUser.activationCode !== activation_code) {
      return res.status(401).send({
        success: false,
        message: "Invalid activation code",
      });
    }

    const { name, email, password } = newUser.user;

    const existing = await userModel.findOne({ email });

    if (existing) {
      return res.status(400).send({
        success: false,
        message: "Email already exists",
      });
    }

    const hash = await hashPassword(password);

    const user = await userModel.create({ name, email, password: hash });

    res.status(200).send({
      success: true,
      message: "Activate User Successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Server",
    });
  }
};

// get user info
export const getUserInfo = async (req, res) => {
  try {
    const userId = req.user?._id;
    getUserById(userId, res);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// social auth
export const socialAuth = async (req, res) => {
  try {
    const { email, name, avatar } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    } else {
      sendToken(user, 200, res);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// update user info
export const updateUserInfo = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user?._id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }

    if (name && user) {
      user.name = name;
    }

    await user.save();

    res.status(200).send({
      success: true,
      message: "Updated user successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// update user password
export const updateUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?._id;
    const user = await userModel.findById(userId);

    if (!oldPassword || !newPassword) {
      return res.status(401).send({
        success: false,
        message: "Please enter your old and new password",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(401).send({
        success: false,
        message: "New password cannot be the same as your old password.",
      });
    }

    const matchPassword = await matchPass(oldPassword, user.password);
    if (!matchPassword) {
      return res.status(401).send({
        success: false,
        message: "Invalid Old Password",
      });
    }
    const hash = await hashPassword(newPassword);
    user.password = hash;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Updated Password",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// request reset password
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Please provide an email address.",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    const token = await createToken(user);
    const activationCode = token.activationCode;

    const data = { activationCode };
    const html = await ejs.renderFile(
      path.join(__dirname, "../mail/passwordMail.ejs"),
      data
    );

    try {
      await sendMail({
        email: user.email,
        subject: "Reset your password",
        template: "passwordMail.ejs",
        data,
      });

      return res.status(200).send({
        success: true,
        message: `Please check your email: ${user.email} to reset your password!`,
        activationToken: token.token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Failed to send activation email",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// verify otp reset password
export const verifyOTP = async (req, res) => {
  const { activation_token, activation_code } = req.body;

  if (!activation_token || !activation_code) {
    return res.status(400).send({
      success: false,
      message: "Please provide activation_code",
    });
  }

  const newUser = jwt.verify(activation_token, process.env.JWT_SECRET);

  if (newUser.activationCode !== activation_code) {
    return res.status(401).send({
      success: false,
      message: "Invalid activation code",
    });
  }

  res.status(200).send({
    success: true,
    message: "Verify OTP Successfully",
  });
};

// reset password
export const forgotPassword = async (req, res) => {
  try {
    const { newPassword, activation_token } = req.body;

    if (!newPassword) {
      return res.status(402).send({
        success: false,
        message: "Please provide newPassword",
      });
    }

    const decoded = jwt.verify(activation_token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.user?._id);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    const matchPassword = await matchPass(newPassword, user.password);
    if (matchPassword) {
      return res.status(400).send({
        success: false,
        message: "New password cannot be the same as the old password.",
      });
    }

    const hash = await hashPassword(newPassword);
    user.password = hash;

    await user.save();

    res.status(200).send({
      success: true,
      message: "Password reset successfully",
      user: user,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// update user avatar
export const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user?.id;

    const user = await userModel.findById(userId).select("+password");

    if (avatar && user) {
      // user already has avatar picture
      if (user?.avatar?.public_id) {
        // delete old avatar picture
        await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
          width: 150,
        });

        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } else {
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
          width: 150,
        });

        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
    }
    await user?.save();
    res.status(200).send({
      success: true,
      message: "Updated User Picture Successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get all users for admin
export const getAllUser = async (req, res) => {
  try {
    const user = await userModel.find().sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "All Users Retrieved Successfully",
      users: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// update user role
export const updateUserRole = async (req, res) => {
  try {
    const { email, role } = req.body;

    const user = await userModel.findOne({ email });

    if (user) {
      const id = user._id;
      updateUserRoleService(res, id, role);
    } else {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne({ id });

    return res.status(200).send({
      success: true,
      message: "Deleted User Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
