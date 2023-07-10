import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/Logging';
import authorRoutes from './routes/Author';
import bookRoutes from './routes/Book';

const router = express();

// connect to mongo server

mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        // console.log('Connected');
        Logging.info('Connected to mongoDB');
        StartServer();
    })
    .catch((error) => {
        // console.log(error);
        Logging.error('Unable to connect: ');
        Logging.error(error);
    });

// Start the server only if Mongo connects 

const StartServer = () => {
    router.use((req, res, next) => {
        // log the request
        Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            // log the response
            Logging.info(`Outgoing -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    // Rules of our API

    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Headers', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        };
        next();
    });

    // Routes

    router.use('/authors', authorRoutes);
    router.use('/books', bookRoutes);

    // Health check - To check route working properly

    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    // Error handling

    router.use((req, res, next) => {
        const error = new Error('not found');
        Logging.error(error);

        return res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () => Logging.info(`Server running on port ${config.server.port}.`));
};