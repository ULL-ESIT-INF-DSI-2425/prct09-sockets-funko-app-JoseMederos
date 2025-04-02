import net from "net";
import { FunkoModel, FunkoType, FunkoGenre } from "./funko.js";
import { Collection } from "./collection.js";
import { User } from "./user.js";
import { RequestType, ResponseType } from "./types.js";

/**
 * This function creates a server that listens for incoming connections on port 60300.
 * Also handles incoming requests from clients and processes them using the FunkoManager class.
 * It handles requests to add, remove, update, show, and list Funkos.
 * The server responds to the client with the result of the operation.
 */
const server = net.createServer({ allowHalfOpen: true }, (socket) => {
  console.log("Client connected");

  let dataBuffer = "";
  socket.on("data", (data) => {
    dataBuffer += data.toString();
  });
  socket.on("end", () => {
    try {
      const request: RequestType = JSON.parse(dataBuffer);
      const user = new User(request.user, new Collection());
      let response: ResponseType = {
        type: "error",
        success: false,
        message: "Uninitialized response",
      };
      switch (request.type) {
        case "add":
          console.log("Handling 'add' request");
          if (request.funko) {
            user.loadCollection();
            const funko = new FunkoModel(
              request.funko.name,
              request.funko.description,
              request.funko.type as FunkoType,
              request.funko.genre as FunkoGenre,
              request.funko.franchise,
              request.funko.number,
              request.funko.exclusive,
              request.funko.market_value
            );
            const success : boolean = user.addFunkoToCollection(funko);
            user.saveCollection();
            if (success) {
              response = {
                type: "add",
                success: true,
                message: `Funko ${funko.name} added successfully`,
              };
            } else {
              response = {
                type: "add",
                success: false,
                message: `Funko ${funko.name} already exists`,
              };
            }
            socket.write(JSON.stringify(response), () => {
              socket.end();
            }
            );
          }
          break;
        case "remove":
          console.log("Handling 'remove' request");
          if (request.id) {
            user.loadCollection();
            user.collection.removeFunko(request.id.toString(), user, (success) => {
              if (success) {
                response = {
                  type: "remove",
                  success: true,
                  message: `Funko with ID ${request.id} removed successfully`,
                };
              } else {
                response = {
                  type: "remove",
                  success: false,
                  message: `Funko with ID ${request.id} not found`,
                };
              }
            });
            user.saveCollection();
            socket.write(JSON.stringify(response), () => {
              socket.end();
            });
          }
          break;
        case "update":
          console.log("Handling 'update' request");
          if (request.funko && request.id) {
            user.loadCollection();
            const funko = new FunkoModel(
              request.funko.name,
              request.funko.description,
              request.funko.type as FunkoType,
              request.funko.genre as FunkoGenre,
              request.funko.franchise,
              request.funko.number,
              request.funko.exclusive,
              request.funko.market_value
            );
            const success = user.collection.updateFunko(request.id, funko);
            user.saveCollection();
            if (success) {
              response = {
                type: "update",
                success: true,
                message: `Funko with ID ${request.id} updated successfully`,
              };
            } else {
              response = {
                type: "update",
                success: false,
                message: `Funko with ID ${request.id} not found`,
              };
            }
          }
          break;
        case "show":
          console.log("Handling 'show' request");
          if (request.id) {
            user.loadCollection();
            const funko = user.collection.getFunkoById(request.id);
            if (funko) {
              response = {
                type: "show",
                success: true,
                message: `Funko with ID ${request.id} found`,
                funko,
              };
            } else {
              response = {
                type: "show",
                success: false,
                message: `Funko with ID ${request.id} not found`,
              };
            }
          }
          break;
        case "list": {
          console.log("Handling 'list' request");
          user.loadCollection();
          const funkos = user.collection.getFunkos();
          if (funkos.length > 0) {
            response = {
              type: "list",
              success: true,
              message: `Funkos found`,
              funkoPops: funkos.map((funko) => funko.toJSON()),
            };
          } else {
            response = {
              type: "list",
              success: false,
              message: `No Funkos found`,
            };
          }
          break;
        }
        default:
          response = {
            type: "error",
            success: false,
            message: "Invalid request type",
          };
          socket.write(JSON.stringify(response), () => {
            socket.end();
          });
          break;
      }
    } catch (error) {
      console.error("Error parsing request:", error);
      const response: ResponseType = {
        type: "error",
        success: false,
        message: "Invalid JSON format",
      };
      socket.write(JSON.stringify(response), () => {
        socket.end();
      });
    }
  });
  socket.on("end", () => {
    console.log("Client disconnected");
  });
  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});
/**
 * This function wait for a connection from a client.
 */
server.listen(60300, () => {
  console.log("Server listening on port 60300");
});