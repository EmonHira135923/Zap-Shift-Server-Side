import dotenv from "dotenv";
dotenv.config();
import { MongoClient, ServerApiVersion } from "mongodb";

// uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@zap-shift-project.hazhwfd.mongodb.net/?appName=zap-shift-project";`;

// client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;
let percelCollection;
let paymentCollection;
let usersCollection;

export const connectDB = async () => {
  try {
    await client.connect();
    db = client.db("Zap-Shift-Management-System");
    percelCollection = db.collection("percels");
    paymentCollection = db.collection("payments");
    usersCollection = db.collection("users");
    console.log("MongoDB Connection Successfully");
  } catch (err) {
    console.error("DB Connection Failed", err.message);
    process.exit(1);
  }
};

export const getDB = () => db;
export const getPercel = () => percelCollection;
export const getPayment = () => paymentCollection;
export const getUsers = () => usersCollection;
