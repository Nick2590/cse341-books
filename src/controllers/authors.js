import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks
} from "../models/authors.js";

const currentYear = new Date().getFullYear();

const isValidName = (name) => {
  return typeof name === "string" && name.trim().length > 0;
};

const isValidBirthYear = (birthYear) => {
  return Number.isInteger(birthYear) && birthYear > 0 && birthYear <= currentYear;
};

const isValidId = (id) => {
  return typeof id === "string" && id.trim().length > 0;
};

const getAuthorsHandler = async (req, res) => {
  try {
    const authors = await getAllAuthors();
    return res.status(200).json(authors);
  } catch (error) {
    console.error("GET /authors failed:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAuthorByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await getAuthorById(id);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error("GET /authors/:id failed:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const postAuthorHandler = async (req, res) => {
  try {
    const { id, name, birthYear } = req.body;

    if (!isValidId(id) || !isValidName(name) || !isValidBirthYear(birthYear)) {
      return res.status(400).json({ message: "Invalid author data" });
    }

    const author = { id: id.trim(), name: name.trim(), birthYear };

    if (await getAuthorById(author.id)) {
      return res.status(400).json({ message: "Author id already exists" });
    }

    await createAuthor(author);
    return res.status(201).json(author);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Author id already exists" });
    }

    console.error("POST /authors failed:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const putAuthorHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, birthYear } = req.body;

    if (!isValidName(name) || !isValidBirthYear(birthYear)) {
      return res.status(400).json({ message: "Invalid author data" });
    }

    const author = { name: name.trim(), birthYear };
    const updatedAuthor = await updateAuthor(id, author);

    if (!updatedAuthor) {
      return res.status(404).json({ message: "Author not found" });
    }

    return res.status(200).json(updatedAuthor);
  } catch (error) {
    console.error("PUT /authors/:id failed:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteAuthorHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await getAuthorById(id);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    if (await authorHasBooks(id)) {
      return res.status(409).json({
        message: "Author cannot be deleted while books reference this author"
      });
    }

    await deleteAuthor(id);
    return res.status(204).send();
  } catch (error) {
    console.error("DELETE /authors/:id failed:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getAuthorsHandler,
  getAuthorByIdHandler,
  postAuthorHandler,
  putAuthorHandler,
  deleteAuthorHandler
};
