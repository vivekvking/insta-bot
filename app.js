const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const PORT = parseInt(process?.env?.CS_PORT) ?? 3000;
const { DB, instagramCreds } = require("./config");

app.use((req, res, next) => {
    console.log("Req on ", req.method, "    ", req.url);
    next()
});

// instagram configuration
const FB = require("./non_npm_modules/botly");
// let igBotClient;
// if (instagramCreds.status) {
    let igBotClient = new FB({
        accessToken: instagramCreds.pageAccessToken,
        verifyToken: instagramCreds.verificationToken,
        webHookPath: "/",
        notificationType: FB.CONST.NOTIFICATION_TYPE.REGULAR,
        FB_URL: "https://graph.facebook.com/v16.0/",
    });
// }

app.use(
    express.json({
        verify: igBotClient.getVerifySignature(instagramCreds.appSecret),
    })
);
app.use("/ig/webhook", igBotClient.router());

let url = "";
if (!DB.USERNAME) url = `mongodb://${DB.URL}:${DB.PORT}/${DB.NAME}`;
else url = `mongodb://${DB.USERNAME}:${DB.PASSWORD}@${DB.URL}:${DB.PORT}/${DB.NAME}`;
mongoose
    .connect(url)
    .then(() => {
        console.log("DB connected Successfully!!");
        app.listen(PORT, async () => {
            console.log("Server started on port ", PORT);
        });
    })
    .catch((err) => {
        console.log("ERROR Occured ", err);
    });

module.exports = {
    // OpenAI,
    igBotClient,
};

const igBotManger = require('./intagram/requestHandler')
