// alert("Chess game initialized!");   alert popup will be shown when the page is loaded

const socket = io();  // this will connect the client with the server in real time -> this is the client side socket which will connect with the server side socket in app.js

/*

socket.emit("Connection");  // this send a message to the server that the client is connected and the server will listen to this message in app.js and will print "User connected" in the console
socket.on("Message sent", function(){
    console.log("Message received");  // this will listen to the message from the server and will print "Message sent" in the console
});  // this will listen to the message from the server and will print "Message sent" in the console

*/
const chess = new Chess();  // this will create a new chess game and will be used to check the validity of the moves
const boardElement = document.querySelector(".chessboard");  // this will select the chessboard element from the html file

// create drav and move chess pieces on the chessboard using chess.js library and socket.io library
let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;  // this will store the role of the player (white or black or spectator)

const renderBoard = () => {   // Chess.js knows where all the pieces are → renderBoard() takes that information and creates the visual chessboard in HTML.
    const board = chess.board();  // this will get the current state of the chessboard as a 2D array
    boardElement.innerHTML = "";  // this will clear the chessboard before rendering the new state of the chessboard
    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            //console.log(square, rowIndex, squareIndex);
            const squareElement = document.createElement("div");  // this will create a new div element for each square of the chessboard
            squareElement.classList.add("square",
                (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark");  // this will add the class "white" or "black" to the square element based on the row and column index of the square
            
            squareElement.dataset.row = rowIndex;  // this will set the data-row attribute of the square element to the row index of the square
            squareElement.dataset.col = squareIndex;  // this will set the data-col attribute of the square element to the column index of the square
            
            if(square){
                const pieceElement = document.createElement("div");
                pieceElement.classList.add("piece",
                    square.color === "w" ? "white" : "black" // this will add the class "white" or "black" to the piece element based on the color of the piece
                );  // this will add the class "piece" to the piece element
                
                pieceElement.innerText = getPieceUnicode(square);

                pieceElement.draggable = playerRole === square.color;  // this will make the piece draggable only if the player is playing as that color

                pieceElement.addEventListener("dragstart", (e) => {
                    if(pieceElement.draggable){
                        draggedPiece = pieceElement;

                        sourceSquare = { row: rowIndex, col: squareIndex };  // this will store the source square of the dragged piece
                        e.dataTransfer.setData("text/plain", "");
                    } 
                })

                pieceElement.addEventListener("dragend", (e) => {
                    draggedPiece = null;
                    sourceSquare = null;
                })

                squareElement.appendChild(pieceElement);
                
            }

            squareElement.addEventListener("dragover", function(e) {
                e.preventDefault();  // this will allow the drop event to be fired
            });
            squareElement.addEventListener("drop", function(e)  {
                e.preventDefault();
                if(draggedPiece){
                    const targetSource = {
                        row : parseInt(squareElement.dataset.row),  // this will get the row index of the target square
                        col : parseInt(squareElement.dataset.col)   // this will get the column index of the target square
                    };

                    handleMove(sourceSquare, targetSource);  // this will handle the move of the piece from the source square to the target square
                }
            });
            boardElement.appendChild(squareElement)

            
        });
        
    });

    if(playerRole === "b"){
        boardElement.classList.add("flipped");
    }
    else{
        boardElement.classList.remove("flipped");
    }

}

const handleMove = (source, target) => { 
    const move = {
        from : `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to : `${String.fromCharCode(97 + target.col)}${8 - target.row}` ,
        //promotion : 'q',  // for now this is by default to queen
    }
    socket.emit("move" , move);
}

const getPieceUnicode = (piece) => {
    const unicodePieces = {
        w: {
            p: "♙︎",
            r: "♖︎",
            n: "♘︎",
            b: "♗︎",
            q: "♕︎",
            k: "♔︎"
        },
        b: {
            p: "♟︎",
            r: "♜︎",
            n: "♞︎",
            b: "♝︎",
            q: "♛︎",
            k: "♚︎"
        }
    };

    return unicodePieces[piece.color][piece.type];
};

socket.on("playerRole" , function(role){
    playerRole =  role;
    renderBoard();
})

socket.on("spectatorRole" , function(){
    playerRole  =null;
    renderBoard();
})

socket.on("boardState" , function(fen) {
    chess.load(fen);
    renderBoard();
})

socket.on("move" , function(move) {
    chess.move(move);
    renderBoard();
})

renderBoard();