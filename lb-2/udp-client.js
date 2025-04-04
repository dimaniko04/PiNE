import * as dgram from "dgram";
import readline from "readline";

const UDP_PORT = process.env.UDP_PORT || 9000;
const HOST = process.env.HOST || "localhost";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = dgram.createSocket("udp4");

function askName() {
  rl.question("Enter name (or /q to quit): ", (input) => {
    if (input === "/q") {
      client.close();
      rl.close();
      return;
    }

    client.send(input, UDP_PORT, HOST, (error) => {
      if (error) {
        console.error(`UDP Client error: ${error.message}`);
      }
    });
  });
}

client.on("message", (msg) => {
  console.log(msg.toString());
  askName();
});

client.on("error", (err) => {
  console.error("UDP Client Error:", err.message);
});

client.on("close", () => {
  console.log("TCP Client closed");
  rl.close();
});

askName();
