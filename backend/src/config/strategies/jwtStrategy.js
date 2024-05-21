import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { userModel } from "../../models/user.js"
import varenv from "../../dotenv.js";

const cookieExtractor = req => {
    const token = req.cookies ? req.cookies.jwtCookie : {}
    console.log(token)
    return token
}

const jwtOptions = {
    //jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //consulto token desde la peticion
    //jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), desde  las cookies
    secretOrKey: varenv.jwt_secret
}

export const strategyJWT = new JwtStrategy(jwtOptions, async(payload, done) => {
    try {
        const user = await userModel.findById(payload.user._id)
        if(!user) {
            return done(null, false)
        }
        return done(null, user)
    } catch(e) {
        done(e, null)
    }
})