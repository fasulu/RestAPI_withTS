import Joi, {ObjectSchema} from 'joi';
import { NextFunction, Request, Response } from "express";
import Logging from '../library/Logging';
import { Schema } from 'mongoose';
import { IAuthor } from '../models/Author';
import { IBook } from '../models/Book';

export const ValidateSchema = (Schema:ObjectSchema)=> {
    return async (req:Request, res:Response, next:NextFunction)=> {
        try {
            
            await Schema.validateAsync(req.body);
            next();
        } catch (error) {
            Logging.error(error);
            return res.status(422).json({error});
        }
    };
};

export const Schemas = {
    author:{
        create: Joi.object<IAuthor>({
            name: Joi.string().required()
        }),
        update: Joi.object<IAuthor>({
            name: Joi.string().required()
        }),
    },
    book:{
        create: Joi.object<IBook>({
            author: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)         // regex to allow numbers and a,A to f,F with 24 characters long
            .required(),
            title: Joi.string().required()
        }),
        update: Joi.object<IBook>({
            author: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)         // regex to allow numbers and a,A to f,F with 24 characters long
            .required(),
            title: Joi.string().required()
        }),
    }
};