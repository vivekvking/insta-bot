const _ = require("lodash");
let igBotClient;
const IgBot = require("../non_npm_modules/botly");

let IGAccessTokenMap = {};
// (async function () {
//     try {
//         IGAccessTokenMap = require("../BrainService/brand-files/configurations/constants")?.['IG_access_token_map'] ?? {};
//         // IGAccessTokenMap = IG_access_token_map;
//     } catch (err) {
//         IGAccessTokenMap = {};
//     }
// })();

async function emitMsgToIgClient({ senderId, responseText }) {
    try {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("HERE IN emitigclient");

                if (!igBotClient) {
                    igBotClient = require("../app").igBotClient;
                }
                console.log("\n \n \n ");

                console.log("emit msg to ig user----", senderId);
                console.log("\n \n \n  ");

                await emitTextMsgIgNew({
                    senderId, responseText
                });

                // switch (generatedMessageData.result.bot_messages[0].type) {
                //     case "text":
                //         await emitTextMsgIg({
                //             socket,
                //             messageDoc,
                //             generatedMessageData,
                //         });
                //         break;
                //     case "text_with_buttons":
                //         await emitTextWBtnMsgIg({
                //             socket,
                //             messageDoc,
                //             generatedMessageData,
                //             session_doc,
                //         });
                //         break;
                //     case "image_with_buttons":
                //         await emitImgWBtnMsgIg({
                //             socket,
                //             messageDoc,
                //             generatedMessageData,
                //         });
                //         break;
                //     case "video":
                //         await emitVideoMsgIg({
                //             socket,
                //             messageDoc,
                //             generatedMessageData,
                //         });
                //         break;
                //     case "carousel":
                //         await emitCarouselMsgIg({
                //             socket,
                //             messageDoc,
                //             generatedMessageData,
                //         });
                //         break;
                //     case "customMsg":
                //         await emitDefaultMessageIg({
                //             socket,
                //             messageDoc,
                //             generatedMessageData: generatedMessageData || null,
                //         });
                //         break;
                //     default:
                //         await emitDefaultMessageIg({
                //             socket,
                //             messageDoc,
                //             generatedMessageData: generatedMessageData || null,
                //         });
                // }

                return resolve("success");
            } catch (err) {
                console.log(`An error has occurred -- ${err}`);
            }
        });
    } catch (err) {
        console.log(`An error has occurred -- ${err}`);
    }
}

async function emitTextMsgIgNew({
    senderId, responseText
}) {
    try {
        return new Promise(async (resolve, reject) => {
            try {
                if (!igBotClient) {
                    igBotClient = require("../app").igBotClient;
                }

                let quickReplies = []
                // const quickReplies = genQuickReplies({
                //     quickRepliesInitial: generatedMessageData.result.bot_messages[0].quickReplies,
                // });
                // let msgText =
                //     generatedMessageData.result.bot_messages[0].payload.text ||
                //     "Some error(3102) occurred. Please try again later.";
                
                let msgText = responseText
            

                // if (generatedMessageData.result.bot_messages[0].containsHTML) {
                //     msgText = await generateTextForInstagram(msgText, socket);
                // }

                // if (!_.isEmpty(quickReplies)) {
                //     options.quick_replies = quickReplies;
                // }
                let msgTextArray = splitString(msgText, 1000);

                for (let i = 0; i < msgTextArray.length; i++) {
                    const options = {
                        id: senderId,
                        text: msgTextArray[i],
                    };
                    // if (i == msgTextArray.length - 1 && !_.isEmpty(quickReplies)) {
                    //     options.quick_replies = quickReplies;
                    // }
                    // if (IGAccessTokenMap[socket.senderId.split("_")[1]]) {
                    //     options.accessToken = IGAccessTokenMap[socket.senderId.split("_")[1]];
                    // }

                    igBotClient.sendText(options, (err, body) => {
                        if (err) {
                            handleAppError({ err });
                            return;
                        }
                        // log it
                        console.log("err-----", err);
                        console.log("body-----", body);
                        console.log(
                            "emitted success------",responseText
                        );
                    });

                    return resolve("done");
                }
            } catch (err) {
                console.log(`An error has occurred -- ${err}`);
                return reject(err);
            }
        });
    } catch (err) {
        console.log(`An error has occurred -- ${err}`);
    }
}

async function emitTextMsgIg({
    socket,
    messageDoc,
    generatedMessageData,
    customText = null,
    customQuickReply = null,
}) {
    try {
        return new Promise(async (resolve, reject) => {
            try {
                if (!igBotClient) {
                    igBotClient = require("../app").igBotClient;
                }

                if (customText) {
                    const options = {
                        id: socket.senderId.split("_")[0],
                        text: customText || "Some error(31012) occurred. Please try again later.",
                    };

                    if (IGAccessTokenMap[socket.senderId.split("_")[1]]) {
                        options.accessToken = IGAccessTokenMap[socket.senderId.split("_")[1]];
                    }

                    if (customQuickReply) {
                        options.quick_replies = customQuickReply;
                    }

                    igBotClient.sendText(options, (err, body) => {
                        // log it
                        if (err) {
                            handleAppError({ err });
                            return;
                        }
                        // console.log('err-----', err);
                        console.log("ig body-----", body);
                        return resolve("done");
                    });
                } else {
                    const quickReplies = genQuickReplies({
                        quickRepliesInitial:
                            generatedMessageData.result.bot_messages[0].quickReplies,
                    });
                    let msgText =
                        generatedMessageData.result.bot_messages[0].payload.text ||
                        "Some error(3102) occurred. Please try again later.";
                    // live chat agent name appended
                    if (socket.adminToUserMsg) {
                        msgText =
                            (generatedMessageData.result.bot_messages[0].senderInfo.pseudoName
                                ? `*${generatedMessageData.result.bot_messages[0].senderInfo.pseudoName}*<br>`
                                : `*${generatedMessageData.result.bot_messages[0].senderInfo.role}*<br>`) +
                            msgText;
                    }

                    if (generatedMessageData.result.bot_messages[0].containsHTML) {
                        msgText = await generateTextForInstagram(msgText, socket);
                    }

                    // if (!_.isEmpty(quickReplies)) {
                    //     options.quick_replies = quickReplies;
                    // }
                    let msgTextArray = splitString(msgText, 1000);

                    for (let i = 0; i < msgTextArray.length; i++) {
                        const options = {
                            id: socket.senderId.split("_")[0],
                            text: msgTextArray[i],
                        };
                        if (i == msgTextArray.length - 1 && !_.isEmpty(quickReplies)) {
                            options.quick_replies = quickReplies;
                        }
                        if (IGAccessTokenMap[socket.senderId.split("_")[1]]) {
                            options.accessToken = IGAccessTokenMap[socket.senderId.split("_")[1]];
                        }

                        igBotClient.sendText(options, (err, body) => {
                            if (err) {
                                handleAppError({ err });
                                return;
                            }
                            // log it
                            console.log("err-----", err);
                            console.log("body-----", body);
                            console.log(
                                "emitted success------",
                                generatedMessageData.result.bot_messages[0].payload.text
                            );
                        });
                    }
                    return resolve("done");
                }
            } catch (err) {
                console.log(`An error has occurred -- ${err}`);
                return reject(err);
            }
        });
    } catch (err) {
        console.log(`An error has occurred -- ${err}`);
    }
}

async function emitTextWBtnMsgIg({ socket, messageDoc, generatedMessageData, session_doc }) {
    try {
        return new Promise(async (resolve, reject) => {
            try {
                if (!igBotClient) {
                    igBotClient = require("../app").igBotClient;
                }
                // console.log("jodjos-",fkdjfkd);
                let quickReplies = genQuickReplies({
                    quickRepliesInitial: generatedMessageData.result.bot_messages[0].quickReplies,
                });
                const buttonsObj = genButtons({
                    buttonsInitial: generatedMessageData.result.bot_messages[0].payload.buttons,
                    session_doc,
                    socket,
                    generatedMessageData,
                });
                const { buttons } = buttonsObj;
                if (buttonsObj.quickReplies && buttonsObj.quickReplies.length > 0) {
                    quickReplies = quickReplies.concat(buttonsObj.quickReplies);
                }

                let title = generatedMessageData.result.bot_messages[0].payload.title
                    ? `${generatedMessageData.result.bot_messages[0].payload.title} `
                    : "";
                title += generatedMessageData.result.bot_messages[0].payload.subtitle || "";

                if (buttonsObj.linkButtonText) {
                    title += buttonsObj.linkButtonText;
                }

                title = await generateTextForInstagram(title, socket);

                const element = {
                    title,
                    buttons,
                };

                const options = {
                    id: socket.senderId.split("_")[0],
                    elements: element,
                };

                if (!_.isEmpty(quickReplies)) {
                    options.quick_replies = quickReplies;
                }

                // all buttons are converted to quick replies
                if (_.isEmpty(buttons)) {
                    const newOptions = {
                        id: socket.senderId.split("_")[0],
                        text: title,
                    };
                    if (!_.isEmpty(quickReplies)) {
                        newOptions.quick_replies = quickReplies;
                    }

                    if (IGAccessTokenMap[socket.senderId.split("_")[1]]) {
                        newOptions.accessToken = IGAccessTokenMap[socket.senderId.split("_")[1]];
                    }

                    igBotClient.sendText(newOptions, (err, body) => {
                        if (err) {
                            handleAppError({ err });
                            return;
                        }
                        // log it
                        console.log("err emitTextWBunMsgIg-----", err);
                        console.log("body emitTextWBunMsgIg-----", body);
                        console.log(
                            "emitted success emitTextWBunMsgIg-----",
                            generatedMessageData.result.bot_messages[0].payload.text
                        );
                        return resolve("done");
                    });
                } else {
                    if (IGAccessTokenMap[socket.senderId.split("_")[1]]) {
                        options.accessToken = IGAccessTokenMap[socket.senderId.split("_")[1]];
                    }

                    igBotClient.sendGeneric(options, (err, body) => {
                        if (err) {
                            handleAppError({ err });
                            return;
                        }
                        console.log("err emitTextWBtnMsgIg-----", err);
                        console.log("body emitTextWBtnMsgIg-----", body);
                        console.log(
                            "emitted success emitTextWBtnMsgIg------",
                            generatedMessageData.result.bot_messages[0].payload.text
                        );
                        return resolve("done");
                    });
                }
            } catch (err) {
                console.log(`An error has occurred -- ${err}`);
                return reject(err);
            }
        });
    } catch (err) {
        console.log(`An error has occurred -- ${err}`);
    }
}

async function emitImgWBtnMsgIg({ socket, messageDoc, generatedMessageData }) {
    try {
        return new Promise(async (resolve, reject) => {
            try {
                if (!igBotClient) {
                    igBotClient = require("../app").igBotClient;
                }

                let quickReplies = genQuickReplies({
                    quickRepliesInitial: generatedMessageData.result.bot_messages[0].quickReplies,
                });
                const buttonsObj = genButtons({
                    buttonsInitial: generatedMessageData.result.bot_messages[0].payload.buttons,
                });
                const buttons = buttonsObj.buttons;
                if (buttonsObj.quickReplies && buttonsObj.quickReplies.length > 0) {
                    quickReplies = quickReplies.concat(buttonsObj.quickReplies);
                }

                if (
                    _.isEmpty(quickReplies) &&
                    _.isEmpty(buttons) &&
                    !generatedMessageData.result.bot_messages[0].payload.title &&
                    !generatedMessageData.result.bot_messages[0].payload.subtitle &&
                    !buttonsObj.linkButtonText
                ) {
                    const options = {
                        id: socket.senderId.split("_")[0],
                        url: generatedMessageData.result.bot_messages[0].payload.imageUrl,
                    };
                    if (IGAccessTokenMap[socket.senderId.split("_")[1]]) {
                        options.accessToken = IGAccessTokenMap[socket.senderId.split("_")[1]];
                    }

                    igBotClient.sendImage(options, (err, data) => {
                        if (err) {
                            handleAppError({ err });
                            return;
                        }
                        console.log("send ig image:", err, data);
                        return resolve("done");
                    });
                } else {
                    const element = {
                        title:
                            generatedMessageData.result.bot_messages[0].payload.title ||
                            generatedMessageData.result.bot_messages[0].payload.subtitle,
                        image_url: generatedMessageData.result.bot_messages[0].payload.imageUrl,
                        buttons,
                    };

                    if (generatedMessageData.result.bot_messages[0].payload.title) {
                        element.subtitle =
                            generatedMessageData.result.bot_messages[0].payload.subtitle;
                    }

                    if (buttonsObj.linkButtonText) {
                        element.subtitle = element.subtitle
                            ? element.subtitle + buttonsObj.linkButtonText
                            : buttonsObj.linkButtonText;
                    }

                    if (element.title)
                        element.title = await generateTextForInstagram(element.title);
                    if (element.subtitle)
                        element.subtitle = await generateTextForInstagram(element.subtitle);

                    const options = {
                        id: socket.senderId.split("_")[0],
                        elements: element,
                        aspectRatio: IgBot.CONST.IMAGE_ASPECT_RATIO.HORIZONTAL,
                    };
                    if (!_.isEmpty(quickReplies)) {
                        options.quick_replies = quickReplies;
                    }
                    if (IGAccessTokenMap[socket.senderId.split("_")[1]]) {
                        options.accessToken = IGAccessTokenMap[socket.senderId.split("_")[1]];
                    }

                    igBotClient.sendGeneric(options, (err, data) => {
                        if (err) {
                            handleAppError({ err });
                            return;
                        }
                        console.log("send generic cb:", err, data);
                        return resolve("done");
                    });
                }
            } catch (err) {
                console.log(`An error has occurred -- ${err}`);
                return reject(err);
            }
        });
    } catch (err) {
        console.log(`An error has occurred -- ${err}`);
    }
}

async function emitVideoMsgIg({ socket, messageDoc, generatedMessageData }) {
    try {
        return new Promise(async (resolve, reject) => {
            try {
                if (!igBotClient) {
                    igBotClient = require("../app").igBotClient;
                }
                let quickReplies = genQuickReplies({
                    quickRepliesInitial: generatedMessageData.result.bot_messages[0].quickReplies,
                });
                const buttonsObj = genButtons({
                    buttonsInitial: generatedMessageData.result.bot_messages[0].payload.buttons,
                });
                const buttons = buttonsObj.buttons;
                if (buttonsObj.quickReplies && buttonsObj.quickReplies.length > 0) {
                    quickReplies = quickReplies.concat(buttonsObj.quickReplies);
                }

                let emitTitle = generatedMessageData.result.bot_messages[0].payload.title || "";
                emitTitle += " ";
                emitTitle += generatedMessageData.result.bot_messages[0].payload.subtitle || "";
                if (emitTitle) {
                    emitTitle = await generateTextForInstagram(emitTitle, socket);
                    if (quickReplies?.length > 0) {
                        await emitTextMsgIg({
                            socket,
                            customText: emitTitle,
                            customQuickReply: quickReplies,
                        });
                    } else {
                        await emitTextMsgIg({ socket, customText: emitTitle });
                    }
                }

                const payload = {
                    url: generatedMessageData.result.bot_messages[0].payload.url,
                };

                if (payload.url) {
                    const options = {
                        id: socket.senderId.split("_")[0],
                        type: "video",
                        payload,
                    };
                    if (!_.isEmpty(quickReplies)) {
                        options.quick_replies = quickReplies;
                    }
                    if (IGAccessTokenMap[socket.senderId.split("_")[1]]) {
                        options.accessToken = IGAccessTokenMap[socket.senderId.split("_")[1]];
                    }

                    igBotClient.sendAttachment(options, (err, data) => {
                        if (err) {
                            handleAppError({ err });
                            return;
                        }
                        return resolve("done");
                    });
                } else {
                    return resolve("done");
                }
            } catch (err) {
                return reject(err);
            }
        });
    } catch (err) {
        console.log(`An error has occurred -- ${err}`);
    }
}

async function emitCarouselMsgIg({ socket, messageDoc, generatedMessageData }) {
    try {
        return new Promise(async (resolve, reject) => {
            try {
                if (!igBotClient) {
                    igBotClient = require("../app").igBotClient;
                }

                // send the text message
                let quickReplies = genQuickReplies({
                    quickRepliesInitial: generatedMessageData.result.bot_messages[0].quickReplies,
                });
                const buttonsObj = genButtons({
                    buttonsInitial: generatedMessageData.result.bot_messages[0].payload.buttons,
                });
                const buttons = buttonsObj.buttons;
                if (buttonsObj.quickReplies && buttonsObj.quickReplies.length > 0) {
                    quickReplies = quickReplies.concat(buttonsObj.quickReplies);
                }

                let emitTitle = generatedMessageData.result.bot_messages[0].payload.title || "";
                if (emitTitle?.length > 0) emitTitle += " ";
                emitTitle += generatedMessageData.result.bot_messages[0].payload.subtitle || "";
                if (emitTitle) {
                    emitTitle = await generateTextForInstagram(emitTitle, socket);
                    if (quickReplies?.length > 0) {
                        await emitTextMsgIg({
                            socket,
                            customText: emitTitle,
                            customQuickReply: quickReplies,
                        });
                    } else {
                        await emitTextMsgIg({ socket, customText: emitTitle });
                    }
                }

                const carouselOptions = generatedMessageData.result.bot_messages[0].payload.options;

                const carouselElements = [];
                for (let i = 0; i < carouselOptions.length; i++) {
                    const elem = carouselOptions[i];
                    const buttonsObj = genButtons({
                        buttonsInitial: elem.buttons,
                    });
                    const buttons = buttonsObj.buttons;
                    const element = {
                        title: elem.title || elem.subtitle,
                        image_url: elem.mediaUrl,
                        buttons,
                    };
                    if (elem.title) {
                        element.subtitle = elem.subtitle;
                    }
                    carouselElements.push(element);
                }

                const options = {
                    id: socket.senderId.split("_")[0],
                    elements: carouselElements,
                    // aspectRatio: IgBot.CONST.IMAGE_ASPECT_RATIO.SQUARE,
                    aspectRatio: IgBot.CONST.IMAGE_ASPECT_RATIO.HORIZONTAL,
                };
                if (IGAccessTokenMap[socket.senderId.split("_")[1]]) {
                    options.accessToken = IGAccessTokenMap[socket.senderId.split("_")[1]];
                }

                igBotClient.sendGeneric(options, (err, data) => {
                    if (err) {
                        handleAppError({ err });
                        return;
                    }
                    return resolve("done");
                });
            } catch (err) {
                // console.log(`An error has occurred -- ${err}`);
                return reject(err);
            }
        });
    } catch (err) {
        // console.log(`An error has occurred -- ${err}`);
    }
}

async function emitDefaultMessageIg({ socket, messageDoc, generatedMessageData }) {
    try {
        return new Promise((resolve, reject) => {
            if (!igBotClient) {
                igBotClient = require("../app").igBotClient;
            }

            const options = {
                id: socket.senderId.split("_")[0],
                text: "Sorry I didn't understand what you just said.",
            };
            if (IGAccessTokenMap[socket.senderId.split("_")[1]]) {
                options.accessToken = IGAccessTokenMap[socket.senderId.split("_")[1]];
            }

            igBotClient.sendText(options, (err, body) => {
                if (err) {
                    handleAppError({ err });
                    return;
                }
                // console.log('send generic cb:', err, body);
                return resolve("done");
            });
        });
    } catch (err) {
        // console.log(`An error has occurred -- ${err}`);
    }
}

function genQuickReplies({ quickRepliesInitial }) {
    if (!quickRepliesInitial || _.isEmpty(quickRepliesInitial)) {
        return [];
    }
    const quickReplies = [];
    for (let i = 0; i < quickRepliesInitial.length; i++) {
        const element = quickRepliesInitial[i];
        quickReplies.push(
            igBotClient.createQuickReply(
                element.title || element,
                JSON.stringify(
                    element.payload
                        ? JSON.parse(element.payload)
                        : {
                              type: "default",
                              payload: { query: element.title || element },
                          }
                )
            )
        );
    }
    return quickReplies;
}

function genButtons({ buttonsInitial, session_doc = null, socket, generatedMessageData }) {
    if (!buttonsInitial || _.isEmpty(buttonsInitial)) return {};

    let buttons = [];
    let linkButtonText = "";
    for (let i = 0; i < buttonsInitial.length; i++) {
        const element = buttonsInitial[i];
        if (element.type === "default") {
            buttons.push(
                igBotClient.createPostbackButton(
                    element.text,
                    JSON.stringify({
                        type: "default",
                        payload: { query: element.text },
                    })
                )
            );
        } else if (element.type === "link") {
            // link type buttons not allowed
            // buttons.push(igBotClient.createWebURLButton(element.text, element.url));
            // send link type button as text at the bottom
            let text = element?.text ?? "";
            let link = element?.url ?? "";
            linkButtonText += `<br> ${text} ➤ <br>${link}`;
        } else if (element.type === "customSocketEvent") {
            let payload = JSON.parse(JSON.stringify(element));
            buttons.push(
                igBotClient.createPostbackButton(
                    element.text,
                    JSON.stringify({
                        type: "customSocketEvent",
                        payload: { ...payload },
                    })
                )
            );
        } else if (element && !element.type) {
            buttons.push(
                igBotClient.createPostbackButton(
                    element,
                    JSON.stringify({
                        type: "default",
                        payload: { query: element },
                    })
                )
            );
        }
    }
    let limitedButtons = [];
    let quickReplies = [];
    const returnObj = {};
    if (
        buttons.length > 3 ||
        generatedMessageData?.result?.bot_messages?.[0]?.payload?.subtitle?.length > 80
    ) {
        if (
            generatedMessageData?.result?.bot_messages?.[0]?.payload
                ?.igButtonsToQuickReplyConversion ||
            generatedMessageData?.result?.bot_messages?.[0]?.payload?.subtitle?.length > 80
        ) {
            quickReplies = genQuickReplies({ quickRepliesInitial: buttons });
        } else {
            limitedButtons = buttons.splice(0, 3);
            quickReplies = genQuickReplies({ quickRepliesInitial: buttons });
        }
        buttons = limitedButtons;
        returnObj.quickReplies = quickReplies;
    }

    returnObj.buttons = buttons;
    returnObj.linkButtonText = linkButtonText;
    return returnObj;
}

async function generateTextForInstagram(textMessage, socket = null) {
    textMessage = textMessage.replace(new RegExp(" +", "g"), " ");
    textMessage = textMessage.replace(new RegExp("<b>", "g"), "*");
    textMessage = textMessage.replace(new RegExp("<em>", "g"), "_");
    textMessage = textMessage.replace(new RegExp("<strong>", "g"), "*");
    textMessage = textMessage.replace(new RegExp(`\n`, "g"), "");
    textMessage = textMessage.replace(new RegExp("<p><br></p>", "g"), `\n`);
    textMessage = textMessage.replace(new RegExp("<br>", "g"), `\n`);
    textMessage = textMessage.replace(new RegExp("</b>", "g"), `*`);
    textMessage = textMessage.replace(new RegExp("</strong>", "g"), "*");
    textMessage = textMessage.replace(new RegExp("</em>", "g"), "_");
    textMessage = textMessage.replace(new RegExp("<li>", "g"), `\n`);
    textMessage = textMessage.replace(new RegExp("</li>", "g"), ``);
    textMessage = textMessage.replace(new RegExp("&nbsp;", "g"), ` `);
    textMessage = textMessage.replace(new RegExp("&nbsp", "g"), ` `);
    textMessage = textMessage.replace(new RegExp("<u>", "g"), `\``);
    textMessage = textMessage.replace(new RegExp("</u>", "g"), `\``);
    textMessage = textMessage.replace(new RegExp("<ul>", "g"), ``);
    textMessage = textMessage.replace(new RegExp("unescapeHTML</ul>", "g"), `\n`);
    textMessage = unescapeHTML(textMessage);
    pTags = textMessage.match(new RegExp("<p.*?>"));
    if (pTags) {
        textMessage = textMessage.replace(new RegExp("<p.*?>", "g"), "");
        textMessage = textMessage.replace(new RegExp("</p>", "g"), `\n`);
    }
    return textMessage;
}

function unescapeHTML(str) {
    const htmlEntities = {
        nbsp: " ",
        cent: "¢",
        pound: "£",
        yen: "¥",
        euro: "€",
        copy: "©",
        reg: "®",
        lt: "<",
        gt: ">",
        quot: '"',
        amp: "&",
        apos: "'",
    };
    return str.replace(/\&([^;]+);/g, function (entity, entityCode) {
        let match;

        if (entityCode in htmlEntities) {
            return htmlEntities[entityCode];
        } else if ((match = entityCode.match(/^#x([\da-fA-F]+)$/))) {
            return String.fromCharCode(parseInt(match[1], 16));
        } else if ((match = entityCode.match(/^#(\d+)$/))) {
            return String.fromCharCode(~~match[1]);
        } else {
            return entity;
        }
    });
}

function splitString(inputString, maxLength) {
    const words = inputString.split(" ");
    let currentString = "";
    let resultArray = [];

    for (let i = 0; i < words.length; i++) {
        const word = words[i];

        if (currentString.length + word.length + 1 <= maxLength) {
            currentString += " " + word;
        } else {
            resultArray.push(currentString.trim());
            currentString = word;
        }
    }

    if (currentString !== "") {
        resultArray.push(currentString.trim());
    }

    return resultArray;
}

module.exports = {
    emitMsgToIgClient,
};
