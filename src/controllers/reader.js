const { Reader } = require("../models");
const validator = require("validator");

const createReader = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required." });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Email is not formatted correctly." });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long." });
  }

  const newReader = await Reader.create({ name, email, password });
  res.status(201).json(newReader);
};

const findAllReader = async (req, res) => {
  try {
    const readers = await Reader.findAll();
    if (readers.length === 0) {
      return res.status(404).send("No readers found.");
    }
    return res.status(200).json(readers);
  } catch (error) {
    return res
      .status(500)
      .send("Something went wrong. Please try again later.");
  }
};

const findByPk = async (req, res) => {
  const readerId = req.params.id;
  const reader = await Reader.findByPk(readerId);

  if (reader) {
    res.status(200).json(reader);
  } else {
    res.status(404).json({ error: "The reader could not be found." });
  }
};

const updateReader = async (req, res) => {
  const readerId = req.params.id;
  const { name, email, password } = req.body;

  const [rowsUpdated, [updatedReader]] = await Reader.update(
    {
      name: name,
      email: email,
      password: password,
    },
    {
      returning: true,
      where: {
        id: readerId,
      },
    }
  );

  if (rowsUpdated === 0) {
    return res.status(404).json({ error: "The reader could not be found." });
  }

  return res.status(200).json(updatedReader);
};

const deleteReader = async (req, res) => {
  const readerId = req.params.id;

  const reader = await Reader.findByPk(readerId);

  if (!reader) {
    return res.status(404).json({ error: "The reader could not be found." });
  }
  await reader.destroy();
  res.status(204).send();
};

module.exports = {
  createReader,
  findAllReader,
  findByPk,
  updateReader,
  deleteReader,
};
