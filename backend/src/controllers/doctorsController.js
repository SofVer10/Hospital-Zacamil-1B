//array de funciones del CRUD
const doctorsController = {};
import doctorsModel from "../models/Doctors.js";

//S E L E C T
doctorsController.getDoctors = async (req, res) => {
    const doctors = await doctorsModel.find();
    res.json(doctors)
}

// I N S E R T se hace desde el login


// U P D A T E 
doctorsController.updateDoctors = async (req, res) => {
    const {name, especiality, email, password} = req.body;
    const updateDoctors = await  employeesModel.findByIdAndUpdate(
        req.params.id, {name, especiality, email, password}, {new : true}
    );
    res.json({message: "Doctors updated"});
}
           
// D E L E T E
doctorsController.deleteDoctors = async (req, res) => {
    await doctorsModel.findByIdAndDelete(req.params.id);
    res.json({message: "Doctors deleted"})

}

export default doctorsController;