const axios = require("axios");
const cheerio = require("cheerio");
const app = require("express")();
const port = process.env.PORT || 8008;

app.get("/", (req, res) => {
  res.status(200).send("<h1>Ijeri Stock API</h1>");
});
app.get("/:ticker", async (req, res) => {
  const { ticker } = req.params;
  const { key } = req.query;

  if (!ticker || !key) {
    return res
      .status(400)
      .send({ message: "Please provide api key or ticker" });
  }

  try {
    const stockInfo = await Promise.all(["key-statistics"]);
    const url = `https://www.google.com/finance/quote/${ticker}:NASDAQ?hl=en`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const price = $(
      "#yDmH0d > c-wiz.zQTmif.SSPGKf.u5wqUe > div > div.e1AOyf > div > main > div.Gfxi4 > div.yWOrNb > div.VfPpkd-WsjYwc.VfPpkd-WsjYwc-OWXEXe-INsAgc.KC1dQ.Usd1Ac.AaN0Dd.QZMA8b > c-wiz > div > div:nth-child(1) > div > div.rPF6Lc > div > div:nth-child(1) > div > span > div > div"
    )
      .get()
      .map((val) => $(val).text());
    res.send({ data: price });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
  //   res.send("hi");
});
app.listen(port, () => console.log(`server has started on port: ${port}`));
