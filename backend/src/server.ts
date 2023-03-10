import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import {client} from "./discord/discord";
import {getTransactionsByWallet} from "./verification_nft/verify_holder_nft";

const cookieParser = require('cookie-parser');
require('dotenv').config();
const userRoutes = require('./routes/user_routes');



(async () => {
    // Define the port and the path of the graphql endpoint
    const PORT = 4000;
    const API_PATH = '/api';

    // Create the express app
    const app = express();


    // cors is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
    app.use(cors());
    // body-parser is a node.js body parsing middleware. It is responsible for parsing the incoming request bodies in a middleware before you handle it.
    // limit is the maximum request body size. If this is a number, then the value specifies the number of bytes; if it is a string, the value is passed to the bytes library for parsing.
    app.use(bodyParser.json({limit: '501mb'}));
    app.use(cookieParser());

    // Here we define the node server endpoint
    app.listen(PORT, () => {
        console.log(`Node server started on http://localhost:${PORT}`);
    });

    // Here we define the discord client
    await client.login(process.env.BOT_TOKEN).then(() => { console.log("Logged in to Discord") });

    // We test the method getTransactionsByWallet() from the file verify_holder_nft.ts
    getTransactionsByWallet().then((transactions) => console.log(transactions));


    // Here we define the test endpoint
    app.use(API_PATH, userRoutes);


})();


