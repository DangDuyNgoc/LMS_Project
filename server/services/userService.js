import userModel from "../models/userModel.js";

export const getUserById = async (id, res) => {
  try {
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).send({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateUserRoleService = async (res, id, role) => {
  const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });
  return res.status(200).send({
    success: true,
    user,
  });
};
