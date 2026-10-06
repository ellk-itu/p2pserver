import { ExpressPeerServer } from "peer";
import express, { json } from "express";
import Database from "better-sqlite3";
import cors from "cors";

// const key = readFileSync("./private.key").toString();
// const cert = readFileSync("./certificate.crt").toString();

const port = 6969;
const app = express();
const server = app.listen(port);
const peerServer = ExpressPeerServer(server, {
  allow_discovery: true,
});

app.use(json());
app.use(cors());
app.use("/peerjs", peerServer);

const db = new Database("server.db");

db.exec(
  `CREATE TABLE IF NOT EXISTS Hashes (
  Hash TEXT PRIMARY KEY,
  Username TEXT NOT NULL UNIQUE
);`,
);

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "This is the peer to peer server that i use" });
});

app.post("/addUser", (req, res) => {
  const getHash = db.prepare(`SELECT 1 FROM Hashes WHERE Hash = ? LIMIT 1`);
  const getUsername = db.prepare(
    "SELECT 1 FROM Hashes WHERE Username = ? LIMIT 1",
  );
  const setHash = db.prepare(`INSERT INTO Hashes VALUES (?, ?)`);

  const { id, username } = req.body;

  if (!!getHash.get(id) || !!getUsername.get(username)) {
    res.status(403).json({ message: "Username Already Exists" });
    return;
  }

  setHash.run(id, username);

  console.log("Added User", username);

  res.status(200).send();
  return;
});

app.post("/validate", (req, res) => {
  const getUsername = db.prepare(
    `SELECT Hash FROM Hashes WHERE Username = ? LIMIT 1`,
  );

  const { id, username } = req.body;
  const row = getUsername.get(username) as { Hash: string } | undefined;

  if (!row) {
    res.status(404).send();
  }

  if (row?.Hash !== id) {
    res.status(403).send();
  }

  res.status(200).send();
});

app.get("/getUser", (req, res) => {
  const { id, username } = req.query;
  const getId = db.prepare(
    `SELECT Hash FROM Hashes WHERE Username = ? LIMIT 1`,
  );
  const getUsername = db.prepare(
    `SELECT Username FROM Hashes WHERE Username = ? LIMIT 1`,
  );

  if (username) {
    const data = getId.get(username) as { Hash: string } | undefined;

    if (!data) {
      res.status(404).send();
      return;
    }

    res.status(200).json({ id: data.Hash });
    return;
  }

  if (id) {
    const data = getUsername.get(id) as { Username: string } | undefined;

    if (!data) {
      res.status(404).send();
      return;
    }

    res.status(200).json({ username: data.Username });
    return;
  }

  res.status(400).send();
});

server.on("listening", () => {
  console.log(`Server listening on port: ${port}`);
});

peerServer.on("error", (e) => {
  console.log("An Error Occured", e.message);
});

peerServer.on("connection", (client) => {
  console.log("Client connected:", client.getId());
});

peerServer.on("disconnect", (client) => {
  console.log("Client disconnected:", client.getId());
});
