import * as net from "net";
import { performance } from "perf_hooks";

const TCP_PORT = process.env.TCP_PORT || 8080;
const HOST = process.env.HOST || "localhost";
const DELAY_MS = process.env.DELAY_MS || 50;
const CONNECTION_COUNT = process.env.CONNECTION_COUNT || 100;
const REQUEST_COUNT = process.env.REQUEST_COUNT || 10;

let failCount = 0;
let totalTime = 0;
let successCount = 0;
let totalRequests = 0;
let clientsCompleted = 0;

function printReport() {
  totalTime = performance.now() - totalTime;
  const successRate = ((successCount / totalRequests) * 100).toFixed(2);

  setTimeout(() => {
    console.log("=== TCP LOAD TEST REPORT ===");
    console.log("Total Requests:", totalRequests);
    console.log("Total Connections:", clientsCompleted);
    console.log("Successful Responses:", successCount);
    console.log("Success Rate:", `${successRate}%`);
    console.log("Errors:", failCount);
    console.log("Total Execution Time:", `${totalTime.toFixed(2)} ms`);
  }, 1000);
}

function done() {
  clientsCompleted++;
  if (clientsCompleted >= CONNECTION_COUNT) printReport();
}

function createClient() {
  let sent = 0;
  const client = new net.Socket();

  client.connect(TCP_PORT, HOST, () => {
    sendRequest();
  });

  client.on("data", () => {
    if (sent >= REQUEST_COUNT) {
      client.end();
      done();
      return;
    }

    successCount++;

    setTimeout(sendRequest, DELAY_MS);
  });

  client.on("error", () => {
    failCount++;
    done();
    client.end();
  });

  function sendRequest() {
    sent++;
    client.write("test");
    totalRequests++;
  }
}

totalTime = performance.now();
for (let i = 0; i < CONNECTION_COUNT; i++) {
  createClient();
}
