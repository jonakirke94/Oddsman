const querystring = require('querystring');
const http = require('http');
const fs = require('fs');
const util = require('util');

// API Configuration / Options
const ac = {
    hostname: "localhost",
    port: 53649,
    basePath: "/api/v1",
    matchEndpoint: "/match/%s/%s", // MatchId / EventId
    resultEndpoint: "/match/result/%s/%s/%s", // MatchRoundId, MatchId, parentMatchId
    taskEndpoint: "/task/%s" // MatchId
}

const baseUrl = `http://${ac.hostname}:${ac.port}${ac.basePath}`;

exports.getMatch = (matchId, eventId = null, callback) => {
    let url = util.format(`${baseUrl}${ac.matchEndpoint}`, matchId, eventId);
    get(url, callback);

}

exports.getResult = (matchRoundId, matchId, parentMatchId = null, callback) => {
    let url = util.format(`${baseUrl}${ac.resultEndpoint}`, matchRoundId, matchId, parentMatchId);
    get(url, callback);
}

exports.scheduleResultScrape = (matchId, callback) => {
    let path = util.format(`${ac.basePath}${ac.taskEndpoint}`, matchId);
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
    });
}

function post(hostname, port, path, payload, callback) {
    const postData = querystring.stringify(payload);

    const options = {
        hostname: hostname,
        port: port,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };


    const req = http.request(options, (res) => {
        //console.log(`STATUS: ${res.statusCode}`);
        //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            //console.log(`BODY: ${chunk}`);      
            callback({status: `${res.statusCode}`, data: `${chunk}`});     
        });
        res.on('end', () => {
            //console.log('No more data in response.');
        });        
        
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    // write data to request body
    req.write(postData);
    req.end();
}