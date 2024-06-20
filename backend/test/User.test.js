import mongoose from "mongoose";
import { userModel } from "../src/models/user.js";
import Assert from 'assert'

const assert = Assert.strict
await mongoose.connect(`mongodb+srv://baltasar0017:shibuya2018@cluster0.kz1pjdm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)

describe(`Test CRUD de usuarios en la ruta /api/users`, function () {

    //Previo a comenzar todo el test
    before(() => {
        console.log(`Arrancando el test`)
    })

    //Previo a comenzar cada test
    beforeEach(() => {
        console.log(`Comienza el test`)
    })

    it(`Obtener todos los usuarios mediante el metofo GET`, async () => {
        const users = await userModel.find()

        assert.strictEqual(Array.isArray(users), true)
    })

    it(`Obtener un usuario dado su ID mediante el metodo GET`, async () => {
        const user = await userModel.findById('65e112b4b24c73acc6aa8a60')

        //assert.strictEqual(typeof user, 'object')
        assert.ok(user._id)
    })

    it(`Crear un usuario mediante el metodo POST`, async() => {
        const newUser = {
            first_name: "Pablo",
            last_name: "Agustin",
            email: "pablo@agudtin.com",
            password: "9435217935",
            age: 33
        }

        const userCreated = await userModel.create(newUser)

        assert.ok(userCreated._id)
    })

    
    it(`Actualizar un usuario dado un id como parametro mediante el metodo PUT`, async () => {
        const updateUser = {
            first_name: "Fabrizio",
            last_name: "Traghetti",
            email: "fabri@traghetti.com",
            password: "10210003187",
            age: 25
        }

        const userUpdated = await userModel.findByIdAndUpdate('666cc0847e5a17661dac8a09', updateUser)
        assert.ok(userUpdated._id)
    })

    it(`Eliminar un usuario dado un id como parametro mediante el metodo DELETE`, async () => {

        const rta = await userModel.findByIdAndDelete('6621e8c7b2a5fedda4006f48')
        assert.strictEqual(typeof rta, 'object')
    })
})