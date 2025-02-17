import Notification from "../models/notification.js";

export const getUserNotifications = async(req,res)=>{
    try {
        const notification = await Notification.find({recipient:req.user._id}).sort({createdAt:-1})
        .populate("relatedUser","name username profilePic")
        .populate("relatedPost","content image");
         res.status(200).json(notification);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"internal serever error"});
    }
}

export const markNotificationAsRead = async(req,res)=>{
    const notificationId = req.params.id;
    try {
        const notification = await Notification.findByIdAndUpdate({_id:notificationId,recipient:req.user._id},{read:true},{new:true});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"internal serever error"});
    }
}
export const deleteNotification = async (req, res) => {
	const notificationId = req.params.id;
	try {
		await Notification.findOneAndDelete({
			_id: notificationId,
			recipient: req.user._id,
		});

		res.json({ message: "Notification deleted successfully" });
	} catch (error) {
        console.log(error);
		res.status(500).json({ message: "Server error" });
	}
};