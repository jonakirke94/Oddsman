process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const db = require('../models');
const helper = require('../test/helper');
const scraper = require('../services/scraper')

const ScraperIsRunning = false; // tick this when not testing scraper

chai.use(chaiHttp);


describe("/SCRAPER API", () => {
    if(ScraperIsRunning){
        it("Should get a match", done => {
            scraper.get_match(51387, 846936, (res) => {
                res.should.be.a("object");
                //console.log(res);
                done();
            });
        });

        it("Should get a result", done => {
            scraper.get_result(458, 289, null, (res) => {
                /* console.log(JSON.stringify(res)); */
                res.should.be.a('object');
                done();
            });
            
        });

        /* it("Should schedule a result scrape", done =>{
            scraper.schedule_result_scrape(289, (res) => {
                res.status.should.be.eql("200");
                res.data.should.be.eql("Job Added Succesfully");
                done();
            });
        }) */

        describe("/GET Results", () => {
            it("it should get all Results with these match ids", done => {                
                scraper.get_results([512, 289], (res) => {
                    const data = JSON.parse(res.data);
                    data.should.be.a('array');
                    data.length.should.eql(2);
                    done();
                });               
            });
        });
    }
});


