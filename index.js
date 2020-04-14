const cheerio = require("cheerio");
const rp = require("request-promise");
const { parse } = require("json2csv");
const fs = require("fs");
const writeStream = fs.createWriteStream("movies.csv");

// writeStream.write(`Title, Rating\n`);

let url = "https://www.imdb.com/chart/top/";

(async () => {
  let data = [];
  const response = await rp({
    uri: url,
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9,hi;q=0.8",
    },
    gzip: true,
  });

  const $ = cheerio.load(response);
  let titles = [];
  let ratings = [];
  let moviesList = [];
  $(".titleColumn").each((i, el) => {
    let title = $(el).text().trim();
    title = title.replace(/(\r\n|\n|\r)/gm, "");
    title = title.replace(/\s\s+/g, "");
    title = title.replace(/[0-9]+[.]/g, "");
    titles.push(title);
  });

  $(".imdbRating").each((i, el) => {
    let rating = $(el).text().trim();
    ratings.push(rating);
  });
  //   console.log(titles);
  //   console.log(ratings);

  moviesList = titles.map((t, i) => {
    return {
      title: t,
      rating: ratings[i],
    };
  });

  //Parse
  const csv = parse(moviesList);

  fs.writeFileSync("./movies.csv", csv, "utf-8");
  //console.log(csv);
  console.log("Done...");

  //   console.log(moviesList);
  // let titles = [...titlesArray].map((data) => {
  //   return $(data).text().trim();
  // });
})();
