const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
// home page 
function processScorecard(url) {

    request(url, cb);
}
function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else {
        // console.log(html);
        extractMatchDetails(html);
    }
}
function extractMatchDetails(html) {
    // Venue date opponent result runs balls fours sixes sr
    // ipl 
    // team 
    //     player 
    //         runs balls fours sixes sr opponent venue date  result
    // venue date 
    // .event .description
    // result ->  .event.status - text
    let $ = cheerio.load(html);
    let descElem = $("div.description");
    let result = $(".event .status-text");
    let stringArr = descElem.text().split(",");
    let venue = stringArr[1];
    let date = stringArr[2];
    result = result.text();
    let innings = $(".card.content-block.match-scorecard-table>.Collapsible");
    // let htmlString = "";
    for (let i = 0; i < innings.length; i++) {
        // htmlString = $(innings[i]).html();
        // team opponent
        let teamName = $(innings[i]).find("h5").text();
        teamName = teamName.split("INNINGS")[0].trim();
        let opponentIndex = i == 0 ? 1 : 0;
        let opponentName = $(innings[opponentIndex]).find("h5").text();
        opponentName = opponentName.split("INNINGS")[0].trim();
        let cInning = $(innings[i]);
        console.log(`${venue}| ${date} |${teamName}| ${opponentName} |${result}`);
        let allRows = cInning.find(".table.batsman tbody tr");
        for (let j = 0; j < allRows.length; j++) {
            let allCols = $(allRows[j]).find("td");
            let isWorthy = $(allCols[0]).hasClass("batsman-cell");
            if (isWorthy == true) {
                // console.log(allCols.text());
                //       Player  runs balls fours sixes sr 
                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let sr = $(allCols[7]).text().trim();
                console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
                processplayer(teamName,playerName,runs,balls,fours,sixes,sr,opponentName,venue,date);
            }
        }
    }
    // console.log(htmlString);
}
function processplayer(teamName,playerName,runs,balls,fours,sixes,sr,opponentName,venue,date){
    let teampath = path.join(__dirname,"ipl",teamName);
    dircreator(teampath);
    let filepath = path.join(teampath,playerName+".xlsx");
    let content = excelreader(filepath,playerName);
    let playerobj={
        teamName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        opponentName,
        venue,
        date
    }
    content.push(playerobj)
    excelwriter(filepath,content,playerName);
}
function dircreator(filepath){
    if (fs.existsSync(filepath)==false){
        fs.mkdirSync(filepath)
    }
}
function excelwriter(filepath,json,sheetname){
    let newWB=xlsx.utils.book_new();
    let newWS=xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB,newWS,sheetname);
    xlsx.writeFile(newWB,filepath);
}
function excelreader(filepath,sheetname){
    if(fs.existsSync(filepath)==false){
        return [];
    }
    let wb = xlsx.readFile(filepath);
    let exceldata = wb.Sheets[sheetname];
    let ans = xlsx.utils.sheet_to_json(exceldata);
    return ans;
}
module.exports = {
    ps: processScorecard
}