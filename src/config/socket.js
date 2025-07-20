import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  // VITAL ROLE
  io = new Server(server, {
    cors: {
      origin: "*",
      method: ["GET", "POST"],
    },
  });
  //cors

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("join", (userId) => socket.join(userId));

    socket.on("disconnected", console.log("🔴 User disconnected: ", socket.id));
  });

  return io;
};
export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");

  return io;
};
