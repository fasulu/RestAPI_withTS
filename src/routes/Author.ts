import express from 'express';
import controller from '../controllers/Author';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const authorRouter = express.Router();

authorRouter.post('/create', ValidateSchema(Schemas.author.create), controller.createAuthor);
authorRouter.get('/get/:authorId', controller.readAuthor);
authorRouter.get('/get/', controller.readAll);
authorRouter.patch('/update/:authorId', ValidateSchema(Schemas.author.update), controller.updateAuthor);
authorRouter.delete('/delete/:authorId', controller.deleteAuthor);

export = authorRouter;