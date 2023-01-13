const needle = require("needle");
const token = 'AAAAAAAAAAAAAAAAAAAAAB7sdAEAAAAATWzu8ctz%2FhPaUDCxqPnygkcexJk%3DqvvUvHjNrUjXYgQJQDlEs0N1HQ5mv3z0DzIjHFjCntZ91yrqam';

const searchTwitter = async (params, endpointUrl) => {
    const res = await needle('get', endpointUrl, params, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    })

    if (res.body) {
        return res.body;
    } else {
        throw new Error('Unsuccessful request');
    }
};

const getRequest = async (keyword) => {
    const params = {
        'query': keyword,
    }
    const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";
    return searchTwitter(params, endpointUrl);
};

module.exports = {getRequest};