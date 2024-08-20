const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxLength: 35
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            maxLength: 255
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

    },
    {
        timestamps: true,
    }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
