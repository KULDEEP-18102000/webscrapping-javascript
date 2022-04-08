const url = "https://2021.t20worldcup.com/match/32361";
// Venue date opponent result runs balls fours sixes sr
const request = require("request");
const cheerio = require("cheerio");

request(url, function (err, response, html) {
    if (err) {
        console.log(err);
    }
    else {
        extractMatchDetails(html);
    }
})

function extractMatchDetails(html) {
    
    let $ = cheerio.load(html);
    // let descElem = $(".event .description");
    let result = $("div.mc-scorebox__outcome.mc-scorebox__outcome--live.js-outcome.js-scorebox-update-content").text().trim();
    // let stringArr = descElem.text().split(",");
    let venue = $("span.mc-scorebox__date.u-hide-phablet").text();
    let date = $("span.mc-scorebox__ms-venue").text();
    // console.log(venue);
    // console.log(date);
    // console.log(result);
    
    let allRows = $("div.mc-scorecard__innings.js-innings-tab.is-active table.mc-scorecard__table.t-OMA tbody tr").text().trim();
    // innings=innings([0:12]);
    for (let i = 0; i <(allRows.length-2); i++){
        let allCols = $(innings[i]).find("td.table-body__cell.mc-scorecard__cell.strong");
        let playerName = $(allCols[0]).text().trim();
        let runs = $(allCols[2]).text().trim();
        let balls = $(allCols[3]).text().trim();
        let fours = $(allCols[5]).text().trim();
        let sixes = $(allCols[6]).text().trim();
        let sr = $(allCols[7]).text().trim();
        console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
    }
    
}