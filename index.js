import express from "express"
import dotenv from "dotenv"
dotenv.config();
import { initApp } from "./src/utils/initApp.js";


app.set("case sensitive routing",true)
const app = express();


initApp(app,express)