import axios from 'axios'
import { expect } from 'chai';
import path from 'path';
import dotenv from 'dotenv';
import PetBodyRequest from '../../bodyRequstsTemplates/pet/PetBodyRequest.js';
import PetWrongBodyRequest from '../../bodyRequstsTemplates/pet/PetWrongBodyRequest.js';
import PetPendingStatusBodyRequest from '../../bodyRequstsTemplates/pet/PetBodyRequestWithPendingStatus.js';
import FormData from 'form-data';
import { promises as fs } from "fs";

describe('Pet Post Api Tests', async function() {

    before(() => {
        const filePath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
        dotenv.config({ path: filePath });
    });

    it('Adding pet to store using post request return the right json keys and values format and types', async function() { 
        const response = await axios.post(`${process.env.petApiUrl}`, PetBodyRequest);
        expect(response.data).to.have.keys('category', 'id', 'name', 'photoUrls', 'tags', 'status' );
        expect(response.data.id).to.satisfy(Number.isInteger);
        expect(response.data.name).to.be.string;
        expect(response.data.category).to.have.keys('id', 'name');
        expect(response.data.photoUrls).to.be.an('array');
        expect(response.data.tags).to.be.an('array');
        expect(response.data.tags[0]).to.have.keys('id', 'name');
        expect(response.data.status).to.be.string;
    });

    it('Adding pet to store using post request return status 200 with the expected values', async function() { 
        const response = await axios.post(`${process.env.petApiUrl}`, PetBodyRequest);
        expect(response.status).to.equal(200);
        expect(response.data.name).to.equal(PetBodyRequest.name);
        expect(response.data.category.name).to.equal(PetBodyRequest.category.name);
        expect(response.data.photoUrls).to.deep.equal(PetBodyRequest.photoUrls);
        expect(response.data.tags[0].name).to.equal(PetBodyRequest.tags[0].name);
        expect(response.data.tags[1].name).to.equal(PetBodyRequest.tags[1].name);
        expect(response.data.status).to.equal(PetBodyRequest.status);
    });

    it('Using add post request to pet with specific id should update this pet values', async function() {   
        //Mock data before test
        const response = await axios.post(`${process.env.petApiUrl}`, PetBodyRequest);
        const petId = response.data.id;

        const newName = "Labron";
        const newSatus = 'pending';
        //Making sure that before the id post, new values still not appear
        const getResponseBefore = await axios.get(`${process.env.petApiUrl}/${petId}`);
        expect(getResponseBefore.data.name).to.not.equal(newName);
        expect(getResponseBefore.data.status).to.not.equal(newSatus);

        //Performing the id post request
        await axios.post(`${process.env.petApiUrl}`, {"id": petId, "name": newName, "status": newSatus });

         //Validate that after the post with the id, new values are return
        const getResponseAfter = await axios.get(`${process.env.petApiUrl}/${petId}`);
        expect(getResponseAfter.data.name).to.equal(newName);
        expect(getResponseAfter.data.status).to.equal(newSatus);
    });

    /// TODO: make sure developers will fix the api service code for this test to pass. It always return 200 status even when need to return 400
    //     it('Adding pet to store using wrong body post request should return 405 status', async function() { 
    //     let response = await axios.post(`${process.env.petApiUrl}`, PetWrongBodyRequest);
    //     expect(response.status).to.equal(405);
    // });

    it('After Upload image to pet with post request, status 200 with message contains "File uploaded" text will return', async function() { 

        const response = await axios.post(`${process.env.petApiUrl}`, PetBodyRequest);
        const petId = response.data.id;

        let form = new FormData();
        form.append("additionalMetadata", "dummy");
        const file = await fs.readFile('images/petImage.jpeg');
        form.append("file", file, "petImage.jpeg");

        const UploadImageResponse = await axios.post(`${process.env.petApiUrl}/${petId}/uploadImage`, form, {headers: { "Content-Type": "multipart/form-data", ...form.getHeaders()}} );
        expect(UploadImageResponse.status).to.equal(200);
        expect(UploadImageResponse.data.message).to.contain("File uploaded"); 
    });
});



