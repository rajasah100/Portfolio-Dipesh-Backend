import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  const { name, email, subject, body } = req.body;

  if (!name || !email || !body) {
    return res.status(400).json({ message: "Name, email and message are required." });
  }

  const message = await Message.create({ name, email, subject, body });
  res.status(201).json({ message: "Message sent. Dipesh will reply soon.", id: message._id });
};

export const getMessages = async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
};

export const markRead = async (req, res) => {
  const message = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!message) return res.status(404).json({ message: "That message isn't here." });
  res.json(message);
};

export const deleteMessage = async (req, res) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) return res.status(404).json({ message: "That message isn't here." });
  res.json({ message: "Message deleted." });
};
