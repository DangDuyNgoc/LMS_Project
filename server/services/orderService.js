import orderModel from "./../models/orderModel.js";

export const newOrder = async (data, res) => {
  const order = await orderModel.create(data);
  return res.status(200).send({
    success: true,
    message: "Order created successfully",
    order,
  });
};
