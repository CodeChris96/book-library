const { Book } = require("../models");

const createBook = async (req, res) => {
  const newBook = await Book.create(req.body);
  res.status(201).json(newBook);
};

const findAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    if (books.length === 0) {
      return res.status(404).send("No books found.");
    }
    return res.status(200).json(books);
  } catch (error) {
    return res
      .status(500)
      .send("Something went wrong. Please try again later.");
  }
};

const findBookByPk = async (req, res) => {
  const bookId = req.params.id;
  const book = await Book.findByPk(bookId);

  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ error: "The book could not be found." });
  }
};

const updateBook = async (req, res) => {
  const bookId = req.params.id;
  const { title, author, genre, ISBN } = req.body;

  const [numRowsUpdated, [updatedBook]] = await Book.update(
    { title, author, genre, ISBN },
    { where: { id: bookId }, returning: true }
  );

  if (numRowsUpdated !== 1) {
    return res.status(404).json({ error: "The book could not be found." });
  }

  res.status(200).json(updatedBook);
};

const deleteBook = async (req, res) => {
  const bookId = req.params.id;

  const book = await Book.findByPk(bookId);

  if (!book) {
    return res.status(404).json({ error: "The book could not be found." });
  }

  await book.destroy();

  res.status(204).send();
};

module.exports = {
  createBook,
  findAllBooks,
  findBookByPk,
  updateBook,
  deleteBook,
};
