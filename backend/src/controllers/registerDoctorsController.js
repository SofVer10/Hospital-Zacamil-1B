import doctorsModel from "../models/Doctors.js";
import bcryptjs from "bcryptjs"; //Lib. para encriptar
import  JsonWebToken  from "jsonwebtoken"; //Lib. para generar token
import {config} from "../confing.js";


//crear una array de funciones
const registerDoctorsController = {};

registerDoctorsController.registerDoctor = async (req, res) => {

    //pedimos todos los datos
    const {name, especiality, email, password} = req.body;
    


    try{
        //verificamos si el doctor existe
        const existDoctor = await doctorsModel.findOne({email});
        if(existDoctor){
            return res.json({message: "Doctor already exists"});
        }

        //Encriptar constraseña
        const passwordHash = await bcryptjs.hash(password, 10); 
                                                                
        const newDoctors = new doctorsModel({name, 
            especiality, 
            email, 
            password: passwordHash, //para que se mande a llamar la contraseña ya encriptada
            });

            

        await newDoctors.save();
         
        //TOKEN
        JsonWebToken.sign(
            //1. Que voy a guardar
            {id: newDoctors._id},
            //2. Secreto
            config.JWT.secret,
            //3. Cuando expira
            {expiresIn: config.JWT.expiresIn},
            //4. Función flecha (error, token)
            (error, token) => {
                if(error) console.log(error)
                res.cookie("authToken", token)
                res.json({message: "Doctor register successful"})
            }
            );

    }

    catch (error){
        console.log(error)
        res.json({ message: "Error al registrar doctor"});

    }
    
}

export default registerDoctorsController;


