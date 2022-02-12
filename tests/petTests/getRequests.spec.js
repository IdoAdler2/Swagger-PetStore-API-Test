import axios from 'axios'
import { expect } from 'chai';
import path from 'path';
import dotenv from 'dotenv';
import PetBodyRequest from '../../bodyRequstsTemplates/pet/PetBodyRequest.js';
import PetPendingStatusBodyRequest from '../../bodyRequstsTemplates/pet/PetBodyRequestWithPendingStatus.js';

describe('Pet Get Api Tests', async function () {

    before(() => {
        const filePath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
        dotenv.config({ path: filePath });
    });

    it('Valid Get request will return status 200 with the expected pet properties values', async function () {
        //Mock data before test
        const response = await axios.post(`${process.env.petApiUrl}`, PetBodyRequest);
        let pet = response.data;
        const petId = response.data.id;

        const getResponse = await axios.get(`${process.env.petApiUrl}/${petId}`);
        const data = getResponse.data;

        expect(response.status).to.equal(200);
        expect(response.data.id).to.equal(petId);
        expect(response.data.name).to.equal(PetBodyRequest.name);
        expect(response.data.category.name).to.equal(PetBodyRequest.category.name);
        expect(response.data.photoUrls).to.deep.equal(PetBodyRequest.photoUrls);
        expect(response.data.tags[0].name).to.equal(PetBodyRequest.tags[0].name);
        expect(response.data.tags[1].name).to.equal(PetBodyRequest.tags[1].name);
        expect(response.data.status).to.equal(PetBodyRequest.status);
    });

    it('Invalid Get request (with pet id doesnt exist), will return status 404 with "Pet not found" message', async function () {
        try {
            const getResponse = await axios.get(`${process.env.petApiUrl}/30033030330`);
        }
        catch (err) {
            let apiRes = err.response;
            expect(apiRes.status).to.equal(404);
            expect(apiRes.data.message).to.equal("Pet not found");
        }
        expect(typeof getResponse).to.equal('undefined');
    });

    it('Invalid Get request (without pet id), will return status 405 with "Pet not found" message', async function () {
        try {
            const getResponse = await axios.get(`${process.env.petApiUrl}`);
        }
        catch (err) {
            let apiRes = err.response;
            expect(apiRes.status).to.equal(405);
        }
        expect(typeof getResponse).to.equal('undefined');
    });

    it('"Find by status" Get request should return Pets with this specific status', async function () {
        //create data before test: 1 pet with pending status and 1 with available status
        const response = await axios.post(`${process.env.petApiUrl}`, PetBodyRequest);
        const PetWithAvailbaleStatus = response.data;
        const responseForPendingPet = await axios.post(`${process.env.petApiUrl}`, PetPendingStatusBodyRequest);
        const PetWithPendingStatus = responseForPendingPet.data;

        const getResponse = await axios.get(`${process.env.petApiUrl}/findByStatus?status=pending`);
        expect(getResponse.status).to.equal(200);
        // Expect the availbale status pet will not return
        expect(getResponse.data.map((e) => e['id']).includes(PetWithAvailbaleStatus.id)).to.be.false;
        // Expect the pending status pet to return
        expect(getResponse.data.map((e) => e['id']).includes(PetWithPendingStatus.id)).to.be.true;
    });

    it('"Find by status" Get request works also with multiple statuses filters values', async function () {
        //create date before test: 1 pet with pending status and 1 with available status
        const response = await axios.post(`${process.env.petApiUrl}`, PetBodyRequest);
        const PetWithAvailbaleStatus = response.data;
        const responseForPendingPet = await axios.post(`${process.env.petApiUrl}`, PetPendingStatusBodyRequest);
        const PetWithPendingStatus = responseForPendingPet.data;

        const getResponse = await axios.get(`${process.env.petApiUrl}/findByStatus?status=pending,available`);
        expect(getResponse.status).to.equal(200);
        expect(getResponse.data.map((e) => e['id']).includes(PetWithAvailbaleStatus.id)).to.be.true;
        expect(getResponse.data.map((e) => e['id']).includes(PetWithPendingStatus.id)).to.be.true;
    });
});
