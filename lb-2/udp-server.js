import * as dgram from "dgram";
import readline from "readline";

const UDP_PORT = process.env.UDP_PORT || 9000;
const SURNAME = process.env.SURNAME || "Nikora";
const DEFAULT_NAME = process.env.DEFAULT_NAME || "Anonymous";

const isValidName = (name) => /^[a-zA-ZА-Яа-я]+$/.test(name);

const server = dgram.createSocket("udp4", (msg, rinfo) => {
  const clientName = msg.toString().trim();
  const fullName = `${clientName} ${SURNAME}`;

  if (!clientName) {
    console.log("Client name not provided. Sending default name");
    server.send(`Default: ${DEFAULT_NAME}`, rinfo.port, rinfo.address);
    return;
  }
  if (!isValidName(clientName)) {
    console.error(`Invalid input from UDP client: ${clientName}`);
    server.send(
      "Error: Invalid name. Only letters are allowed.",
      rinfo.port,
      rinfo.address
    );
    return;
  }

  console.log(`Received: ${clientName}. Sending: ${fullName}`);
  server.send(`Full name: ${fullName}`, rinfo.port, rinfo.address);
});

server.on("error", (error) => {
  console.error(`UDP Server error: ${error.message}`);
});

server.on("close", () => {
  console.log("UDP Server closed");
  process.exit();
});

server.bind(UDP_PORT, () => {
  console.log(`UDP Server started on port ${UDP_PORT}`);
});

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on("keypress", (_, key) => {
  if (key && key.name == "q") {
    server.close();
  }
});
