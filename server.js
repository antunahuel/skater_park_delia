import express from 'express';
import { create } from 'express-handlebars';

import * as path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import viewsSkater from "./routes/skater.routes.js"
import fileUpload from 'express-fileupload';

const app = express();

//handlebars configuración

const hbs = create({
    partialsDir: [
        path.resolve(__dirname, "./views/partials")
    ],
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

app.listen(3000, ()=>{
    console.log("Server listen port http://localhost:3000")
});

//middleware generales

app.use(express.static("public"));
app.use(express.json());
app.use(fileUpload());

//vitas

app.use("/" , viewsSkater);


