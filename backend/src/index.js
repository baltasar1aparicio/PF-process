import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import cookieParser from 'cookie-parser'

import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'
import messageModel from './models/messages.js'
import orderModel from './models/order.js'
import indexRouter from './routes/index.routes.js'
import initializePassport from './config/passport.js'
import varenv from './dotenv.js'

import { addLogger } from './utils/logger.js'
import { Server } from 'socket.io'
import Handlebars from 'handlebars';
import { engine } from 'express-handlebars'
import { __dirname } from './path.js'
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'




//Configuraciones o declaraciones
const app = express()
const PORT = 9000


//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
const io = new Server(server)

//Connection DB
mongoose.connect(varenv.mongo_url)
    .then(() => console.log("DB is connected"))
    .catch(e => console.log(e))
const resultado = await orderModel.paginate({ status: true }, {limit: 10, page: 1, sort: {price: 'asc'}})   


//Swagger

const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Documentacion de mi Aplicacion',
            description: 'Descripcion de mi documentacion'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)

//Middlewares

app.use(express.json())
app.use(cookieParser(varenv.cookies_secret))
app.engine('handlebars', engine({
    extname: '.handlebars',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(session({
    secret: varenv.session_secret,
    resave: true,
    store: MongoStore.create({
        mongoUrl: varenv.mongo_url,
        ttl: 60 * 60
    }),
    saveUninitialized: true
}))

app.use(addLogger)
initializePassport()

app.use(passport.initialize())
app.use(passport.session())
app.post('/login', (req, res) => {
    const {email, password} = req.body

    if(email == "admin@admin.com" && password == "1234") {
        req.session.email = email
        req.session.password = password
        return res.send("Login")
    }
    res.send("Login invalido")
})

//Routes

app.use('/', indexRouter)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
//Cookies Routes

app.set('/setCookies', (req, res) => {
    res.cookie('cookieCookie', 'Esto es una cookie', {maxAge: 3000000, signed: true}).send(("Cookie creada"))
})
app.get('/getCookies', (req, res) => {
    res.send(req.signedCookies)
})
app.get('/deleteCookie', (req, res) => {
    res.clearCookie('cookieCookie').send("Cookie eliminadad")
    //res.cookie('cookieCookie', '', {expires: new Date(0)})
})

//Sesion Routes

app.get('/session', (req, res) => {
    if(req.session.counter) {
        req.session.counter++
        res.send(`Sos el usuario n° ${req.session.counter}`)
    } else {
        req.session.counter = 1
        res.send("Sos el primer usuario que ingresa a la pagina")
    }
})
io.on('connection', (socket) => {
    console.log(`Conexion con Socket.io`)

    socket.on('mensaje', async (mensaje) => {
        try {
            await messageModel.create(mensaje)
            const mensajes = await messageModel.find()
            io.emit('mensajeLogs', mensajes)
        } catch (e) {
            io.emit('mensajeLogs', e)
        }

    })
})



