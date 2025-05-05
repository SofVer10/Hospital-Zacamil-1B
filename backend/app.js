//Importar la libreia de express
import express from "express";

import doctorsRoutes from "./src/routes/doctors.js"
import loginRoutes from "./src/routes/login.js"
import registerDoctorRoutes from "./src/routes/registerDoctor.js"
import logoutRoutes from "./src/routes/logout.js"
import cookieParser from "cookie-parser";
import passwordRecoveryRoutes from "./src/routes/passwordRecovery.js"







//constate = libreria que importa y ejecuta
const app = express();
app.use(cookieParser());
app.use (express.json());

app.use("/api/doctors", doctorsRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/registerDoctor", registerDoctorRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/passwordRecovery", passwordRecoveryRoutes);




export default app;