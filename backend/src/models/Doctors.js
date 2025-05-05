//PASO 7

//Siempre poner los campos que tiene cada tabla
/*
   Campos:
      name
      especiality
      email
      password 
*/

import { Schema, model } from "mongoose";

const doctorsSchema = new Schema({
    name: {
        type: String,
        require: true,
        maxLength: 100
    },
    especiality: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
},{
    timestamps: true,
    strict: false
})

export default model("Doctors", doctorsSchema)