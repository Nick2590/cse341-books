import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  bookIdExists,
  authorExists
} from "../models/books.js";

const isValidString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const isValidPublicationDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
};

const isValidBook = ({ id, title, authorId, publicationDate }) => {
  return (
    isValidString(id) &&
    isValidString(title) &&
    isValidString(authorId) &&
    isValidPublicationDate(publicationDate)
  );
};

const isValidBookUpdate = ({ title, authorId, publicationDate }) => {
  const fields = { title, authorId, publicationDate };
  const suppliedFields = Object.keys(fields).filter((field) => {
    return fields[field] !== undefined;
  });

  if (suppliedFields.length === 0) {
    return false;
  }

  return suppliedFields.every((field) => {
    if (field === "publicationDate") {
      return isValidPublicationDate(fields[field]);
    }

    return isValidString(fields[field]);
  });
};

const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.error("GET /books failed:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getBookByIdHandler = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await getBookById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error("GET /books/:id failed:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const postBookHandler = async (req, res) => {
  try {
    const { id, title, authorId, publicationDate } = req.body;

    if (!isValidBook({ id, title, authorId, publicationDate })) {
      return res.status(400).json({ message: "Invalid book data" });
    }

    const book = {
      id: id.trim(),
      title: title.trim(),
      authorId: authorId.trim(),
      publicationDate
    };

    if (await bookIdExists(book.id)) {
      return res.status(400).json({ message: "Book id already exists" });
    }

    if (!(await authorExists(book.authorId))) {
      return res.status(400).json({ message: "Author not found" });
    }

    await createBook(book);
    return res.status(201).json(book);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Book id already exists" });
    }

    console.error("POST /books failed:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const putBookHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, authorId, publicationDate, ...otherFields } = req.body;

    if (Object.hasOwn(otherFields, "id") || !isValidBookUpdate({ title, authorId, publicationDate })) {
      return res.status(400).json({ message: "Invalid book data" });
    }

    if (!(await getBookById(id))) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (authorId !== undefined && !(await authorExists(authorId.trim()))) {
      return res.status(400).json({ message: "Author not found" });
    }

    const bookUpdates = {};

    if (title !== undefined) {
      bookUpdates.title = title.trim();
    }

    if (authorId !== undefined) {
      bookUpdates.authorId = authorId.trim();
    }

    if (publicationDate !== undefined) {
      bookUpdates.publicationDate = publicationDate;
    }

    const updatedBook = await updateBook(id, bookUpdates);
    return res.status(200).json(updatedBook);
  } catch (error) {
    console.error("PUT /books/:id failed:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteBookHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteBook(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("DELETE /books/:id failed:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  postBookHandler,
  putBookHandler,
  deleteBookHandler
};