const express = require("express");
const cors = require("cors");

const { sentence } = require("./app/controllers/searhWord");
const { saveHistory } = require("./app/controllers/saveHistory");
// const { listenMessage } = require("./app/controllers/message");

const fs = require("fs");

const ora = require("ora");
const chalk = require("chalk");

const { Client, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const app = express();

let client;
let sessionData;

// * EXPRESS
app.use(cors());
app.use(express.urlencoded({
  extended: true
}));

const sendWithApi = (req, res) => {
  const { message, to } = req.body;
  const newNumber = `${to}@c.us`;
  console.log(message, to);

  sendMessage(newNumber, message);

  res.send({
    status: "Enviado"
  });
};

app.post("/send", sendWithApi);

// * END EXPRESS
const SESSION_FILE_PATH = "./session.json";
const withSession = () => {
  //* Si existe, cargamos el archivo con las credenciales
  const spinner = ora(
    `Cargando ${chalk.yellow("Validando sessión con Whatsapp ...")}`
  );
  sessionData = require(SESSION_FILE_PATH);
  spinner.start();

  client = new Client({
    session: sessionData,
  });

  client.on("ready", (client) => {
    console.log("Client is ready!");
    spinner.stop();
    listenMessage();
  });

  client.on("auth_failure", () => {
    spinner.stop();
    console.log(
      "** Error de autentificación, vuelve a generar el QRCode (Borrar el archivo session.json) **"
    );
  });

  client.initialize();
};

// * Esta función GENERA EL QRCode
const withOutSession = () => {
  console.log("No tenemos sesión guardada");
  client = new Client();
  client.on("qr", (qr) => {
    console.log(qr);
    qrcode.generate(qr, {
      small: true,
    });
  });

  client.on("authenticated", (session) => {
    // * Guardamos credenciales de la sesión para usarlo luego
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
      if (err) console.log(err);
    });
    console.log("Sessión iniciada");
  });

  // * prueba
  client.on("message_revoke_everyone", async (after, before) => {
    // Fired whenever a message is deleted by anyone (including you)
    console.log("After: ", after); // message after it was deleted.
    if (before) {
      console.log("Before: ", before); // message before it was deleted.
    }
  });

  client.initialize();
};

// * Esta función se encarga de escuchar cada vez que un mensaje nuevo entra.

const listenMessage = () => {
  client.on("message", async (msg) => {
    const {
      from,
      to,
      body
    } = msg;
    const contact = await msg.getContact();
    const chat = await msg.getChat();
    let word = sentence(body);
    console.log("formating: ", word);
    // * Preguntas Frecuentes
    switch (word) {
      case "hola":
        chat.sendMessage(`Hi @${contact.number}!`, {
          mentions: [contact],
        });
        client.sendMessage(from,
          `
        *😈 Contact info 😈*
        User name: ${contact.pushname}
        Name: ${contact.name}
        My number: ${contact.id.user}
        Is Contact?: ${contact.isMyContact}
    `);
        break;
      case "nombre":
        sendMessage(from, `Bienvenido ${word}`);
        break;
      case "simon":
        client.sendMessage(from, `Bienvenido!!! @${contact.pushname}`);
        // sendMedia(from, "node.png");
        break;
    }
    saveHistory(from, contact.pushname, word);
    console.log(`${from} -> ${chalk.blue(body)}`);
  });
};

const sendMedia = (to, file) => {
  const mediaFile = MessageMedia.fromFilePath(`./app/mediaSend/${file}`);
  client.sendMessage(to, mediaFile);
};

const sendMessage = (to, message) => {
  client.sendMessage(to, message);
};

fs.existsSync(SESSION_FILE_PATH) ? withSession() : withOutSession();

app.listen(9000, () => {
  console.log("API está arriba en el puerto 9000");
});
