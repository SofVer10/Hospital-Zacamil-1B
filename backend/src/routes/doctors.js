import express from "express";
import doctorsController from "../controllers/doctorsController.js";

const router = express.Router();

router.route("/")
.get(doctorsController.getDoctors)

router.route("/:id")
.put(doctorsController.updateDoctors)
.delete(doctorsController.deleteDoctors);

export default router;