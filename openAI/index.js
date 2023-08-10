const { Configuration, OpenAIApi } = require("openai");
const openAIConfiguration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY_ENIGMA,
});
const OpenAI = new OpenAIApi(openAIConfiguration);


let chatWithOpenAI = async (messages = []) => {
    try {
        if (!messages || messages.length == 0) {
            throw new Error("messages missing");
        }
        const chatCompletion = await OpenAI.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages,
            max_tokens: 2000,
        });
        console.log("\n \n \n ")
        console.log(JSON.stringify(chatCompletion.data))
        console.log("\n \n \n ")
        return chatCompletion.data;
        
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    chatWithOpenAI
}
