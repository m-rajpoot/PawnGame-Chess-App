# ♟️ PawnGame — Real-Time Multiplayer Chess

PawnGame is a real-time multiplayer chess application built to understand and implement **client-server communication, Socket.IO, WebSockets, event-driven architecture, and server-side game validation**.

The project allows two players to play chess in real time. The first connected player is assigned **White**, the second **Black**, and additional users can join as **spectators**.

The main learning objective of this project is not only to build a chess game, but to understand **how real-time applications work internally**.

---

# 🚀 Features

- ♟️ Real-time multiplayer chess
- 👤 Automatic player-role assignment
- ⚪ First connected player → White
- ⚫ Second connected player → Black
- 👀 Additional connected users → Spectators
- 🔌 Real-time communication using Socket.IO
- 🖱️ Drag-and-drop chess pieces
- ✅ Chess move validation using Chess.js
- 🔄 Real-time board synchronization
- 🔐 Server-side turn validation
- 🔌 Unique socket ID for every connected client
- 🔄 Automatic board re-rendering after moves
- 🎭 White/Black board orientation support
- 🌐 Express server with EJS frontend

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Backend runtime |
| **Express.js** | Web server and routing |
| **Socket.IO** | Real-time client-server communication |
| **Chess.js** | Chess rules and move validation |
| **EJS** | Server-side HTML rendering |
| **HTML/CSS** | Frontend structure and styling |
| **Tailwind CSS** | Utility-based styling |

---

# 📂 Project Structure

```text
PawnGame/
│
├── app.js
├── package.json
├── package-lock.json
├── .gitignore
│
├── public/
│   ├── css/
│   │
│   └── js/
│       └── chessgame.js
│
└── views/
    └── index.ejs