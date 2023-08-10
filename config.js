const instagramCreds = {
    pageAccessToken: process.env.IGPageAccessToken,
    appSecret: process.env.IGAppSecret,
    verificationToken: process.env.IGVerificationToken,
    pageId: process.env.IGPageId,
    status: process.env?.IG_BOT_STATUS === "true" ? true : false,
};

const DB = {
    USERNAME: process.env.CS_DB_USERNAME,
    PASSWORD: process.env.CS_DB_PASSWORD,
    URL: process.env.CS_DB_URL,
    PORT: process.env.CS_DB_PORT,
    NAME: process.env.CS_DB_NAME,
};

module.exports = {
    instagramCreds,
    DB
}
