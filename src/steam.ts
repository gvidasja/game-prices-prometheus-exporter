import puppeteer from 'puppeteer'
import axios from 'axios'
import qs from 'querystring'

export class Steam {
  constructor(private browser: puppeteer.Browser) {}

  async getGameItems(appId: number) {
    const page = await this.browser.newPage()

    const {
      data: { results_html: html },
    } = await axios.get(
      `https://store.steampowered.com/itemstore/${appId}/ajaxgetitemdefs/render/?${qs.encode({
        filter: 'All',
        count: 1000,
      })}`
    )

    await page.setContent(html)

    const appItems = await page.$$eval('.item_def_grid_item', (pageItems) =>
      pageItems.map((x) => ({
        title: x.querySelector('.item_def_name')?.textContent?.trim(),
        price: parseFloat(
          x.querySelector('.item_def_price')?.textContent?.trim().replace(',', '.') || ''
        ),
        image: x.querySelector('.item_def_icon')?.getAttribute('src'),
      }))
    )

    page.close()

    return appItems
  }
}
