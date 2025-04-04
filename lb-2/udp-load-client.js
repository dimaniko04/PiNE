import * as dgram from "dgram";
import { performance } from "perf_hooks";

const UDP_PORT = process.env.UDP_PORT || 9000;
const HOST = process.env.HOST || "localhost";
const CONNECTION_COUNT = process.env.CONNECTION_COUNT || 100;
const REQUEST_COUNT = process.env.REQUEST_COUNT || 10;

const delay = (CONNECTION_COUNT / 1000) * (REQUEST_COUNT / 5);

let failCount = 0;
let totalTime = 0;
let successCount = 0;
let totalRequests = 0;
let clientsCompleted = 0;

function printReport() {
  totalTime = performance.now() - totalTime;
  const successRate = ((successCount / totalRequests) * 100).toFixed(2);

  console.log("=== UDP LOAD TEST REPORT ===");
  console.log("Total Requests:", totalRequests);
  console.log("Total Connections:", clientsCompleted);
  console.log("Successful Responses:", successCount);
  console.log("Success Rate:", `${successRate}%`);
  console.log("Errors:", failCount);
  console.log("Total Execution Time:", `${totalTime.toFixed(2)} ms`);
}

function done() {
  clientsCompleted++;
  if (clientsCompleted >= CONNECTION_COUNT) printReport();
}

function createClient() {
  let sent = 0;
  const client = dgram.createSocket("udp4");

  client.on("message", () => {
    successCount++;
  });

  client.on("error", () => {
    failCount++;
  });

  function sendRequest() {
    if (sent >= REQUEST_COUNT) {
      client.close();
      done();
      return;
    }

    sent++;
    client.send("test", UDP_PORT, HOST);
    totalRequests++;
    setTimeout(sendRequest, delay);
  }

  sendRequest();
}

totalTime = performance.now();
for (let i = 0; i < CONNECTION_COUNT; i++) {
  createClient();
}
