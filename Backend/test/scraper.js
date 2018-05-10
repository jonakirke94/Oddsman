process.env.NODE_ENV = "test";

const config = require("config");
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const db = require('../models');
const helper = require('../test/helper');
const scraper = require('../services/scraper')

const ScraperIsRunning = false; // tick this when not testing scraper

chai.use(chaiHttp);


describe("/ SCRAPER API", () => {
    if(ScraperIsRunning){
        it("Should get a match", done => {
            scraper.getMatch(52973, 837205, (res) => {
                res.should.be.a("object");
                //console.log(res);
                done();
            });
        });

        it("Should get a result", done => {
            /* scraper.getResult(1, 1, null, (res) => {

            }); */
            done(new Error("Test Not Implemented"));
        });

        it("Should schedule a result scrape", done =>{
            scraper.scheduleResultScrape(44804, (res) => {
                res.status.should.be.eql("200");
                res.data.should.be.eql("Job Added Succesfully");
                done();
            });
        })
    }
});


