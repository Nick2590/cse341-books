# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

The API must provide CRUD operations for books stored in the `books` collection. Each book must use a custom string identifier and must reference an existing author.

### Book data model

Each book must include these properties:

- `id`: string, required, custom identifier such as `b1`
- `authorId`: string, required, identifying an existing author
- `title`: string, required
- `publicationDate`: string, required, representing the book's publication date

The `authorId` value must reference an existing author. A book must not be created or updated with an `authorId` that does not exist in the authors collection.

### Book routes

#### GET `/books`

Return all books in the `books` collection.

- Success status: `200 OK`
- Success response: JSON array of books
- Unexpected server or database error: `500 Internal Server Error`

#### GET `/books/:id`

Return the book whose custom string `id` matches the route parameter.

- Success status: `200 OK`
- Success response: one book as a JSON object
- Book does not exist: `404 Not Found`
- Invalid request or identifier: `400 Bad Request`
- Unexpected server or database error: `500 Internal Server Error`

#### POST `/books`

Create a book from the request body and save it to the `books` collection.

- Success status: `201 Created`
- Success response: the newly created book as JSON
- Missing or invalid required fields: `400 Bad Request`
- `authorId` does not reference an existing author: `400 Bad Request`
- Duplicate custom book `id`: `400 Bad Request`
- Unexpected server or database error: `500 Internal Server Error`

Example request body:

```json
{
  "id": "b1",
  "authorId": "a1",
  "title": "The Example Book",
  "publicationDate": "2024-01-15"
}
```

#### PUT `/books/:id`

Update the existing book identified by the route parameter. The request must contain the book data to be updated.

- Success status: `200 OK`
- Success response: the updated book as JSON
- Missing or invalid required fields: `400 Bad Request`
- `authorId` does not reference an existing author: `400 Bad Request`
- Book does not exist: `404 Not Found`
- Unexpected server or database error: `500 Internal Server Error`

Example request body:

```json
{
  "id": "b1",
  "authorId": "a1",
  "title": "The Updated Example Book",
  "publicationDate": "2024-02-20"
}
```

#### DELETE `/books/:id`

Delete the book whose custom string `id` matches the route parameter.

- Success status: `204 No Content`
- Success response: no response body
- Book does not exist: `404 Not Found`
- Invalid request or identifier: `400 Bad Request`
- Unexpected server or database error: `500 Internal Server Error`

### Version 1 book requirements

- Store books in the `books` collection.
- Use a custom string `id`, such as `b1`, instead of depending on the MongoDB-generated identifier as the public book identifier.
- Store the book's `authorId`, `title`, and `publicationDate`.
- Ensure every `authorId` references an existing author.
- Implement `GET /books`, `GET /books/:id`, `POST /books`, `PUT /books/:id`, and `DELETE /books/:id`.
- Return the correct `200`, `201`, `204`, `400`, `404`, and `500` status codes for the documented outcomes.
- Document every book route in Swagger.
- Deploy the API to Render and verify the deployed book routes, database connection, and Swagger documentation.

## Feature 2: Author CRUD Operations

The API must provide CRUD operations for authors stored in an authors collection. Authors are referenced by books through the book `authorId` property.

### Author data model

Each author must include these properties:

- `id`: string, required, custom identifier such as `a1`
- `name`: string, required
- `birthYear`: number, required

### Author routes

#### GET `/authors`

Return all authors in the authors collection.

- Success status: `200 OK`
- Success response: JSON array of authors
- Unexpected server or database error: `500 Internal Server Error`

#### GET `/authors/:id`

Return the author whose custom string `id` matches the route parameter.

- Success status: `200 OK`
- Success response: one author as a JSON object
- Author does not exist: `404 Not Found`
- Invalid request or identifier: `400 Bad Request`
- Unexpected server or database error: `500 Internal Server Error`

#### POST `/authors`

Create an author from the request body and save it to the authors collection.

- Success status: `201 Created`
- Success response: the newly created author as JSON
- Missing or invalid required fields: `400 Bad Request`
- Duplicate author `id`: `400 Bad Request`
- Unexpected server or database error: `500 Internal Server Error`

Example request body:

```json
{
  "id": "a1",
  "name": "Example Author",
  "birthYear": 1985
}
```

#### PUT `/authors/:id`

Update the existing author identified by the route parameter.

- Success status: `200 OK`
- Success response: the updated author as JSON
- Missing or invalid required fields: `400 Bad Request`
- Author does not exist: `404 Not Found`
- Unexpected server or database error: `500 Internal Server Error`

Example request body:

```json
{
  "id": "a1",
  "name": "Updated Example Author",
  "birthYear": 1986
}
```

#### DELETE `/authors/:id`

Delete the author whose custom string `id` matches the route parameter. If any book still references this author's `id`, the author must not be deleted.

- Success status: `204 No Content`
- Success response: no response body
- Author has related books: `409 Conflict`; do not delete the author
- Author does not exist: `404 Not Found`
- Invalid request or identifier: `400 Bad Request`
- Unexpected server or database error: `500 Internal Server Error`

### Version 1 author requirements

- Store authors in an authors collection.
- Use a required custom string `id`, such as `a1`.
- Store a required string `name` and required numeric `birthYear`.
- Implement `GET /authors`, `GET /authors/:id`, `POST /authors`, `PUT /authors/:id`, and `DELETE /authors/:id`.
- Return `201` for successful POST requests.
- Return `200` for successful GET and PUT requests.
- Return `204` with no response body for successful DELETE requests.
- Return `400` for missing or invalid required fields and duplicate author IDs.
- Return `404` when an author is not found.
- Return `409 Conflict` and preserve the author when books still reference the author.
- Return `500` for unexpected server or database errors.
- Document every author route in Swagger.
- Deploy the API to Render and verify the deployed author routes and Swagger documentation.

# Evaluation of Version 1

1. **Are there any bugs or short-sighted decisions?**

   Version 1 defines the required routes and status codes, but it does not fully define the JSON error format, the exact validation rules for strings and dates, or whether PUT requests replace the complete resource or allow partial updates. It also permits ambiguity about whether the `id` in a PUT body must match the route parameter. Without explicit rules, different endpoints could behave inconsistently. The custom IDs are appropriate for the assignment, but duplicate IDs need database-level protection as well as application checks to avoid race conditions.

   The author-delete rule is important, but the API must check for related books before deletion. A check that is omitted or performed incorrectly could leave books pointing to an author that no longer exists. A check followed by a delete can also be affected by concurrent writes unless the application accepts that limitation or uses an appropriate database strategy.

2. **Are there any missing security considerations?**

   The specification does not explicitly say to validate and whitelist request properties. Saving an entire `req.body` could allow clients to add unintended fields or overwrite protected values. Error responses must not expose stack traces, MongoDB connection strings, credentials, or internal database details. The deployed application must keep credentials in environment variables and must not commit them to source control.

   Authentication and authorization are outside the scope of this student project, so they are not required for Version 1. Basic input validation and careful error handling are still required even without user accounts.

3. **Are there any efficiency concerns with the endpoint design?**

   Listing all books or authors is acceptable for this assignment, but an unrestricted list endpoint may become inefficient for a large collection. The custom string IDs and author references should have indexes so lookups remain efficient. Checking whether an author has related books should query for one matching book rather than loading every related book. The `books.authorId` field should be indexed for that check.

4. **Are any responses or error behaviors unclear?**

   Version 1 does not require a consistent error response body, so clients cannot reliably determine what went wrong. It does not clearly define the shape of validation errors, whether unknown fields are ignored or rejected, whether PUT may change an ID, or how dates and numeric years are validated. Version 2 resolves these details while keeping the scope appropriate for the assignment.

# Books API Week 02 Spec - Version 2

Version 2 is the implementation checklist for both the Book and Author CRUD features. It preserves the Week 02 scope and adds consistent validation, error handling, referential integrity, indexes, Swagger documentation, and local and deployed testing expectations.

## Version 2: Shared API rules

- Use JSON request and response bodies and configure the Express application to parse JSON requests.
- Use the custom string IDs as the public resource identifiers. MongoDB's internal `_id` may exist, but routes must use the custom `id` value.
- Accept only the documented writable properties for each resource. Do not blindly save every property from `req.body`.
- Validate the request body before writing to MongoDB.
- Treat required strings as invalid when they are missing, not strings, or empty after trimming.
- Treat `birthYear` as invalid when it is missing, not a number, not an integer, or outside the chosen reasonable year range for the project.
- Validate `publicationDate` as a non-empty string in the date format selected by the project, preferably an ISO date such as `YYYY-MM-DD`.
- Validate route IDs as non-empty strings.
- Return errors as JSON with a consistent shape, for example:

```json
{
  "message": "Book not found"
}
```

- Do not expose stack traces, MongoDB URIs, credentials, or internal database errors in API responses. Log useful server-side diagnostic information without returning secrets to clients.
- Use `400 Bad Request` for invalid input, invalid route values, missing required fields, duplicate custom IDs, and invalid author references.
- Use `404 Not Found` when the requested book or author does not exist.
- Use `409 Conflict` when an author cannot be deleted because books still reference that author.
- Use `500 Internal Server Error` for unexpected server or database errors, with a generic JSON message.
- Ensure successful `DELETE` responses have status `204` and no response body.
- Recommend and create unique indexes for `books.id` and `authors.id` so duplicate custom IDs are prevented at the database level.
- Recommend an index for `books.authorId` to make author-reference checks efficient.
- Document every route, request body, success response, and relevant error response in Swagger.
- Make every route testable from the local Swagger UI at `/api-docs` and from the deployed Render Swagger UI.

## Version 2: Book feature checklist

### Book model and persistence

- [ ] Store books in the `books` collection.
- [ ] Define the writable book fields as `id`, `authorId`, `title`, and `publicationDate`.
- [ ] Require `id` to be a non-empty custom string such as `b1`.
- [ ] Require `authorId` to be a non-empty string.
- [ ] Require `title` to be a non-empty string.
- [ ] Require `publicationDate` to be a valid, non-empty date string in the documented format.
- [ ] Create a unique index for `books.id`.
- [ ] Create an index for `books.authorId`.
- [ ] Do not persist arbitrary properties supplied by the client.

### GET `/books`

- [ ] Return all books as a JSON array with status `200`.
- [ ] Return a consistent JSON `500` error if the database operation fails unexpectedly.
- [ ] Document the route in Swagger.

### GET `/books/:id`

- [ ] Find one book by the custom string ID.
- [ ] Return the book as JSON with status `200`.
- [ ] Return `{ "message": "Book not found" }` with status `404` when no book matches.
- [ ] Return a JSON `400` error for an invalid route ID.
- [ ] Return a generic JSON `500` error for an unexpected database failure.
- [ ] Document the route and responses in Swagger.

### POST `/books`

- [ ] Validate and whitelist `id`, `authorId`, `title`, and `publicationDate`.
- [ ] Verify that `authorId` references an existing author before inserting the book.
- [ ] Return a JSON `400` error when required fields are missing or invalid.
- [ ] Return a JSON `400` error when `authorId` does not reference an existing author.
- [ ] Return a JSON `400` error when the custom book ID is duplicated, including a duplicate-key database result.
- [ ] Return the created book as JSON with status `201`.
- [ ] Return a generic JSON `500` error for an unexpected failure.
- [ ] Document the request body and all relevant responses in Swagger.

### PUT `/books/:id`

- [ ] Find the existing book using the route parameter.
- [ ] Validate and whitelist the permitted book fields.
- [ ] Require the submitted `id`, if accepted in the request body, to match the route parameter; alternatively, omit `id` from the update body and preserve it from the route. In either case, the book ID cannot be changed through PUT.
- [ ] Validate that the submitted `authorId` references an existing author.
- [ ] Return a JSON `400` error for missing or invalid fields, an ID mismatch, or an invalid author reference.
- [ ] Return `{ "message": "Book not found" }` with status `404` when the route ID does not identify an existing book.
- [ ] Return the updated book as JSON with status `200`.
- [ ] Return a generic JSON `500` error for an unexpected failure.
- [ ] Document the request body and all relevant responses in Swagger.

### DELETE `/books/:id`

- [ ] Find and delete only the book matching the route parameter.
- [ ] Return status `204` with no response body after a successful deletion.
- [ ] Return `{ "message": "Book not found" }` with status `404` when no book matches.
- [ ] Return a JSON `400` error for an invalid route ID.
- [ ] Return a generic JSON `500` error for an unexpected failure.
- [ ] Document the route and responses in Swagger.

## Version 2: Author feature checklist

### Author model and persistence

- [ ] Store authors in the authors collection.
- [ ] Define the writable author fields as `id`, `name`, and `birthYear`.
- [ ] Require `id` to be a non-empty custom string such as `a1`.
- [ ] Require `name` to be a non-empty string.
- [ ] Require `birthYear` to be a valid number, preferably an integer in the documented reasonable year range.
- [ ] Create a unique index for `authors.id`.
- [ ] Do not persist arbitrary properties supplied by the client.

### GET `/authors`

- [ ] Return all authors as a JSON array with status `200`.
- [ ] Return a consistent JSON `500` error for an unexpected database failure.
- [ ] Document the route in Swagger.

### GET `/authors/:id`

- [ ] Find one author by the custom string ID.
- [ ] Return the author as JSON with status `200`.
- [ ] Return `{ "message": "Author not found" }` with status `404` when no author matches.
- [ ] Return a JSON `400` error for an invalid route ID.
- [ ] Return a generic JSON `500` error for an unexpected database failure.
- [ ] Document the route and responses in Swagger.

### POST `/authors`

- [ ] Validate and whitelist `id`, `name`, and `birthYear`.
- [ ] Return a JSON `400` error when a required field is missing or invalid.
- [ ] Return a JSON `400` error when the custom author ID is duplicated, including a duplicate-key database result.
- [ ] Return the created author as JSON with status `201`.
- [ ] Return a generic JSON `500` error for an unexpected failure.
- [ ] Document the request body and all relevant responses in Swagger.

### PUT `/authors/:id`

- [ ] Find the existing author using the route parameter.
- [ ] Validate and whitelist the permitted author fields.
- [ ] Require the submitted `id`, if accepted in the request body, to match the route parameter; alternatively, omit `id` from the update body and preserve it from the route. The author ID cannot be changed through PUT.
- [ ] Return a JSON `400` error for missing or invalid fields or an ID mismatch.
- [ ] Return `{ "message": "Author not found" }` with status `404` when the route ID does not identify an existing author.
- [ ] Return the updated author as JSON with status `200`.
- [ ] Return a generic JSON `500` error for an unexpected failure.
- [ ] Document the request body and all relevant responses in Swagger.

### DELETE `/authors/:id`

- [ ] Check whether the author exists.
- [ ] Before deletion, check for a related book with `findOne({ authorId: id })` or an equivalent query. Do not load all related books when one matching book is sufficient.
- [ ] If a related book exists, return `{ "message": "Author has books and cannot be deleted" }` with status `409` and do not delete the author.
- [ ] If no related books exist, delete the author and return status `204` with no response body.
- [ ] Return `{ "message": "Author not found" }` with status `404` when no author matches.
- [ ] Return a JSON `400` error for an invalid route ID.
- [ ] Return a generic JSON `500` error for an unexpected failure.
- [ ] Document the conflict behavior and all other responses in Swagger.

## Version 2: Swagger and testing checklist

- [ ] Expose Swagger UI at `/api-docs`.
- [ ] Document all ten routes: the five book routes and the five author routes.
- [ ] Document path parameters, request body schemas, required fields, response schemas, and `200`, `201`, `204`, `400`, `404`, `409`, and `500` responses where applicable.
- [ ] Verify every route locally through `/api-docs` using valid and invalid requests.
- [ ] Verify book creation fails when `authorId` does not exist.
- [ ] Verify duplicate book and author IDs return `400`.
- [ ] Verify PUT cannot change either resource's custom ID.
- [ ] Verify an author with a related book cannot be deleted and returns `409`.
- [ ] Verify an author without related books can be deleted with `204` and no body.
- [ ] Verify missing resources return the documented `404` JSON message.
- [ ] Verify unexpected failures return a generic `500` message without internal details.
- [ ] Deploy the application to Render using environment variables for the MongoDB URI, database name, and port configuration.
- [ ] Do not commit MongoDB URIs, usernames, passwords, credentials, stack traces, or other secrets.
- [ ] Verify the deployed Render base URL serves the API routes and the deployed `/api-docs` page.
- [ ] Repeat the local CRUD, validation, reference-integrity, conflict, and error tests against the deployed Render API.
- [ ] Confirm the deployed application can connect to the intended MongoDB database without exposing connection details in responses.
