import express from 'express';
import { createBook, deleteBook, getAllBooks, getBookInfo, updateAnyBook } from '../Controllers/booksControllers';
import { auth } from '../utils/auth';
const router = express.Router();

router.post('/create', auth, createBook); //create a new book and add to database
router.get('/getbooks', auth, getAllBooks); //get all books from the database
router.put('/update', auth, updateAnyBook); //update any book in the database
router.delete('/delete', auth, deleteBook); //delete any book in the database based on the title
router.get('/getbooks/:id', getBookInfo); // getting the information of all books within the database

export default router;