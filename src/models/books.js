import { getDb } from "../db/connect.js";

const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection("books");
  const books = await collection.find({}).toArray();
  return books;
};

const getBookById = async (bookId) => {
  const db = getDb();
  const collection = db.collection("books");
  return collection.findOne({ id: bookId });
};

const createBook = async (book) => {
  const db = getDb();
  const collection = db.collection("books");
  await collection.insertOne(book);
  return book;
};

const updateBook = async (id, book) => {
  const db = getDb();
  const collection = db.collection("books");
  const result = await collection.updateOne({ id }, { $set: book });

  if (result.matchedCount === 0) {
    return null;
  }

  return collection.findOne({ id });
};

const deleteBook = async (id) => {
  const db = getDb();
  const collection = db.collection("books");
  return collection.deleteOne({ id });
};

const bookIdExists = async (id) => {
  const book = await getBookById(id);
  return Boolean(book);
};

const authorExists = async (id) => {
  const db = getDb();
  const collection = db.collection("authors");
  const author = await collection.findOne({ id });
  return Boolean(author);
};

export {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  bookIdExists,
  authorExists
};