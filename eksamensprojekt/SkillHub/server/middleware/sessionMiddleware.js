import session from "express-session";
import MongoStore from "connect-mongo";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
let client;

const connect = async () => {
    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
      console.log("Connected to MongoDB");
    }
    return client;
  };

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    clientPromise: connect(),
    dbName: process.env.DB_NAME
  }),
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 dag
  }
});

export default sessionMiddleware;
