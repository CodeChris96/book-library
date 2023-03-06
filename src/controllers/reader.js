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
