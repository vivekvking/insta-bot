const { igBotClient } = require("../app");
const _ = require('lodash')
const { processUserMessage } = require("../controller/processor");

const { instagramCreds } = require("../config");
let igIceBreakerButtons = {};
let IGAccessTokenMap = {};

if (instagramCreds.status) {
    // igBotClient.setGreetingText(
    //     {
    //         pageId: instagramCreds.pageId,
    //         greeting: [
    //             {
    //                 locale: "default",
    //                 text: CONSTANTS.FB_GREETING_TEXT,
    //             },
    //         ],
    //     },
    //     (err, body) => {
    // log it
    // console.log("err setGreetingText--",err);
    // console.log("body setGreetingText--",body);
    //     }
    // );

    igBotClient.on("message", (senderId, message, data) => {
        console.log("Hey Vivek IG");
        console.log("senderId--", senderId);
        let recipientId = message?.recipient?.id ?? "";
        console.log("recipientId--", recipientId);
        console.log("message--", message);
        console.log("messageTimestamp--", message.timestamp);
        console.log("data--", data);

        // const { userData, igObj } = BrainService.getIGInitializers({
        //     senderId: `${senderId}_${recipientId}`,
        //     userText: data.text,
        //     data: message,
        // });

        igBotClient.sendAction({
            id: senderId,
            action: "typing_on",
        });
        igBotClient.sendAction({
            id: senderId,
            action: "mark_seen",
        });

        let userText = data.text;

        processUserMessage(senderId, userText)

        // BrainService.processCustomerMessage(igObj, userData);
    });

    // igBotClient.on("postback", (senderId, message, postback, ref) => {
    //     console.log("hey vivek");
    //     if (postback === "GET_STARTED_CLICKED") {
    //         const { userData, igObj } = BrainService.getIGInitializers({
    //             senderId,
    //             userText: "GET_STARTED_CLICKED",
    //             data: message,
    //         });
    //         genAndSendResponse(igObj, null, "response", "585d25fd3ecdc78b6b8f5f98");
    //         genAndSendResponse(igObj, null, "response", "5b582cd369829e107b352dfd");
    //     } else {
    //         const postbackPayload = JSON.parse(postback);
    //         let recipientId = message?.recipient?.id ?? "";
    //         if (postbackPayload.type === "default") {
    //             const userQuery = postbackPayload.payload.query;
    //             const { userData, igObj } = BrainService.getIGInitializers({
    //                 senderId: `${senderId}_${recipientId}`,
    //                 userText: userQuery,
    //                 data: message,
    //             });
    //             BrainService.processCustomerMessage(igObj, userData);
    //         } else if (postbackPayload.type === "customSocketEvent") {
    //             let userData = {};
    //             userData.type = "text";
    //             userData.text = message?.postback?.title?.toLowerCase() ?? "";
    //             userData.relayData = postbackPayload?.payload?.relayData ?? null;
    //             // TODO - get info on cm_id and get it implemented too
    //             userData.preAnalyzedResponse = {
    //                 intentName: "None",
    //                 statusCode: 200,
    //                 initialNlpAnalysisSnapshot: {
    //                     name: "oriNlp",
    //                     intentSnapshot: { intent: "None", score: 1 },
    //                     entitySnapshot: userData.relayData,
    //                 },
    //                 entities: userData.relayData,
    //             };
    //             const igObj = {};
    //             igObj.channel = "instagram";
    //             igObj.senderId = `${senderId}_${recipientId}`;
    //             igObj.isOtherVendor = false;
    //             igObj.userInfo = null;
    //             igObj.otherVendorPlatformName = null;
    //             igObj.otherVendorPlatformId = null;
    //             igObj.otherVendorName = null;
    //             igObj.handshake = {
    //                 query: {
    //                     psid: `${senderId}_${recipientId}`,
    //                     ver: 1.1,
    //                     brandName: process.env.BRAND_NAME,
    //                     channelName: "instagram",
    //                 },
    //                 headers: {
    //                     "user-agent": "",
    //                     origin: "",
    //                     host: "",
    //                 },
    //             };
    //             BrainService.processCustomerMessage(igObj, userData);
    //         } else if (postbackPayload.type === "RESET_CHAT") {
    //             //  todo - here invoke reset chat context func
    //         }
    //     }
    // });
}

// const enableIgIceBreaker = async (igIceBreakerButtons) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             for (let pageButtons in igIceBreakerButtons) {
//                 let buttonsArr = [];
//                 if (
//                     igIceBreakerButtons[pageButtons] && !_.isEmpty(igIceBreakerButtons[pageButtons])
//                 ) {
//                     for (let a of igIceBreakerButtons[pageButtons]) {
//                         buttonsArr.push({
//                             question: a,
//                             payload: `{"type":"default","payload":{"query":"${a}"}}`,
//                         });
//                     }
//                     let body = {
//                         platform: "instagram",
//                         ice_breakers: [
//                             {
//                                 call_to_actions: buttonsArr,
//                                 locale: "default", // default locale is REQUIRED
//                             },
//                         ],
//                     };
//                     var options = {
//                         method: "POST",
//                         url: "https://graph.facebook.com/v11.0/me/messenger_profile",
//                         headers: { "Content-Type": "application/json" },
//                         params: {
//                             platform: "instagram",
//                             access_token:
//                                 IGAccessTokenMap?.[pageButtons] ?? process.env.IGPageAccessToken,
//                         },
//                         data: body,
//                     };
//                     const axios = require("axios");
//                     try {
//                         let response = await axios(options);
//                         console.log("Ice breakers set => ", response);
//                     } catch (err) {
//                         console.log("Ice breakers", err);
//                         handleAppError({ err });
//                     }
//                 } else {
//                     var options = {
//                         method: "DELETE",
//                         url: "https://graph.facebook.com/v11.0/me/messenger_profile",
//                         headers: { "Content-Type": "application/json" },
//                         params: {
//                             platform: "instagram",
//                             access_token:
//                                 IGAccessTokenMap?.[pageButtons] ?? process.env.IGPageAccessToken,
//                         },
//                         data: {
//                             fields: ["ice_breakers"],
//                         },
//                     };
//                     const axios = require("axios");
//                     try {
//                         let response = await axios(options);
//                         console.log("Ice breakers delete => ", response);
//                     } catch (err) {
//                         handleAppError({ err });
//                     }
//                 }
//             }
//         } catch (err) {
//             handleAppError({ err });
//         }
//     });
// };
