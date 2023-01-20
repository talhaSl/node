"use strict";
const fs = require("fs");
const http = require("http");
const { json } = require("stream/consumers");
const { isContext } = require("vm");
const url = require("url");
const slugify = require("slugify");
const replaceTemp = require("./module/replaceTemplate");

///////////////////////////////////
////////////////////////////
///////////////////
/////////// For File

/*
const read = fs.readFileSync("./read.txt");

console.log(`my love ${read}`);

const write = `I have to go with you ${read} at : time ${Date.now()}`;
const writeL = fs.writeFileSync("./write.txt", write);

console.log(writeL);

fs.readFile(`./read.txt`, "utf-8", (err, data1) => {
  if (err) return console.log("Error 💥💥💥");
  fs.readFile(`./i-love-you.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile(`./router.txt`, "utf-8", (err, data3) => {
      console.log(data3);

      fs.writeFile("./get.txt", `${data2} ${data3}`, `utf-8`, (err) => {
        console.log("your file has been read");
      });
    });
  });
});

*/
///////////////////////////////////
////////////////////////////
///////////////////
/////////// For Server
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateCards = fs.readFileSync(
  `${__dirname}/templates/template-cards.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataApi = JSON.parse(data);
console.log(
  slugify("TalhaSuleman", { lower: true, replacement: "trtrtg", trim: true })
);
// Save this create server results into a variable
const server = http.createServer((req, res) => {
  //   console.log("I have a request");

  const { query, pathname } = url.parse(req.url, true);
  //overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataApi
      .map((el) => replaceTemp(templateCards, el))
      .join("");
    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    // console.log(cardsHtml);

    res.end(output);
    // product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    // console.log(query.id);
    const product = dataApi[query.id];
    const output = replaceTemp(templateProduct, product);
    res.end(output);

    // api page
  } else if (pathname === "/data") {
    res.writeHead(200, { "Content-type": "Application/json" });
    res.end(data);
  } else {
    // not found page
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Did not have site on this url</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is now start working......");
});
