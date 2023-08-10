const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const apilog = new Schema(
    {
        request: {type: Object},
        response: {type: Object},
    },
    {
        timestamps: true,
    }
);

const Apilog = mongoose.model("apilog", apilog, "apilog");

module.exports = Apilog;
