const new_letter_db = require("../models/news_letterModel");
const send_promotional_mails = require("../utils/emailHandler");

exports.promotional_forward_handler = async (req, res) => {
    const { content } = req.body;
    console.log(content, "content");
    try {
        let users = await new_letter_db.find();
        if (!users) return res.status(500).json({ message: "Error occured" });
        users.forEach((item) => {
            send_promotional_mails.send_promotional_mails(item.email, content);
        });

        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.promotional_handler = async (req, res) => {
    const { email } = req.body;
    try {
        let user = await new_letter_db.findOne({ email: email });
        if (user)
            return res.status(200).json({ message: "User is already Exists" });

        let add_user = new new_letter_db(req.body);
        await add_user.save();

        return res.status(200).json({ message: "Email has been saved" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        let products = await new_letter_db.findByIdAndDelete(productId);
        if (!products) {
            return res.status(404).json({
                message: "user not found",
            });
        }
        return res.status(200).json({
            message: "user  has been deleted",
            products,
        });
    } catch (err) {
        return res.status(500).json({
            error: "errror Occured",
        });
    }
};
exports.get_all_user = async (req, res) => {
    try {
        let user = await new_letter_db.find();
        if (user) return res.status(200).json({ user });

        return res.status(200).json({ message: "Email has been saved" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
