import { Browser } from 'puppeteer'
import { HtmlScraperBase } from './HtmlScraperBase'
import { PriceRecord, PriceScraper } from './PriceSraper'
import * as http from '../infra/http'

export class Sellfy extends HtmlScraperBase implements PriceScraper {
  constructor(browser: Browser) {
    super(browser)
  }

  async getItems(appId: string): Promise<PriceRecord[]> {
    const { body: html } = await http.get(`https://sellfy.com/${appId}`)

    return super.scrape(html, (page) =>
      page.$$eval(
        '.product-item',
        (pageItems) => <PriceRecord[]>pageItems.map((x) => {
            const $title = x.querySelector('.product-meta-info')
            const $price = x.querySelector('.price')
            const $image = x.querySelector('.product-image img')

            return {
              title: $title && $title.textContent.trim(),
              price:
                $price &&
                parseFloat(
                  Array.from($price.childNodes)
                    .filter((x) => x.nodeType == Node.TEXT_NODE)
                    .map((x) => x.nodeValue)
                    .join('')
                    .trim()
                    .replace(/free/i, '#0')
                    .substring(1)
                ),
              image: $image && $image.getAttribute('src'),
            }
          })
      )
    )
  }
}
