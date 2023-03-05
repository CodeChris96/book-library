const { Reader } = require("../models");

const createReader = async (req, res) => {
  const newReader = await Reader.create(req.body);
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

module.exports = {
  createReader,
  findAllReader,
  findByPk,
};
