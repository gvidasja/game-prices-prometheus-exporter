import puppeteer from 'puppeteer'
import qs from 'querystring'
import { PriceScraper, PriceRecord } from './PriceSraper'
import { HtmlScraperBase } from './HtmlScraperBase'
import * as http from '../infra/http'

export class Steam extends HtmlScraperBase implements PriceScraper {
  constructor(browser: puppeteer.Browser) {
    super(browser)
  }

  async getItems(appId: string): Promise<PriceRecord[]> {
    const { body } = await http.get(
      `https://store.steampowered.com/itemstore/${appId}/ajaxgetitemdefs/render/?${qs.encode({
        filter: 'All',
        count: 1000,
      })}`
    )

    const html = JSON.parse(body).results_html

    return super.scrape(html, (page) =>
      page.$$eval(
        '.item_def_grid_item',
        (pageItems) => pageItems.map((x) => {
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
