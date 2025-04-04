import * as net from "net";
import readline from "readline";

const TCP_PORT = process.env.TCP_PORT || 8080;
const HOST = process.env.HOST || "localhost";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = new net.Socket();

function askName() {
  rl.question("Enter name (or /q to quit): ", (input) => {
    if (input === "/q") {
      client.end();
      rl.close();
      return;
    }

    client.write(input || "\x00");
  });
}

client.connect(TCP_PORT, HOST, async () => {
  console.log("Connected to TCP server");
  askName();
});

client.on("data", (data) => {
  console.log(data.toString());
  askName();
});

client.on("error", (err) => {
  console.error("TCP Client Error:", err.message);
  askName();
});

client.on("close", () => {
  console.log("TCP Client closed");
  rl.close();
});
