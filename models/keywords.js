const mongoose = require('mongoose');

const keywordSchema = new mongoose.Schema({
    keyword: String
});

const keywords = new mongoose.model('keywords', keywordSchema);

async function storeKeywordInformation(kwd) {
    const keyword = new keywords({
        keyword: kwd
    });
    await keyword.save();
}

async function fetchAllKeywordInformation() {
    const data = await keywords.find({});
    return data;
}

async function deleteAllKeywords() {
    await keywords.deleteMany({});
}

module.exports = {storeKeywordInformation, fetchAllKeywordInformation, deleteAllKeywords};