import axios from "axios";
import cheerio from "cheerio";

import * as puppeteer from "puppeteer";

interface AntutuProps {
  benchmark: string;
  version: string;
  device: string;
}

const getDataFromAPI = async (device: string): Promise<AntutuProps | null> => {
  const url = `https://www.kimovil.com/pt/${device}/antutu`;

  const headers = {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Encoding": "gzip, deflate, br", // Remova zstd, pois pode não ser suportado pelo Axios
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6",
    "Cache-Control": "max-age=0",
    Referer: `https://www.kimovil.com/pt/${device}`, // URL da página anterior
    "Sec-Ch-Ua":
      '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  };

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      `http://localhost:3001/api/pagina?url=https://www.kimovil.com/pt/${device}/antutu`
    );
    const html = await page.content();
    const $ = cheerio.load(html);

    const antutuScoreElement = $("p.k-h2.k-balance b");
    const antutuVersionElement = $("p.k-h4.gray");

    const antutuScore = antutuScoreElement.text().trim();
    const antutuVersion = antutuVersionElement.text().trim();
    const versionTerms = antutuVersion.match(/\((.*?)\)/g);
    const versionOnly = versionTerms
      ? versionTerms.map((term) => term.replace(/\(|\)/g, ""))
      : [];

    await browser.close();

    console.log("Antutu Score:", antutuScoreElement.text().trim());
    console.log("Antutu Version:", antutuVersion);

    return {
      benchmark: antutuScore,
      version: versionTerms ? versionTerms[0] : "", // Fix: Provide a default value of an empty string when versionTerms is null
      device: device,
    };
  } catch (error) {
    console.error("Erro ao carregar dados do Antutu:", error);
    return null;
  }
};

export default getDataFromAPI;
