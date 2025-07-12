require("dotenv").config();

const RedirectDb = require('../models/redirecturls');



exports.createRedirecturl = async (req, res) => {
    const { url, redirecturl } = req.body

    try {
        let existingRedirectUrl = await RedirectDb.findOne({ url: url })
        if (existingRedirectUrl) {
            return res.status(401).json({
                error: "RedirectUrl is already added"
            })

        }

        const newdb = new RedirectDb(req.body)
        await newdb.save()
        return res.status(200).json({
            message: "Redirects Urls has been saved"
        })
    } catch (error) {

        return res.status(error.status || 500).json({
            error: error.message || "internal server error"
        })

    }



}

exports.findAll = async (req, res) => {

    try {
        let redirecturls = await RedirectDb.find()
        return res.status(200).json({
            redirecturls
        })
    } catch (error) {

        return res.status(error.status || 500).json({
            error: error.message || "internal server error"
        })

    }



}


exports.updateRedirectUrl = async (req, res) => {
    const {url} = req.params
    const updatedAt = new Date()
    try {
        let existingRedirectUrl = await RedirectDb.findOne({_id:url})
        if (!existingRedirectUrl) {
            return res.status(404).json({
                error: "RedirectUrl not found"
            })

        }

        const redirecturl = await RedirectDb.updateOne(
            { _id:url },
            { $set: { ...req.body, updatedAt } }
        );

        return res.status(200).json({
            message: "Redirects Urls has been saved",
            redirecturl
        })
    } catch (error) {

        return res.status(error.status || 500).json({
            error: error.message || "internal server error"
        })

    }





}



exports.findSingleRedirect = async (req, res) => {
    const { url } = req.body
    
    if (!url) {
        return res.status(404).json({
            error: "RedirectUrl not found from body"
        })

    }
    try {
        let existingRedirectUrl = await RedirectDb.findOne({ url: url.trim() })
        if (!existingRedirectUrl) {
            return res.status(404).json({
                error: "RedirectUrl not found"
            })

        }
        console.log(url, "urls", existingRedirectUrl)
        return res.status(200).json({
            redirectUrl: existingRedirectUrl
        })
    } catch (error) {

        return res.status(error.status || 500).json({
            error: error.message || "internal server error"
        })

    }





}


exports.DeleteRedirect = async (req, res) => {
    const { url } = req.params

    try {
        let existingRedirectUrl = await RedirectDb.deleteOne({ _id: url })
        if (!existingRedirectUrl) {
            return res.status(404).json({
                error: "RedirectUrl not found"
            })

        }
        return res.status(200).json({
            message: "Redirects Urls has been Deleted",
            redirectUrl: existingRedirectUrl
        })
    } catch (error) {

        return res.status(error.status || 500).json({
            error: error.message || "internal server error"
        })

    }





}



