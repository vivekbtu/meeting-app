import * as store from "./store.js";
import * as ui from "./ui.js";
import * as webRTCHandler from "./webRTCHandler.js";
import * as constants from "./constants.js";

let socketIO = null;

export const registerSocketEvents = (socket) => {
  socketIO = socket;

  //////////////////////////////////////
  socket.on("your_uuid", (data) => {

    const socketId = data.id;
    console.log(socketId);
    
    store.setSocketId(socketId);
    
    console.log("Received UUID:", socketId);
    ui.updatePersonalCode(socketId);
  });
  /////////////////////////////////////

  // socket.on("connect", () => {
  // // const socketId = '1234567890';
  //   const socketId = socket.id;

  //   console.log("succesfully connected to socket.io server");
  //   store.setSocketId(socketId);
  //   ui.updatePersonalCode(socketId);
  // });

  socket.on("pre-offer", (data) => {
    console.log('pre-offer-wss',data)
    webRTCHandler.handlePreOffer(data);
  });

  socket.on("pre-offer-answer", (data) => {
    webRTCHandler.handlePreOfferAnswer(data);
  });

  socket.on("webRTC-signaling", (data) => {

    // console.log('webRTC-wss', data);

    switch (data.type) {
      case constants.webRTCSignaling.OFFER:
        webRTCHandler.handleWebRTCOffer(data);
        break;
      case constants.webRTCSignaling.ANSWER:
        webRTCHandler.handleWebRTCAnswer(data);
        break;
      case constants.webRTCSignaling.ICE_CANDIDATE:
        webRTCHandler.handleWebRTCCandidate(data);
        break;
      default:
        return;
    }
  });
};

export const sendPreOffer = (data) => {
  console.log("emmiting to server pre offer event");
  socketIO.emit("pre-offer", data);
};

export const sendPreOfferAnswer = (data) => {
  socketIO.emit("pre-offer-answer", data);
};

export const sendDataUsingWebRTCSignaling = (data) => {
  socketIO.emit("webRTC-signaling", data);
};
