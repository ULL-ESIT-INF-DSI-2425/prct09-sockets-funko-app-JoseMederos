import net from "net";
import { spawn } from "child_process";

type RequestType = {
  command: string;
  options?: string;
  filename?: string;
};

const server = net.createServer({ allowHalfOpen: true }, (socket) => {
  console.log("A client has connected.");

  let dataBuffer = "";
  socket.on("data", (data) => {
    dataBuffer += data.toString();
    const request: RequestType = JSON.parse(dataBuffer);
    let action;
    if (request.filename) {
      if (request.options) {
        action = spawn(request.command, [request.options, request.filename]);
      }
      action = spawn(request.command, [request.filename]);
    } else {
      action = spawn(request.command);
    }
    let actionOutput = "";
    action.stdout.on("data", (piece) => (actionOutput += piece));

    action.on("close", () => {
      socket.write(JSON.stringify(actionOutput), () => {
        socket.end();
      });
    });

    socket.write(actionOutput);
  });
  socket.on("end", () => {});

  socket.on("close", () => {
    console.log("A client has disconnected");
  });
});

server.listen(60300, () => {
  console.log("Waiting for clients to connect.");
});
