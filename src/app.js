import express from 'express';
import __dirname  from "./utils.js";
import handlebars from 'express-handlebars';
import messageRouter from './routes/message.router.js';
import mongoose from 'mongoose';
import productRouter from './routes/product.router.js';
import cartsRouter from './routes/carts.router.js';
import cookieParser from 'cookie-parser';
import initializePassport from './config/passport.config.js';
import passport from 'passport';
import userRouter from './routes/user.router.js';
import session from "express-session";
import config from './config/config.js';

const app = express();

mongoose.connect(config.mongoUrl);

app.listen(config.port, ()=> console.log('Listening on port 8080'));

app.use(express.json())

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars');
app.use(cookieParser());
app.use(express.static(__dirname+"/public"))
initializePassport();
app.use(passport.initialize());
app.use(express.urlencoded({extended: true}));

//app.use(passport.session())

app.use(session({
    secret: config.secretKey,
    resave: false,
    saveUninitialized: false
}))


app.use('/api/chat', messageRouter);

app.use("/api/products", productRouter);

app.use('/api/cart', cartsRouter);

app.use("/api/user", userRouter);