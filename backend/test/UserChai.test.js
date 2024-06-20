import { expect } from 'chai';
import { describe, it, before, beforeEach, after } from "mocha";
import mongoose from "mongoose";
import { userModel } from "../src/models/user.js";

//Conexion a BDD

before(async function() {
    await mongoose.connect(`mongodb+srv://baltasar0017:shibuya2018@cluster0.kz1pjdm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
    console.log(`Conexión a la base de datos establecida`);
});

//Cierre de conexion a BDD

after(async function() {
    await mongoose.connection.close();
    console.log(`Conexión a la base de datos cerrada`);
});

//TEST
describe(`Test CRUD de usuarios en la ruta /api/users`, function () {

    //Previo a comenzar todo el test
    before(() => {
        console.log(`Se inicia entorno de test`)
    })

    //Previo a comenzar cada test
    beforeEach(() => {
        console.log(`Comienza el test`)
    })

    it(`Obtener todos los usuarios mediante el metodo GET`, async () => {
        const users = await userModel.find()


        //expect(users).equal([])
        expect(Array.isArray(users)).to.be.ok //Si es verdadero
        //expect(users).not.to.be.deep.equal([]) //Que el interior del array no sea igual a array vacío)
    })

    it(`Obtener un usuario dado su ID mediante el metodo GET`, async () => {
        const user = await userModel.findById('66021ef240ab63c1a8e7bac7')

        expect(user).to.have.property('_id')
    })

    it(`Crear un usuario mediante el metodo POST`, async () => {
        const newUser = {
            first_name: "ludovica",
            last_name: "pasion",
            email: "ludovica@pasion.com",
            password: "96435821",
            age: 60
        }

        const userCreated = await userModel.create(newUser)

        expect(userCreated).to.have.property('_id')
    })


    it(`Actualizar un usuario dado un id como parametro mediante el metodo PUT`, async () => {
        const updateUser = {
            first_name: "Enzito",
            last_name: "Fernandez",
            email: "enzo@fernandez.com",
            password: "6913131111",
            age: 24
        }

        const userUpdated = await userModel.findByIdAndUpdate('666cc0847e5a17661dac8a09', updateUser)
        expect(userUpdated).to.have.property('_id')
    })

    it(`Eliminar un usuario dado un id como parametro mediante el metodo DELETE`, async () => {

        const rta = await userModel.findByIdAndDelete('666cdddc8a680f5106bc9f38')
        expect(rta).to.be.ok
    })
})