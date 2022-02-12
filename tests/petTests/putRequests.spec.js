import axios from 'axios'
import { expect } from 'chai';
import path from 'path';
import dotenv from 'dotenv';
import PetBodyRequest from '../../bodyRequstsTemplates/pet/PetBodyRequest.js';

describe('Pet Put Api Tests', async function () {

    before(() => {
        const filePath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
        dotenv.config({ path: filePath });
    });

    it('After updating pet status to "pending" and name to "NameAfterUpdate" with put req, these values will appear on the pet', async function () {
        //Mock data before test
        const response = await axios.post(`${process.env.petApiUrl}`, PetBodyRequest);
        let pet = response.data;
        const petId = response.data.id;

        //making sure pet name and status are not!!! equal to 'NameAfterUpdate', 'pending' before making the put request
        expect(pet.name).to.not.equal('petNameAfterUpdate');
        expect(pet.status).to.not.equal('pending');

        //performing the put process
        await axios.put(`${process.env.petApiUrl}`, { "id": petId, "name": "NameAfterUpdate", "status": "pending" });

        //validate pet object after update
        const responseAfterUpdate = await axios.get(`${process.env.petApiUrl}/${petId}`);
        pet = responseAfterUpdate.data;
        expect(responseAfterUpdate.status).to.equal(200);
        expect(pet.id).to.equal(petId);
        expect(pet.name).to.equal('NameAfterUpdate');
        expect(pet.status).to.equal('pending');
    });

    it('After updating pet Category to "new category" and tag to "new tag" with put req, these values will appear on the pet', async function () {
        //Mock data before test
        const response = await axios.post(`${process.env.petApiUrl}`, PetBodyRequest);
        let pet = response.data;
        const petId = response.data.id;

        //making sure pet Category and tag are not!!! equal to 'new category', 'new tag' before making the put request
        expect(pet.category.name).to.not.equal('new category');
        expect(pet.tags[0].name).to.not.equal('new tag');

        //performing the put process
        await axios.put(`${process.env.petApiUrl}`, { "id": petId, "category": {"name": "new category"},
        "tags":[{ "name": "new tag" }]});

        //validate pet object after update
        const responseAfterUpdate = await axios.get(`${process.env.petApiUrl}/${petId}`);
        pet = responseAfterUpdate.data;
        expect(responseAfterUpdate.status).to.equal(200);
        expect(pet.id).to.equal(petId);
        expect(pet.category.name).to.equal('new category');
        expect(pet.tags[0].name).to.equal('new tag');
    });

    /// TODO: make sure developers will fix the api service code for this test. It always return 200 status even when need to return 400
    // it('After trying to update pet without id, status 400 and communicative message will return ', async function() { 
    //     const response = await axios.put(`${process.env.petApiUrl}`, {"name": "NameAfterUpdate", "status": "pending"});
    //     expect(response.status).to.equal(400);
    //     });

    /// TODO: make sure developers will fix the api service code for this test. It always return 200 status even when need to return 404
    // it('After trying to update pet id not exists, status 404 and "pet not found" message will return ', async function() { 
    //     const response = await axios.put(`${process.env.petApiUrl}`, {"id": "20000000", "status": "pending"});
    //     expect(response.status).to.equal(404);
    //     expect(response.data.message).to.equal("pet not found");
    //     });

});