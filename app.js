const http = require("http");
const fs = require("fs");

const MESSAGES_FILE = "messages.txt";

const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    //read all the messages from the file first
    fs.readFile(MESSAGES_FILE, (err, data) => {
      let messages = [];

      if (!err) {
        messages = data
          .toString()
          .split("\n")
          .filter((message) => message.trim() !== "");
      }

      //newest message on the top
      const messagesHtml = messages
        .reverse()
        .map((message) => `<li>${message}</li>`)
        .join("");

      res.setHeader("Content-Type", "text/html");
      res.write(`
        <html>
          <head><title>Node.js Practise Task 2</title></head>
          <body>
            <h2>Messages</h2>
            <ul>${messagesHtml}</ul>

            <form action="/message" method="POST">
              <label>Message:</label>
              <input type="text" name="message" />
              <button type="submit">Send</button>
            </form>
          </body>
        </html>`);
      res.end();
    });
    return;
  }

  if (req.url === "/message" && req.method === "POST") {
    const body = [];

    req.on("data", (chunks) => {
      body.push(chunks);
    });

    req.on("end", () => {
      const buffer = Buffer.concat(body);
      const formData = buffer.toString();

      //message=hello+world -> hello world
      const rawValue = formData.split("=")[1] || "";
      const message = decodeURIComponent(rawValue.replace(/\+/g, " ")).trim();

      if (message === "") {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      }

      //append so the older messages are not lost
      fs.appendFile(MESSAGES_FILE, message + "\n", (err) => {
        if (err) {
          res.statusCode = 500;
          return res.end("Could not write the file");
        }

        res.statusCode = 302; //redirected
        res.setHeader("Location", "/");
        res.end();
      });
    });
    return;
  }

  res.statusCode = 404;
  res.end("<h1>Page not found</h1>");
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
