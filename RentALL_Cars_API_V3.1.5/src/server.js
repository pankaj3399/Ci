import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import expressGraphQL from 'express-graphql';
import PrettyError from 'pretty-error';
import { auth, port, environment } from './config';
import models from './data/models';
import schema from './data/schema';
import pushNotificationRoutes from './libs/pushNotificationRoutes';
import { verifyJWT_MW } from './libs/middleware';
import paypalRoutes from './libs/payment/paypal/paypal';
// import { connection } from './Websocket/connection';
// import { socketPort } from './config';

const app = express();
const __DEV__ = environment;
app.use(compression());

// Middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Authentication
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    next();
});

app.use(expressJwt({
    secret: auth.jwt.secret,
    credentialsRequired: false,
    algorithms: ["HS256"],
    getToken: req => req.headers.authToken,
}));

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.send({
            status: 400,
            errorMessage: 'Invalid auth token provided.'
        });
        next();
    }
});

app.use(verifyJWT_MW);

if (__DEV__) {
    app.enable('trust proxy');
}

pushNotificationRoutes(app);
paypalRoutes(app);

// Express GraphQL 
const graphqlMiddleware = expressGraphQL((req, res) => ({
    schema,
    graphiql: __DEV__,
    rootValue: {
        request: req,
        response: res
    },
    pretty: __DEV__,
}));

app.use('/graphql', graphqlMiddleware);

// Error Handling
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// Server launch
models.sync().catch(err => console.log(err.stack)).then(() => {
    app.listen({ port: port }, () =>
        console.log(`Server ready at http://localhost:${port}`),
    )
});