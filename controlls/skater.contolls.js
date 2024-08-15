import jwt from "jsonwebtoken";
import db from "../db/config.js";

import * as path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//vistas
const getSakater = async(req,res)=>{
    try {

        let userSkater = await db.query('SELECT id, nombre, anos_experiencia, especialidad, foto_perfil, estado FROM skater WHERE id=$1',
            [req.user.id]);


        let consulta = {
            text:'SELECT id, nombre, anos_experiencia, especialidad, foto_perfil, estado FROM skater ORDER BY id',
            values:[]
        }

        let { rows } = await db.query(consulta);

        let skater = rows;
        let user = userSkater.rows[0];

        res.render("participantes",{
            skater,
            user
        });
        
    } catch (error) {
        console.log(error);
        res.render("participantes",{
            error:"Se ha producido un error al intentar acceder a datos de Skaters"
        })
    }
};


const getRegistro = async(req,res)=>{
    try {
        res.render("register");
        
    } catch (error) {
        console.log(error);
        res.render("participantes",{
            error:"Se ha producido un error al intentar acceder a datos de Skaters"
        });
    }
};

const getLogin = async (req,res)=>{
    try {
        res.render("login");

    } catch (error) {
        console.log(error);
        res.render("participantes",{
            error:"Se ha producido un error al intentar inciar sesión"
        });
    }
};

const getChangeSkater = async(req,res)=>{
    try {
        res.render("actualizarDatos");
    } catch (error) {
        console.log(error);
        res.render("participantes",{
            error:"Se ha producido un error al intentar acceder a realizar cambios de usuario"
        });
    }
}

const adminAccess = async(req,res)=>{
    try {
    
        let consulta = {
            text:'SELECT admin FROM skater WHERE id=$1',
            values: [req.user.id]
        }

        let results = await db.query(consulta);

        let skaterAdmin = results.rows[0].admin;

        if(skaterAdmin==false){
            return res.render("admin",{
                error:"No posee los permisos necesarios para acceder a administración de skaters"
            })
        };

        let { rows: skaters } = await db.query("SELECT id, nombre, anos_experiencia, especialidad, foto_perfil FROM skater ORDER BY id");

        res.render("admin",{
            skaters
        })
    } catch (error) {
        console.log(error);
        res.render("admin",{
            error:"No fue posible cargar datos de skaters, intente más tarde"
        })
    }
};

//enpoints

const addSkater = async(req,res)=>{
    try {
        let { nombre, email, password, anos_experiencia, especialidad } = req.body;
        
        let img_perfil = req.files?.foto_perfil;

        if(!nombre || !email || !password || !anos_experiencia || !especialidad){
            return res.status(400).json({
                msg:"Debe proporcionar todos los datos para realizar registro de usuario"
            })
        }else if(!img_perfil){
            return res.status(400).json({
                msg:"Debe proporcionar imagen de perfil para realizar registro de usuario"
            });
        }

        if(img_perfil.mimetype.split("/")[0] != "image"){
            return res.status(400).json({
                msg:"Solo se pueden cargar archivos de imagenes, intente nuevamente"
            })
        };

        let name_img = img_perfil.name;
        
        //ruta folder

        let rutaFile = path.resolve(__dirname, "../public/assets/img/imgUsers",name_img);
       
        img_perfil.mv(rutaFile,(error)=>{
            if(error){
                return res.status(500).json({
                    msg:"Error al intentar cargar imagen al servidor"
                });
            }
        })

        //cargando base de datos

        db.query("INSERT INTO skater (nombre, email, password, anos_experiencia, especialidad, foto_perfil) VALUES ($1, $2, $3, $4, $5, $6)",
            [nombre, email, password, anos_experiencia, especialidad, name_img]
        )
        
        res.json({
            msg:"datos cargados con exito"
        });
        
    } catch (error) {
        console.log(error);
        res.render("participantes",{
            error:"Se ha producido un error al intentar acceder a datos de Skaters"
        });
    }
};

const updateDataSkater = async(req,res)=>{
    try {

        let { id, nombre, anos_experiencia, especialidad} = req.body;

        if(!id || !nombre || !anos_experiencia || !especialidad){
            return res.status(400).json({
                msg:"Debe completar todos los campos requeridos para realizar los cambios"
            })
        };

        await db.query('UPDATE skater SET nombre = $1, anos_experiencia = $2, especialidad = $3 WHERE id= $4 RETURNING *',
            [nombre, anos_experiencia, especialidad, id]
        );

         let { rows } = await db.query('SELECT nombre, anos_experiencia, especialidad FROM skater WHERE id=$1', [id] );

        let skater = rows[0];

        res.json({
            msg:"Cambios realizados con éxito",
            skater
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:"Se produjo error al intentar actualizar datos skater en el servidor"
        })
    }
};

const loginSkater = async(req,res)=>{
    try {
        let {email, password} = req.body;

        if(!email ||!password){
            return res.status(400).json({
                msg:"Ingrese los datos requeridos para iniciar sesión"
            })
        };

        let { rows: skater} = await db.query('SELECT id, nombre, email FROM skater WHERE email=$1 AND password = $2',
            [email, password]
        )

        let user= skater[0]

        if(!user){
            return res.status(400).json({
                msg: "Las credenciales ingresadas corresponde a un usuario no registrado"
            });
        };

        //creando token

        const token = jwt.sign(user, process.env.KEY_TOKEN);

        res.json({
            msg:"Sesión Iniciada con éxito",
            user,
            token  
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:"Ha ocurrido un error al intentar inciciar sesión"
        })
    }
};

const updateEstado = async(req,res)=>{
    try {
        let {id}=req.params;
        
        let { rows } = await db.query('SELECT estado FROM skater WHERE id=$1',[id]);

        let estadoSkater = rows[0];

        if(!estadoSkater){
            return res.status(404).json({
                msg: "No fue posible encontrar skater para efectuar cambios"
            })
        };

        let estado = !estadoSkater.estado;

        await db.query('UPDATE skater SET estado = $1 WHERE id = $2 RETURNING *', [estado, id]);
        
        res.json({
            msg:"cambios realizados con éxito"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:"Ha ocurrido un error al intentar actualizar estado de usuarios"
        });
    }
}
let controllSkater = {
    getSakater,
    getRegistro,
    addSkater,
    adminAccess,
    updateDataSkater,
    getLogin,
    loginSkater,
    getChangeSkater,
    updateEstado
}

export default controllSkater;