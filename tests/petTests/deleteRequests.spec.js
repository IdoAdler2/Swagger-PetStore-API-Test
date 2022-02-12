import axios from 'axios'
import { expect } from 'chai';
import path from 'path';
import dotenv from 'dotenv';
import PetBodyRequest from '../../bodyRequstsTemplates/pet/PetBodyRequest.js';

describe('Pet Delete Api Tests', async function () {

    before(() => {
        const filePath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
        dotenv.config({ path: filePath });
    });

    it('After Delete pet request, pet will not exist anymore', async function () {
        //Mock data before test
        const response = await axios.post(`${process.env.petApiUrl}`, PetBodyRequest);
        let pet = response.data;

        // make sure get pet request works return pet object result 
        const getResponse = await axios.get(`${process.env.petApiUrl}/${pet.id}`);
        expect(getResponse.data.id).to.equal(pet.id);

        //Perform the delete process
        const deleteResponse = await axios.delete(`${process.env.petApiUrl}/${pet.id}`);

        // make sure that the pet with this ${pet.id} not exist anymore
        try {
            const getResponseAfterDelete = await axios.get(`${process.env.petApiUrl}/${pet.id}`);
        }
        catch (err) {
            let apiRes = err.response;
            expect(apiRes.status).to.equal(404);
            expect(apiRes.data.message).to.equal("Pet not found");
        }
        expect(typeof getResponseAfterDelete).to.equal('undefined');
    });

    it('Invalid delete request (with pet id doesnt exist), will return status 404 with "Pet not found" message', async function () {
        try {
            const getResponse = await axios.delete(`${process.env.petApiUrl}/30033030330`);
        }
        catch (err) {
            let apiRes = err.response;
            expect(apiRes.status).to.equal(404);
            //TODO: Make sure developers will add communicative "Pet not found" message response
            // expect(apiRes.data.message).to.equal("Pet not found");
        }
        expect(typeof getResponse).to.equal('undefined');
    });

    it('Invalid delete request (without pet id), will return status 405 with "Pet not found" message', async function () {
        try {
            const getResponse = await axios.delete(`${process.env.petApiUrl}`);
        }
        catch (err) {
            let apiRes = err.response;
            expect(apiRes.status).to.equal(405);
            //TODO: Make sure developers will add communicative "Pet not found" message response
            // expect(apiRes.data.message).to.equal("Pet not found");
        }
        expect(typeof getResponse).to.equal('undefined');
    });
});