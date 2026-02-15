import express from 'express'
import mongoose from 'mongoose'
import http from "http";
import { Server } from "socket.io";
import cors from 'cors'
import dotenv from 'dotenv'
import {Poll} from './models/pollModel.js'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

async function main(){
  await mongoose.connect(`${process.env.MONGO_URI}/pollRoom`)
}

main()
  .then(()=>{
    console.log('DB is connected');
  })
  .catch(err=>{
    console.log("DB didn't connect successfully");
  })


const server = http.createServer(app);
const io = new Server(server,{
  cors:{origin:"*"}
});

io.on("connection", (socket) => {
  socket.on("joinPoll", (pollId)=>{
    socket.join(pollId);
  });
});

// POST: create poll api
app.post("/api/poll", async (req, res) => {
  const { question, options } = req.body;

  if (!question || options.length < 2) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const formattedOptions = options.map(opt => ({
    text: opt,
    votes: 0
  }));

  const poll = await Poll.create({
    question,
    options: formattedOptions
  });

  res.json({ pollId: poll._id });
});

// GET: get poll api
app.get("/api/poll/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Not found" });
    res.json(poll);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// POST: vote api
app.post("/api/poll/:id/vote", async (req, res) => {
  const { optionIndex } = req.body;
  const pollId = req.params.id;
  const userIP = req.ip;

  const poll = await Poll.findById(pollId);
  if (!poll) return res.status(404).json({ message: "Not found" });

  if (poll.voters.includes(userIP)) {
    return res.status(403).json({ message: "Already voted" });
  }

  if (!poll.options[optionIndex]) {
    return res.status(400).json({ message: "Invalid option" });
  }

  poll.options[optionIndex].votes += 1;
  poll.voters.push(userIP);

  await poll.save();

  io.to(pollId).emit("voteUpdate", poll);

  res.json(poll);
});



server.listen(PORT, ()=>{
  console.log(`app is listening to port: ${PORT}`);
});