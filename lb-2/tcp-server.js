import * as net from "net";
import readline from "readline";

const TCP_PORT = process.env.TCP_PORT || 8080;
const SURNAME = process.env.SURNAME || "Nikora";
const DEFAULT_NAME = process.env.DEFAULT_NAME || "Anonymous";

const isValidName = (name) => /^[a-zA-ZА-Яа-я]+$/.test(name);

const server = net.createServer((socket) => {
  console.log("TCP Client connected");

  socket.on("data", (data) => {
    const clientName = data.toString().trim();

    if (!clientName || clientName == "\x00") {
      socket.write(`Default: ${DEFAULT_NAME}`);
      return;
    }
    if (!isValidName(clientName)) {
      socket.write("Error: Invalid name. Only letters are allowed.");
      return;
    }

    const fullName = `${clientName} ${SURNAME}`;
    socket.write(`Full name: ${fullName}`);
  });

  socket.on("error", (error) => {
    console.error(`TCP Client error: ${error.message}`);
  });

  socket.on("end", () => {
    console.log("TCP Client disconnected");
  });
});

server.on("error", (error) => {
  console.error(`TCP Server error: ${error.message}`);
});

server.on("close", () => {
  console.log("TCP Server closed");
  process.exit();
});

server.listen(TCP_PORT, () => {
  console.log(`TCP Server started on port ${TCP_PORT}`);
});

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on("keypress", (_, key) => {
  if (key && key.name == "q") {
    server.close();
  }
});
