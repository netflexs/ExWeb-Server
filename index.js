const express = require("express");
const Clui = require("clui");
const app = express();
const fs = require('fs');
const phpExpress = require("php-express")(express);
const prompt = require('prompt-sync')();

const port = prompt("PORT : ")


console.clear();

const Spinner = Clui.Spinner;
const directory = './public';

app.use((req, res, next) => {
    app.set("views", "./public");
    app.engine("php", phpExpress.engine);
    app.set("view engine", "php");

    app.all(/.+\.php$/, phpExpress.router);

    app.use(express.static("public"));
    app.use((req, res, next) => {
        res.status(404).send("Sorry, that route does not exist. Please try again.");
    });
    res.on("finish", () => {
        const status = res.statusCode;
        const sent = res.get("Content-Length") || 0;
        const received = req.socket.bytesRead;
        const spinner = new Clui.Spinner(`${req.method} ${req.url}`);
        spinner.start();
        console.log(`
  ${req.method} ${req.url}
  Sent: ${sent} bytes   Received: ${received} bytes
  Status: ${status}        Time: ${new Date().toISOString()}
    `);
        spinner.stop();
    });
    next();
});

const spinner = new Spinner('Monitoring changes...');
spinner.start();

fs.watch(directory, (eventType, filename) => {
    console.log(`
    Event type is: ${eventType}`);
    if (filename) {
      console.log(`File changed: ${filename} \n`);
    } else {
      console.log('filename not provided');
    }
    spinner.start();
  });


app.listen(port, () => {
    console.log(`
    Made By NetFlexs
Made With Express And PHP
Starting Server at ${port}
    `);
});
