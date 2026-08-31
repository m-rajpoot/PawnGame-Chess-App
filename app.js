const express = require("express");
const socket  = require("socket.io")
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path")

const app = express();  // this will do routing and all
const server = http.createServer(app)    // connecting the server with express

const io = socket(server)
// socket helps to connect the server with the client in real time

const chess = new Chess(); // chess will be used to check the validity of the moves

let players = {};
let currentPlayer = "W";

app.set("view engine", "ejs"); // setting the view engine to ejs ,, enable us to use ejs files in the views folder

app.use(express.static(path.join(__dirname, "public"))); // this will serve the static files like css, js, images etc from the public folder

app.get("/", (req, res) => {  // this route will give index page
  res.render("index", {title: "Chess Game"});     
});

// this will define the socket connection and the events that will be emitted and received by the server and the client (means kiske liye kaunsa event hoga aur kya data bhejna hoga)
io.on("connection", function(uniqueSocket) {  // when a new user connects to the server (or enter same url or some connection id like in ludo room number), this function will be called and uniqueSocket will be the socket of that user
    console.log("New user connected: " + uniqueSocket.id);

    // uniqueSocket.on("Connection", function() {  // when the user connects, this function will be called
         //console.log("User connected");
    //     io.emit("Message sent");  // this will send a message to all the connected users that a new user has connected, and can be seen in frontend console of browser
    // });
    // uniqueSocket.on("disconnect", function() {  // when the user disconnects, this function will be called
    //     console.log("User disconnected: " + uniqueSocket.id);
    // });

    if(!players.white){
        players.white = uniqueSocket.id;
        uniqueSocket.emit("playerRole", "w");
    }
    else if(!players.black){
        players.black = uniqueSocket.id;
        uniqueSocket.emit("playerRole", "b");
    }
    else{
        uniqueSocket.emit("playerRole", "spectator");
    }

    uniqueSocket.on("disconnect", function() {  // when the user disconnects, this function will be called
        
        //console.log("User disconnected: " + uniqueSocket.id);
        if(uniqueSocket.id === players.white){
            delete players.white;
        }
        if(uniqueSocket.id === players.black){
            delete players.black;
        }
    })

    // check if the move is valid or not and if valid then emit the move to the other player
    uniqueSocket.on("move", function(move) {
        try{
            // white ke time white and black ke time black hi chal payega
            if ((chess.turn() === "w" && uniqueSocket.id !== players.white) ||
                (chess.turn() === "b" && uniqueSocket.id !== players.black)
            ) {
                return;
            } // if the player is not the current player, then return

            const result  = chess.move(move);  // this will check if the move is valid or not and if valid then make the move and return the move object else return null
            if(result){
                currentPlayer  = chess.turn();
                io.emit("move", move);  // this will emit the move to all the connected users
            }
            else{
                console.log("Invalid move");
                uniqueSocket.emit("invalidMove", move);  // this will emit the invalid move to the player who made the move
            }

        }
        catch(err){
            console.error("Error occurred while processing move:", err);
            uniqueSocket.emit("error", "An error occurred while processing your move. Please try again.");  // emit an error message to the player who made the move
        }

        
    })
});


server.listen(3000,()=> {
    console.log("Server is running at port 3000");
})







/*
 server.listen(3000,  ()=>{})
`                  this () => is callback function which will be called when the server is running or not

set socket on both frontend and backend to send (or reflect changes) the data from one to another
*/