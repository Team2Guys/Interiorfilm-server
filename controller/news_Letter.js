const new_letter_db = require('../models/news_letterModel')
const send_promotional_mails = require('../utils/emailHandler')



exports.promotional_forward_handler = async (req, res) => {
    const { content } = req.body
    console.log(content, "content")
    try {
        let users = await new_letter_db.find()
        // let users = [{
        //     email: "mujtaba.shafique01@gmail.com",
        // }]
        console.log(users);
        if (!users) return res.status(500).json({ message: "Error occured" });
        users.forEach((item) => {
            send_promotional_mails.send_promotional_mails(item.email, content)
        })


        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ message: error.message });

    }




}



exports.promotional_handler = async (req, res) => {
    const { email } = req.body
    try {
        let user = await new_letter_db.findOne({ email: email })
        if (user) return res.status(200).json({ message: "User is already Exists" });

        let add_user = new new_letter_db(req.body)
        await add_user.save()



        return res.status(200).json({ message: "Email has been saved" });
    } catch (error) {
        return res.status(500).json({ message: error.message });

    }




}
