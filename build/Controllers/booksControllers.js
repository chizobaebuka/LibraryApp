"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookInfo = exports.deleteBook = exports.updateAnyBook = exports.getAllBooks = exports.createBook = void 0;
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
let booksFolder = path_1.default.join(__dirname, "../../src/booksDatabse");
let booksFile = path_1.default.join(booksFolder, "bookDatabase.json");
// To create a new Book and save to the database - POST request (CREATE)
const createBook = (req, res, next) => {
    try {
        // create the booksDatabase dynamically 
        if (!fs_1.default.existsSync(booksFolder)) {
            fs_1.default.mkdirSync(booksFolder);
        }
        if (!fs_1.default.existsSync(booksFile)) {
            fs_1.default.writeFileSync(booksFile, " ");
        }
        // read from database
        let allBooks = [];
        try {
            const infos = fs_1.default.readFileSync(booksFile, 'utf8');
            if (!infos) {
                return res.status(400).json({
                    message: `Cannot read this file`
                });
            }
            else {
                allBooks = JSON.parse(infos);
            }
        }
        catch (parseError) {
            allBooks = [];
        }
        const { title, author, datePublished, description, pageCount, genre, bookId, publisher, } = req.body;
        let existingBooks = allBooks.find((book) => book.title === title);
        if (existingBooks) {
            return res.send({ message: `Book already exists` });
        }
        let newBookInfo = {
            title: title,
            author: author,
            datePublished: datePublished,
            description: description,
            pageCount: pageCount,
            Genre: genre,
            bookId: (0, uuid_1.v4)(),
            publisher: publisher,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        allBooks.push(newBookInfo);
        fs_1.default.writeFile(booksFile, JSON.stringify(allBooks, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ message: `Your book cannot be updated to the database` });
            }
            else {
                return res.status(200).json({
                    message: `You have successfully uploaded your book to the database`,
                    newBookInfo
                });
            }
        });
    }
    catch (error) {
        return res.status(500).send({ message: `Error found try again` });
    }
};
exports.createBook = createBook;
// GET ALL BOOKS FROM THE DATABASE - GET request (READ)
const getAllBooks = (req, res, next) => {
    try {
        const infos = fs_1.default.readFileSync(booksFile, 'utf8');
        const allBooks = JSON.parse(infos);
        return res.status(200).json(allBooks);
    }
    catch (err) {
        return res.status(500).json({ message: `Failed to retrieve books from the database` });
    }
};
exports.getAllBooks = getAllBooks;
// Edit a Book or Update it based on title - UPDATE Request (UPDATE)
const updateAnyBook = (req, res, next) => {
    try {
        const { title, author, datePublished, description, pageCount, genre, publisher } = req.body;
        const infos = fs_1.default.readFileSync(booksFile, 'utf8');
        const allBooks = JSON.parse(infos);
        const book = allBooks.find((book) => book.title === title);
        if (!book) {
            return res.status(404).json({ message: `Book not found` });
        }
        const updatedBook = Object.assign(Object.assign({}, book), { title,
            author,
            datePublished,
            description,
            pageCount,
            genre,
            publisher, updatedAt: new Date() });
        const updatedBooks = allBooks.map((book) => {
            if (book.title === title) {
                return updatedBook;
            }
            else {
                return book;
            }
        });
        fs_1.default.writeFile(booksFile, JSON.stringify(updatedBooks, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ message: `Failed to update the book in the database` });
            }
            else {
                return res.status(200).json({
                    message: `Book successfully updated`,
                    updatedBook,
                });
            }
        });
    }
    catch (error) {
        return res.status(500).json({ message: `Failed to update the book` });
    }
};
exports.updateAnyBook = updateAnyBook;
// Delete a book from the database based on the title - DELETE Request (DELETE)
const deleteBook = (req, res, next) => {
    try {
        const { title } = req.body;
        const infos = fs_1.default.readFileSync(booksFile, 'utf8');
        const allBooks = JSON.parse(infos);
        const book = allBooks.find((book) => book.title === title);
        if (!book) {
            return res.status(404).json({ message: `Book not found` });
        }
        const updatedBooks = allBooks.filter((book) => book.title !== title);
        fs_1.default.writeFile(booksFile, JSON.stringify(updatedBooks, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ message: `Failed to delete the book from the database` });
            }
            else {
                return res.status(200).json({
                    message: `Book successfully deleted`,
                });
            }
        });
    }
    catch (error) {
        return res.status(500).json({ message: `Failed to delete the book` });
    }
};
exports.deleteBook = deleteBook;
// Getting the information of a book based on the id - GET Request (READ)
const getBookInfo = (req, res, next) => {
    try {
        const bookId = req.params.id;
        const infos = fs_1.default.readFileSync(booksFile, 'utf8');
        const allBooks = JSON.parse(infos);
        const book = allBooks.find((book) => book.bookId === bookId);
        if (!book) {
            res.status(404).send({ message: `Book not found` });
        }
        res.status(200).json(book);
    }
    catch (err) {
        res.status(500).send({ message: `Couldn't retrive book information` });
    }
};
exports.getBookInfo = getBookInfo;
