const { render } = require('ejs');
const { request } = require('needle');
const { getRequest } = require('../controllers/twitter');
const { storeKeywordInformation, fetchAllKeywordInformation, deleteAllKeywords } = require('../models/keywords');
const { storeTweetInformation, fetchAllTweetInformation, searchTweetInformation, deleteAllTweets, deleteSpecificTweet } = require("../models/twitter");
const getDetails = require('../utilities/twitter');

module.exports = function (app) {
    let tweets = [];

    app.get("/home", async (req, res) => {
        let keywords = await fetchAllKeywordInformation();
        res.render('home', { keywords});
    })

    app.get("/tweets/starredSuccessfully/:keyword/:id", async function (req, res) {
        const { keyword, id } = req.params;
        const tweet = tweets.find(obj => obj.id == id);
        if (!tweet) res.json({
            error: 'No tweet found'
        })
        else {
            storeTweetInformation(tweet, keyword);
            res.render('starredSuccessfully', { keyword })
        }
    })

    app.get("/tweets/favourites/", async function (req, res) {
        let favourites = await fetchAllTweetInformation();
        res.render('favourites', { favourites });
    })

    app.get("/tweets/favourites/delete/:id", async function (req, res) {
        const { id } = req.params;
        deleteSpecificTweet(id);
        res.render('deletedSuccessfully');
    })

    app.get("/tweets/favourites/deleteAll", async function (req, res) {
        deleteAllTweets();
        res.render('cleared');
    })

    app.get("/tweets/favourites/search/:keyword", async function (req, res) {
        let { keyword } = req.params;
        const favourites = await searchTweetInformation(keyword);
        res.render('searchResults', { favourites, keyword })
    })

    app.get("/tweets/details/:id", async function (req, res) {
        const { id } = req.params;

        const tweet = tweets.find(obj => obj.id == id);

        if (!tweet) {
            res.status(404).json({
                error: 'No tweet found with this ID'
            })
        } else {
            res.render('details', { tweet });
        }
    })

    app.get("/tweets/:query", function (req, res) {
        const query = req.params.query;

        (async () => {
            try {
                const response = await getRequest(query);
                const { data } = response;
                if (!data)
                    res.send("<h1>No Tweets on this word.!</h1>")
                else {
                    let allTweets = [];
                    let tweetCnt = 0, mentionCnt = 0;
                    data.map(function (eachtweet) {
                        let { author, content, category } = getDetails(eachtweet.text);
                        let obj = {
                            id: eachtweet.id,
                            author: author,
                            content: content,
                            category: category,
                            keyword: query
                        };
                        let notPresent = true;
                        for (let x of tweets) {
                            if (x.id == obj.id) {
                                notPresent = false;
                                break;
                            }
                        }
                        if (notPresent)
                            tweets.push(obj);
                        allTweets.push(obj);
                        if (category == "Tweet") tweetCnt++;
                        else mentionCnt++;
                    });
                    const kwd = query;
                    res.render('index', { allTweets, tweetCnt, mentionCnt, kwd })
                }

            } catch (e) {
                process.exit(-1);
            }
        })();

    });

    app.get('/home/addKeyword/', async function (req, res) {
        res.render('AddKeyword')
    })

    app.get('/home/keyword/:kwd/added/', async (req, res) => {
        let { kwd } = req.params;
        storeKeywordInformation(kwd);
        res.render('kwdAdded.ejs');
    })

    app.get('/home/keywords/clear/', async (req, res) => {
        deleteAllKeywords();
        res.render('keywordsCleared');
    })
}