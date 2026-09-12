import { getDb } from "../db/connect.js";

const getAllAuthors = async () => {
  const db = getDb();
  const collection = db.collection("authors");
  return collection.find({}).toArray();
};

const getAuthorById = async (id) => {
  const db = getDb();
  const collection = db.collection("authors");
  return collection.findOne({ id });
};

const createAuthor = async (author) => {
  const db = getDb();
  const collection = db.collection("authors");
  await collection.insertOne(author);
  return author;
};

const updateAuthor = async (id, author) => {
  const db = getDb();
  const collection = db.collection("authors");
  const result = await collection.updateOne({ id }, { $set: author });

  if (result.matchedCount === 0) {
    return null;
  }

  return collection.findOne({ id });
};

const deleteAuthor = async (id) => {
  const db = getDb();
  const collection = db.collection("authors");
  return collection.deleteOne({ id });
};

const authorHasBooks = async (id) => {
  const db = getDb();
  const booksCollection = db.collection("books");
  const book = await booksCollection.findOne(
    { authorId: id },
    { projection: { _id: 1 } }
  );
  return Boolean(book);
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks
};
