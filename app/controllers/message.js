// const { sentence } = require("./searhWord");
// const { saveHistory } = require("./saveHistory");
// const { Client, MessageMedia } = require("whatsapp-web.js");

// exports.listenMessage = (client) => {
//   client.on("message", async msg => {
//     const { from, to, body } = msg;
//     const contact = await msg.getContact();
//     const chat = await msg.getChat();
//     let word = sentence(body);
//     console.log("formating: ", word);
//     // * Preguntas Frecuentes
//     switch (word) {
//       case "hola":
//         chat.sendMessage(`Hi @${contact.number}!`, {
//           mentions: [contact],
//         });
//         client.sendMessage(from,
//           `
//         *😈 Contact info 😈*
//         User name: ${contact.pushname}
//         Name: ${contact.name}
//         My number: ${contact.id.user}
//         Is Contact?: ${contact.isMyContact}
//     `);
//         break;
//       case "nombre":
//         sendMessage(from, `Bienvenido ${word}`);
//         break;
//       case "simon":
//         client.sendMessage(from, `Bienvenido!!! @${contact.pushname}`);
//         // sendMedia(from, "node.png");
//         break;
//     }
//     saveHistory(from, contact.pushname, word);
//     console.log(`${from} -> ${chalk.blue(body)}`);
//   });
// };
