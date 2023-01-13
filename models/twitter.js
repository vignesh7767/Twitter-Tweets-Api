const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Twitter-API')
    .then(() => console.log('database is connected..!'))
    .catch((err) => console.error(err));

const favoruiteSchema = new mongoose.Schema({
    id: Object,
    keyword: Object,
    author: Object,
    content: Object,
    category: Object
});

const favoruite = new mongoose.model('favoruite', favoruiteSchema);

async function storeTweetInformation(tweet, keyword) {
    const obj = new favoruite({
        id: tweet.id,
        keyword: keyword,
        author: tweet.author,
        content: tweet.content,
        category: tweet.category
    });
    await obj.save();
}

async function fetchAllTweetInformation() {
    const tweets = await favoruite.find({});
    return tweets;
}

async function searchTweetInformation(keyword) {
    const tweets = await favoruite.find({});
    let ar = [];
    for (let tweet of tweets) {
        if(tweet.keyword==keyword) {
            ar.push(tweet);
        } else if (tweet.content) {
            let str = tweet.content[0];
            if (str.includes(keyword))
                ar.push(tweet);
        }
    }
    return ar;
}

async function deleteAllTweets() {
    await favoruite.deleteMany({});
}

async function deleteSpecificTweet(id) {
    await favoruite.deleteOne({ id: id });
}

module.exports = { storeTweetInformation, fetchAllTweetInformation, searchTweetInformation, deleteAllTweets, deleteSpecificTweet };