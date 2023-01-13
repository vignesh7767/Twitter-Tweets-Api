function getAuthor(tweet) {
    let word = "";
    let flag = false;
    for(let ch of tweet) {
        if(ch==':'||ch==" "&&flag) break;
        if(ch=='@') {
            flag=true;
            continue;
        }
        if(flag) word = word + ch;
    }
    return word;
}

function removeAuthor(tweet) {
    let word = "";
    let prev = ' ';
    let flag=false;
    for(let ch of tweet) {
        if(prev==':' && ch==' ' || ch==" "&&flag) {
            flag=true;
            continue;
        }
        if(flag) word+=ch;
        prev=ch;
    }
    return word;
}

function getContent(tweet) {
    let sentence = [];
    sentence = tweet.split("\n");
    sentence = sentence.filter(word=>word.length!=0);
    sentence[0] = removeAuthor(sentence[0])
    return sentence;
}

function getCategory(content) {
    console.log(content[0])
    if(content[0][0]=='@') return "Retweet";
    return "Tweet";
}

module.exports = function getDetails(tweet) {
    let content = getContent(tweet);
    let obj= {
        author: getAuthor(tweet),
        content: getContent(tweet),
        category: getCategory(tweet)
    };
    console.log(obj);
    return obj;
};