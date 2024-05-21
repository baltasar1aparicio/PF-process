import varenv from '../dotenv.js'
import jwt from 'jsonwebtoken'

export const generateToken = (user) => {

    /*
        1°: Objeto de asociacion del token (Usuario)
        2°: Clave privada del cifrado
        3°: Tiempo de expiracion
    */
    const token = jwt.sign({ user }, "coderhouse", { expiresIn: '12h' })
    return token
}

console.log(generateToken({
    "_id": "66021ef240ab63c1a8e7bac7",
    "first_name": "Baltasar",
    "last_name": "Aparicio",
    "password": "adminCod3r123",
    "age": "23",
    "email": "adminCoder@coder.com",
    "rol": "Admin",
    "__v": 0
}))