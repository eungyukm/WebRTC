import http from "http";
import Wesocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Lisening on htttp://localhost:3000`);
const server = http.createServer(app);
const wss = new Wesocket.Server({ server});

const sockets = [];

wss.on("connection", (socket)=> {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser");
    socket.on("close", ()=> console.log("Disconnected from the Browsr"));
    socket.on("message", (msg)=> {
        const message = JSON.parse(msg);

        switch(message.type)
        {
            case "new_message":
                {
                    sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
                }
                break;
            case "nicname":
                {
                    socket["nickname"] = message.payload;
                }
        }

    });
});

server.listen(3000, handleListen);


