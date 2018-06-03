const querystring = require('querystring');
const http = require('http');
const fs = require('fs');
const util = require('util');

// API Configuration / Options
const ac = {
    hostname: "localhost",
    port: 8822,
    basePath: "/api/v1",
    matchEndpoint: "/match/%s/%s", // MatchId / EventId
    resultEndpoint: "/match/result/%s/%s/%s", // MatchRoundId, MatchId, parentMatchId
    resultsEndpoint: "/match/results", // requires body (list of int)
    taskEndpoint: "/task/%s" // MatchId
}

const baseUrl = `http://${ac.hostname}:${ac.port}${ac.basePath}`;

exports.get_match = (matchId, eventId = null, callback) => {
    let url = util.format(`${baseUrl}${ac.matchEndpoint}`, matchId, eventId);
    get(url, callback);

}

exports.get_result = (matchRoundId, matchId, parentMatchId = null, callback) => {
    let url = util.format(`${baseUrl}${ac.resultEndpoint}`, matchRoundId, matchId, parentMatchId);
    get(url, callback);
}

exports.get_results = (idList, callback) =>{
    let path = util.format(`${baseUrl}${ac.resultsEndpoint}`);
    post(ac.hostname, ac.port, path, JSON.stringify(idList), callback)
} 

exports.schedule_result_scrape = (matchId, callback) => {
    let path = util.format(`${ac.basePath}${ac.taskEndpoint}`, matchId);
    console.log(path);
    post(ac.hostname, ac.port, path, null, callback);

}


function get(url, callback) {
    http.get(url, (res) => {
        const {
            statusCode
        } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                `Expected application/json but received ${contentType}`);
        }
        if (error) {
            console.error(error.message);
            // consume response data to free up memory
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
            rawData += chunk;
        });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                // console.log(parsedData);
                callback(parsedData);
            } catch (e) {
                console.error(e.message);
            }
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
        callback(null);
    });
}

function post(hostname, port, path, payload, callback) {
    /* console.log(payload); */
    const options = {
        hostname: hostname,
        port: port,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };


    const req = http.request(options, (res) => {
        //console.log(`STATUS: ${res.statusCode}`);
        //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            /* console.log(`BODY: ${chunk}`);   */    
            if(callback){
                callback({status: `${res.statusCode}`, data: `${chunk}`});
            }     
        });
        res.on('end', () => {
            //console.log('No more data in response.');
        });        
        
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    // write data to request body
    req.write(payload);
    req.end();
}