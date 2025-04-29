import dotenv from "dotenv";

//Ejecutamos la libreria para acceder a los datos del .env
dotenv.config();

export const config = {
    db: {
        URI: process.env.DATA,
    },
    server: {
        port: process.env.PORT,
    }
}