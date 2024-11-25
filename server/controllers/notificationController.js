import notificationModel from "../models/notificationModel.js";
import cron from "node-cron";

// get all notifications only for admin
export const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find()
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Get All Notifications Successfully",
      data: notifications,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// update notifications status for only admin
export const updateNotification = async (req, res) => {
  try {
    const notification = await notificationModel.findById(req.params.id);
    if (!notification) {
      return res.status(404).send({
        success: false,
        message: "Could not found Notification",
      });
    } else {
      notification.status
        ? (notification.status = "read")
        : notification.status;
    }

    await notification.save();

    const notificationData = await notificationModel
      .find()
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Update Notification Status Successfully",
      data: notificationData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// delete notification only for admin
cron.schedule("0 0 0 * * *", async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await notificationModel.deleteMany({
    status: "read",
    createdAt: { $lt: thirtyDaysAgo },
  });
  console.log("Deleted read Notifications");
});
