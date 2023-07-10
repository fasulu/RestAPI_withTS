import express from 'express';
import controller from '../controllers/Book';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const bookRouter = express.Router();

bookRouter.post('/create', ValidateSchema(Schemas.book.create), controller.createBook);
bookRouter.get('/get/:bookId', controller.readBook);
bookRouter.get('/get/', controller.readAll);
bookRouter.patch('/update/:bookId', ValidateSchema(Schemas.book.update), controller.updateBook);
bookRouter.delete('/delete/:bookId', controller.deleteBook);

export = bookRouter;