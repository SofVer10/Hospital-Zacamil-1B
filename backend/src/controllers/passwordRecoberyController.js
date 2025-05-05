import jsonwebToken from "jsonwebtoken" // token
import bcrypt from "bcryptjs" //Encriptar contraseña
 
import doctorsModel from "../models/Doctors.js";
import { sendEmail, HTMLRecoveryEmail } from "../utils/mailRecoveryPassword.js";
import { config } from "../confing.js";
import { verify } from "crypto";
 

 
//1- Crear un array de funciones
const passwordRecoveryController= {};
 
passwordRecoveryController.requestCode = async (req,res) => {
 
    const {email} = req.body;
 
    try {
        let userFound;
        let userType;
 
        userFound = await doctorsModel.findOne({email})
if(userFound) {
    userType = "doctor"
} 
if(!userFound){
    return res.json ({message: "User not found}"})
}
   
//Generar un código de 6 digitos
 
const code = Math.floor(10000 + Math.random() * 60000).toString()
 
//generar un token
const token = jsonwebToken.sign(
    //1- ¿Qué voy a guardar?
    {
        email,
        code,
        userType,
        verified:false        
    },
    //2- secret key
    config.JWT.secret,
    //3 ¿Cuándo expira?
    {expiresIn: "25m"}
);

res.cookie("tokenRecoveryCode", token, { maxAge: 25 * 60 * 1000 });
 
// Enviamos el correo
await sendEmail(
  email,
  "Password recovery Code",
  `your verification code is ${code}`,
  HTMLRecoveryEmail(code)
);

 
 
res.json ({message: "verification code send"});
 
    } catch (error) {
        console.log(error)
    }
}


//Verificar còdigo que enviaron por correo
passwordRecoveryController.verifyCode = async (req, res) => {
    const  {code} = req.body; 

    try {
        //Obtener el token que esta guardado en cookie
        const token = req.cookies.tokenRecoveryCode;

        //Extraer todos los datos del token
        const decoded = jsonwebToken.verify(token, config.JWT.secret)

        //Comparar el código que esta guardado en el token con el código que el usuario escribió
        if(decoded.code !== code){
            return res.json({message: "Invalid code"});
        }

        //Marcamos el token como verificado (si es correcto)
        const newToken = jsonwebToken.sign(
            //1. ¿Qué vamos a guardar?
            {email: decoded.email, code: decoded.code, usserType: decoded.userType, verified: true},

            //2. secrect key
            config.JWT.secret,

            //3. ¿Cuándo vence?
            {expiresIn: "25m"}

        )

        //Para que también expire la cookie
        res.cookie("tokenRecoveryCode", newToken, {maxAge:25*60*1000});

        res.json({ message: "Code verified successfully"});
        
    } catch (error) {
        console.log("error" + error)
    }
};

//Actualizar nueva contraseña
passwordRecoveryController.newPassword = async(req, res) => {
    const {newPassword} = req.body;

    try {
        //Acceder al token que está en las cookies
        const token =req.cookies.tokenRecoveryCode

        //Decodificar el token
        const decoded = jsonwebToken.verify(token, config.JWT.secret)

        if(!decoded.verified){
            return res.json({message: "Code not verified"});
        }

        let user;
        const {email} = decoded;

        //Encriptar contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10)


        //Guardamos la nueva contraseña en la base de datos
        if(decoded.userType === "client"){
            user = await clientsModel.findByIdAndUpdate(
                {email},
                {password: hashedPassword},
                {new: true}
            )
        }else if (decoded.userType === "employee")(
            {email},
            {password: hashedPassword},
            {new: true}
        )

        res.clearCookie("tokenRecoveryCode")
        res.json({ message: "Password updated"});


    
        
        
    } catch (error) {
        console.log("Error " + error)
    }
}

export default passwordRecoveryController;