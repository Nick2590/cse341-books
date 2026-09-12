import express from "express";
import {
	getBooksHandler,
	getBookByIdHandler,
	postBookHandler,
	putBookHandler,
	deleteBookHandler
} from "./controllers/books.js";
import {
	getAuthorsHandler,
	getAuthorByIdHandler,
	postAuthorHandler,
	putAuthorHandler,
	deleteAuthorHandler
} from "./controllers/authors.js";

const router = express.Router();

/**
 * @openapi
 * /books:
 *   get:
 *     tags: [Books]
 *     summary: Get all books
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/books", getBooksHandler);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     tags: [Books]
 *     summary: Get a book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom string ID of the book to retrieve
 *         schema:
 *           type: string
 *         example: b1
 *     responses:
 *       200:
 *         description: The book object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/books/:id", getBookByIdHandler);

/**
 * @openapi
 * /books:
 *   post:
 *     tags: [Books]
 *     summary: Create a book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookCreate'
 *           example:
 *             id: b4
 *             title: The Example Book
 *             authorId: a1
 *             publicationDate: '2024-01-15'
 *     responses:
 *       201:
 *         description: Book created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Missing, invalid, duplicate, or unknown author data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/books", postBookHandler);

/**
 * @openapi
 * /books/{id}:
 *   put:
 *     tags: [Books]
 *     summary: Update a book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom string ID of the book to update
 *         schema:
 *           type: string
 *         example: b1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookUpdate'
 *           example:
 *             title: The Updated Book
 *             authorId: a1
 *             publicationDate: '2024-02-20'
 *     responses:
 *       200:
 *         description: Book updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Missing, invalid, or unauthorized book data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/books/:id", putBookHandler);

/**
 * @openapi
 * /books/{id}:
 *   delete:
 *     tags: [Books]
 *     summary: Delete a book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom string ID of the book to delete
 *         schema:
 *           type: string
 *         example: b1
 *     responses:
 *       204:
 *         description: Book deleted with no response body
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/books/:id", deleteBookHandler);

/**
 * @openapi
 * /authors:
 *   get:
 *     tags: [Authors]
 *     summary: Get all authors
 *     responses:
 *       200:
 *         description: A list of authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/authors", getAuthorsHandler);

/**
 * @openapi
 * /authors/{id}:
 *   get:
 *     tags: [Authors]
 *     summary: Get an author by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom string ID of the author
 *         schema:
 *           type: string
 *         example: a1
 *     responses:
 *       200:
 *         description: The requested author
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/authors/:id", getAuthorByIdHandler);

/**
 * @openapi
 * /authors:
 *   post:
 *     tags: [Authors]
 *     summary: Create an author
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorCreate'
 *           example:
 *             id: a4
 *             name: Example Author
 *             birthYear: 1980
 *     responses:
 *       201:
 *         description: Author created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Missing, invalid, or duplicate author data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/authors", postAuthorHandler);

/**
 * @openapi
 * /authors/{id}:
 *   put:
 *     tags: [Authors]
 *     summary: Update an author
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom string ID of the author to update
 *         schema:
 *           type: string
 *         example: a1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorUpdate'
 *           example:
 *             name: Updated Author
 *             birthYear: 1981
 *     responses:
 *       200:
 *         description: Author updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Missing or invalid author data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/authors/:id", putAuthorHandler);

/**
 * @openapi
 * /authors/{id}:
 *   delete:
 *     tags: [Authors]
 *     summary: Delete an author
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom string ID of the author to delete
 *         schema:
 *           type: string
 *         example: a1
 *     responses:
 *       204:
 *         description: Author deleted with no response body
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Author cannot be deleted while books reference it
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/authors/:id", deleteAuthorHandler);

/**
 * @openapi
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required: [id, title, authorId, publicationDate]
 *       properties:
 *         id:
 *           type: string
 *           example: b1
 *         title:
 *           type: string
 *           example: The Hobbit
 *         authorId:
 *           type: string
 *           example: a1
 *         publicationDate:
 *           type: string
 *           format: date
 *           example: '1937-09-21'
 *     BookCreate:
 *       type: object
 *       required: [id, title, authorId, publicationDate]
 *       properties:
 *         id:
 *           type: string
 *           example: b4
 *         title:
 *           type: string
 *           example: The Example Book
 *         authorId:
 *           type: string
 *           example: a1
 *         publicationDate:
 *           type: string
 *           format: date
 *           example: '2024-01-15'
 *     BookUpdate:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         title:
 *           type: string
 *           example: The Updated Book
 *         authorId:
 *           type: string
 *           example: a1
 *         publicationDate:
 *           type: string
 *           format: date
 *           example: '2024-02-20'
 *     Author:
 *       type: object
 *       required: [id, name, birthYear]
 *       properties:
 *         id:
 *           type: string
 *           example: a1
 *         name:
 *           type: string
 *           example: Example Author
 *         birthYear:
 *           type: integer
 *           example: 1980
 *     AuthorCreate:
 *       type: object
 *       required: [id, name, birthYear]
 *       properties:
 *         id:
 *           type: string
 *           example: a4
 *         name:
 *           type: string
 *           example: Example Author
 *         birthYear:
 *           type: integer
 *           example: 1980
 *     AuthorUpdate:
 *       type: object
 *       required: [name, birthYear]
 *       properties:
 *         name:
 *           type: string
 *           example: Updated Author
 *         birthYear:
 *           type: integer
 *           example: 1981
 *     Error:
 *       type: object
 *       required: [message]
 *       properties:
 *         message:
 *           type: string
 *           example: Author not found
 */

export default router;