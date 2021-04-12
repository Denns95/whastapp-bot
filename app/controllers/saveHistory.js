const fs = require("fs");

const exceljs = require("exceljs");
const moment = require("moment");

exports.saveHistory = (number, author, message) => {
  const pathChat = `./app/chats/${number}.xlsx`;
  const workbook = new exceljs.Workbook();
  const today = moment().format("DD-MM-YYYY hh:mm");

  if (fs.existsSync(pathChat)) {
    workbook.xlsx.readFile(pathChat).then(() => {
      const worksheet = workbook.getWorksheet(1);
      const lastRow = worksheet.lastRow;
      let getRowInsert = worksheet.getRow(++lastRow.number);
      getRowInsert.getCell("A").value = today;
      getRowInsert.getCell("B").value = author;
      getRowInsert.getCell("C").value = message;
      getRowInsert.commit();
      workbook.xlsx
        .writeFile(pathChat)
        .then(() => {
          console.log("Se agregó chat");
        })
        .catch((err) => {
          console.log("algo ocurrió al guardar: ", err);
        });
    });
  } else {
    const worksheet = workbook.addWorksheet("Chats");
    worksheet.columns = [{
      header: "Fecha",
      key: "date"
    }, {
      header: "Author",
      key: "author"
    }, {
      header: "Mensaje",
      key: "message"
    }, ];
    worksheet.addRow([today, author, message]);
    workbook.xlsx
      .writeFile(pathChat)
      .then(() => {
        console.log("Historial creado!!");
      })
      .catch((err) => {
        console.log("Algo falló! ->", err);
      });
    // * Se crea
  }
};
