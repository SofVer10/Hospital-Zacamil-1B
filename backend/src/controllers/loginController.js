import doctorsModel from "../models/Doctors.js"
import bcrypt from "bcryptjs"; //Lib. para encriptar
import  JsonWebToken  from "jsonwebtoken"; //Lib. para generar token
import {config} from "../confing.js";


const loginController = {};

loginController.loginDoctors = async (req, res) => {
    const {email, password } = req.body;

    try{

        //Validamos los 2 posibles niveles 
        //1. Admin, 2. Doctores

        let userFound; //Variable para saber si encontramos al usuario
        let userType; //Variable que dice que tipo de usuario es 

        //1. Admin
        //Verifiquemos si quien esta ingresando es admin
        if(email === config.emailAdmin.email && password === config.emailAdmin.password){
            userType = "Admin"
            userFound = {_id: "Admin"}
        }else{
            //2. Doctores
            userFound = await doctorsModel.findOne({email});
            userType = "Doctors";
        }

        //Si no se encuentra al usuario en ningún lado
        if(!userFound){
            return res.json({message: "User not found"})
        }

        //Si no es administrador validamos la contraseña
        if(userType !== "Admin"){
            const isMach = await bcrypt.compare(password, userFound.password);
            if(!isMach){
                return res.json({message: "Invalid password"})
            }
        }

        //Generar token
        JsonWebToken.sign(
            //1. Que voy a guardar
            {id: userFound._id, userType},
            //2. Secreto
            config.JWT.secret,
            //3. Cuando expira
            {expiresIn: config.JWT.expiresIn},
            //4. Función flecha (error, token)
            (error, token) => {
                if(error) console.log(error)
                res.cookie("authToken", token);
            res.json({message: "login successful"})
            }
            )
        }


    catch(error){
        console.log(error)
    }
}
 export default loginController;
