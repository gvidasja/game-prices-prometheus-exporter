import puppeteer from 'puppeteer'
import axios from 'axios'
import qs from 'querystring'
import { PriceScraper, PriceRecord } from './PriceSraper'
import { HtmlScraperBase } from './HtmlScraperBase'

export class Steam extends HtmlScraperBase implements PriceScraper {
  constructor(browser: puppeteer.Browser) {
    super(browser)
  }

  async getItems(appId: string): Promise<PriceRecord[]> {
    const {
      data: { results_html: html },
    } = await axios.get(
      `https://store.steampowered.com/itemstore/${appId}/ajaxgetitemdefs/render/?${qs.encode({
        filter: 'All',
        count: 1000,
      })}`
    )

    return super.scrape(html, (page) =>
      page.$$eval(
        '.item_def_grid_item',
        (pageItems) => <PriceRecord[]>pageItems.map((x) => {
            const $title = x.querySelector('.item_def_name')
            const $price = x.querySelector('.item_def_price')
            const $image = x.querySelector('.item_def_icon')

            return {
              title: $title && $title.textContent.trim(),
              price: $price && parseFloat($price.textContent.trim().replace(',', '.') || ''),
              image: $image && $image.getAttribute('src'),
            }
          })
      )
    )
  }
}
