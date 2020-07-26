import puppeteer, { Browser } from 'puppeteer'
import { HtmlScraperBase } from './HtmlScraperBase'
import { PriceRecord, PriceScraper } from './PriceSraper'
import axios from 'axios'

export class Sellfy extends HtmlScraperBase implements PriceScraper {
  constructor(browser: Browser) {
    super(browser)
  }

  async getItems(appId: string): Promise<PriceRecord[]> {
    const { data: html } = await axios.get(`https://sellfy.com/${appId}`)

    return super.scrape(html, (page) =>
      page.$$eval(
        '.product-item',
        (pageItems) => <PriceRecord[]>pageItems.map((x) => ({
            title: x.querySelector('.product-meta-info').textContent.trim(),
            price: parseFloat(
              Array.from(x.querySelector('.price').childNodes)
                .filter((x) => x.nodeType == Node.TEXT_NODE)
                .map((x) => x.nodeValue)
                .join('')
                .trim()
                .replace(/free/i, '#0')
                .substring(1)
            ),
            image: x.querySelector('.product-image img').getAttribute('src'),
          }))
      )
    )
  }
}
