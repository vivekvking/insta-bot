const Chatlog = require("../models/chatlog");
const { chatWithOpenAI } = require("../openAI/index");
const { emitMsgToIgClient } = require("../intagram/responseHandler");

const processUserMessage = async (senderId, usertext) => {
    try {
        let chatlog = new Chatlog({
            senderId,
            role: "user",
            message: usertext,
        });
        await chatlog.save();
        let old_chatlogs = await Chatlog.find({ senderId }).lean();
        let messages = old_chatlogs.map((e) => new Object({ role: e.role, content: e.message }));
        let aiRes = await chatWithOpenAI(messages);
        let responseText =
            aiRes.choices[0].message.content ??
            "Sorry, i cannot help you with this || System Message";
        let res_chatlog = new Chatlog({
            senderId,
            role: "assistant",
            message: responseText,
        });
        console.log("\n\n AI USAGE =====> ", aiRes?.usage, "\n\n")
        await res_chatlog.save();
        await emitMsgToIgClient({senderId, responseText})
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    processUserMessage
}
