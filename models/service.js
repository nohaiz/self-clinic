const mongoose = require("mongoose");
const User = require("./user");

const serviceSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            validate: {
                validator: async (userId) => {
                    const user = await User.findById(userId);

                    if (user && user.adminAct) {
                        return true;
                    } else false;
                },
                message: "User not valid",
            }
        },

    },
    {
        timestamps: true,
    }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
