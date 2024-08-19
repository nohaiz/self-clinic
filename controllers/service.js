// IMPORTED MODULES
const express = require("express");
const router = express.Router();

//MIDDLEWARE
const isAdmin = require("../middlewares/checkAdmin");

// MODELS
const ServiceModel = require("../models/service");


// FETCH ALL SERVICES
router.get("/", async (req, res) => {
    try {

        const services = await ServiceModel.find({});
        return res.status(200).json({ services })

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

// FETCH A SERVICE WITH ID
router.get("/:id", async (req, res) => {
    try {

        const service = await ServiceModel.findById(req.params.id);

        if (!service) {
           return res.status(404).json({ message: "Service not found" })
        }

        return res.status(200).json(service)

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

// CREATE A SERVICE WITH ID
router.post("/", isAdmin, async (req, res) => {
    try {

        const { name, category, description, user } = req.body;
        const service = await ServiceModel.create({ name, category, description, user });

        return res.status(201).json({ message: "Service created successfully.", service });

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

// UPDATE A SERVICE WITH ID
router.put("/:id", isAdmin, async (req, res) => {
    try {
        const service = await ServiceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        return res.status(202).json({ message: "Service updated successfully.", service });

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

// DELETE A SERVICE WITH ID
router.delete("/:id", isAdmin, async (req, res) => {
    try {
        if (!req.user.type[2000]) {
            return res.status(401).json({
                message: "Invalid User"
            })
        }
        const service = await ServiceModel.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: "Service not found for deletion" });
        }

        await ServiceModel.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: "Service deleted successfully." });

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})




module.exports = router;