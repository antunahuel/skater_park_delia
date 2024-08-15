import { Router } from "express";
import controllSkater from "../controlls/skater.contolls.js";
import { verificarSkater } from "../middleware/verificarSkater.js";

const router = Router();

router.get("/", (req,res)=>{
    res.render("home");
});

router.get("/participantes", verificarSkater, controllSkater.getSakater);

router.get("/registro", controllSkater.getRegistro);

router.get("/admin", verificarSkater, controllSkater.adminAccess);

router.get("/login", controllSkater.getLogin);

router.get("/actualizar", controllSkater.getChangeSkater);

//endpoint

router.post("/api/v1/registro", controllSkater.addSkater);

router.post("/api/v1/skaters/login", controllSkater.loginSkater);

router.put("/api/v1/change/participante", controllSkater.updateDataSkater);

router.put("/api/v1/skater/admin/:id", controllSkater.updateEstado);

export default router;