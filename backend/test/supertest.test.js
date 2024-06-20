import { expect } from 'chai';
import mongoose from "mongoose";
import supertest from 'supertest';
import { describe, it, before, beforeEach, after } from "mocha";
import { __dirname } from '../src/path.js';


await mongoose.connect(`mongodb+srv://baltasar0017:shibuya2018@cluster0.kz1pjdm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);

const jwtToken = '';

const requester = supertest('http://localhost:9000')

describe(`Test CRUD de productos en la ruta api/products`, function () {
    
    it(`Ruta: api/products metodo GET`, async () => {
        const { ok } = await requester.get('/api/products')
        expect(ok).to.be.ok
    })

    it(`Ruta: api/products metodo POST`, async () => {
        const newProduct = {
            title: "Luz neon",
            description: "Luz neon morada",
            stock: "5",
            category: "Luces",
            code: "351943",
            price: "$50.000"
        }


        const {statusCode} = await (await requester.post('/api/products')).set('Authorization', `Bearer ${jwtToken}`).send(newProduct)
    
        expect(statusCode).to.be.equal(201)
    })

    
})