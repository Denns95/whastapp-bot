const express = require('express');
const cors = require('cors');

const { sentence } = require('./searhWord')

const fs = require('fs');

const ora = require('ora')
const chalk = require('chalk');
const exceljs = require('exceljs')
const moment = require('moment')

const { Client, MessageMedia } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const app = express()

let client
let sessionData

// * EXPRESS
app.use(cors())
app.use(express.urlencoded({ extended: true }))

const sendWithApi = (req, res) => {
  const { message, to } = req.body
  const newNumber = `${to}@c.us`
  console.log(message, to)

  sendMessage(newNumber, message)

  res.send({ status: 'Enviado' })
}

app.post('/send', sendWithApi)

// * END EXPRESS
const SESSION_FILE_PATH = './session.json'
const withSession = () => {
  //* Si existe, cargamos el archivo con las credenciales
  const spinner = ora(`Cargando ${chalk.yellow('Validando sessión con Whatsapp ...')}`)
  sessionData = require(SESSION_FILE_PATH)
  spinner.start()

  client = new Client({
    session: sessionData
  })

  client.on('ready', () => {
    console.log('Client is ready!')
    spinner.stop()
    listenMessage()
  })

  client.on('auth_failure', () => {
    spinner.stop()
    console.log('** Error de autentificación, vuelve a generar el QRCode (Borrar el archivo session.json) **')
  })

  client.initialize()
}

// * Esta función GENERA EL QRCode
const withOutSession = () => {

  console.log('No tenemos sesión guardada')
  client = new Client()
  client.on('qr', qr => {
    console.log(qr)
    qrcode.generate(qr, {
      small: true
    })
  })

  client.on('authenticated', (session) => {
    // * Guardamos credenciales de la sesión para usarlo luego
    sessionData = session
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), err => {
      if (err) console.log(err)
    })
    console.log('Sessión iniciada')
  })
  client.initialize()
}

// * Esta función se encarga de escuchar cada vez que un mensaje nuevo entra.

const listenMessage = () => {
  client.on('message', (msg) => {
    const { from, to, body } = msg
    let word = sentence(body)
    console.log('formating: ', word)
    // * Preguntas Frecuentes
    switch (word) {
      case 'hola':
        sendMessage(from, 'Hola!!')
        sendMessage(from, '¿Cuál es tu nombre?')
        break;
      case 'nombre':
        sendMessage(from, `Bienvenido ${word}`)
        break;
      case 'simon':
        sendMessage(from, 'Bienvenido!!!')
        sendMedia(from, 'node.png')
        break
    }
    saveHistory(from, body)
    console.log(`${chalk.yellow(body)}`)
  })
}

const sendMedia = (to, file) => {
  const mediaFile = MessageMedia.fromFilePath(`./mediaSend/${file}`)
  client.sendMessage(to, mediaFile)
}

const sendMessage = (to, message) => {
  client.sendMessage(to, message)
}

const saveHistory = (number, message) => {
  const pathChat = `./chats/${number}.xlsx`
  const workbook = new exceljs.Workbook()
  const today = moment().format('DD-MM-YYYY hh:mm')

  if (fs.existsSync(pathChat)) {
    workbook.xlsx.readFile(pathChat)
      .then(() => {
        const worksheet = workbook.getWorksheet(1)
        const lastRow = worksheet.lastRow
        let getRowInsert = worksheet.getRow(++(lastRow.number))
        getRowInsert.getCell('A').value = today
        getRowInsert.getCell('B').value = message
        getRowInsert.commit()
        workbook.xlsx.writeFile(pathChat)
          .then(() => {
            console.log('Se agregó chat')
          })
          .catch((err) => {
            console.log('algo ocurrió al guardar: ', err)
          })
      })
  } else {
    const worksheet = workbook.addWorksheet('Chats')
    worksheet.columns = [
      { header: 'Fecha', key: 'date' },
      { header: 'Mensaje', key: 'message' }
    ]
    worksheet.addRow([today, message])
    workbook.xlsx.writeFile(pathChat)
      .then(() => {
        console.log('Historial creado!!')
      })
      .catch((err) => {
        console.log('Algo falló! ->', err)
      })
    // * Se crea

  }
}

(fs.existsSync(SESSION_FILE_PATH)) ? withSession(): withOutSession()

app.listen(9000, () => {
  console.log('API está arriba en el puerto 9000')
})
