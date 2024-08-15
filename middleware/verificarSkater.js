import jwt from 'jsonwebtoken';
const verificarSkater = async (req, res, next) => {
    try {

        let token;
        if (req.query.token) {
            token = req.query.token
        } else {
            res.render("error", {
                msg: "Debe proporcionar token"
            })
        };

        const decoded = jwt.verify(token, process.env.KEY_TOKEN);

        req.user = decoded;

        next();

    } catch (error) {
        res.render("error",{
            msg:"Error de autentificación, revise sus credenciales y vuelva a intentarlo"
        })
    }
};

export {
    verificarSkater
}