import { NextFunction, Request, Response } from "express";
import mongoose, { mongo } from "mongoose";
import Book from "../models/Book";

const createBook = (req: Request, res: Response, next: NextFunction) => {
    const { title, author } = req.body;

    const book = new Book({
        _id: new mongoose.Types.ObjectId(),
        title, 
        author
    });

    return book
        .save()
        .then((book) => res.status(201).json({ book }))
        .catch((error) => res.status(500).json({ error }));
}

const readBook = (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;
    console.log(`Book Id is ${bookId}`);

    return Book
        .findById(bookId)
        .populate('author')     // to get author details
        .select('-__v')         // to ignore version key
        .then((book) => (book ? res.status(200).json({ book }) : res.status(404)
            .json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));

};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Book
        .find()
        .populate('author')     // to get author details
        .select('-__v')         // to ignore version key
        .then((books) => res.status(200).json({ books }))
        .catch((error) => res.status(500).json({ error }));

}

const updateBook = (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    console.log(`Book Id is ${bookId}`);

    return Book.findById(bookId)
        .then((book) => {
            if (book) {
                book.set(req.body);
                return book
                    .save()
                    .then((book) => res.status(201).json({ book }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: 'Not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deleteBook = (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    console.log(`Book Id is ${bookId}`);

    return Book.findByIdAndDelete(bookId)
        .then((book) => (book ? res.status(201).json({ message: 'Deleted' }) : res.status(404)
            .json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default {
    createBook,
    readBook,
    readAll,
    updateBook,
    deleteBook
};