import express from "express";
import { getBooksHandler, getBookByIdHandler } from "./controllers/books.js";
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
 *       500:
 *         description: Internal server error
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
 *         description: The ID of the book to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The book object
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.get("/books/:id", getBookByIdHandler);

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