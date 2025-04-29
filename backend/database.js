import mongoose from "mongoose";

//se importan las variables desde el archivo config.js
import {config} from "./src/confing.js"

//Se conecta la base de datos 
mongoose.connect(config.db.URI)

//Comprobación de que la base de datos funciona
const connection = mongoose.connection;

connection.once("open", () => {
    console.log("Data Base is connected");
});

connection.on("disconnected", () => {
    console.log("Data Base is disconnected");
});

connection.once("error", (error) => {
    console.log("Error found" + error);
});

