import { Browser, Page } from 'puppeteer'
import { PriceRecord } from './PriceSraper'

export abstract class HtmlScraperBase {
  constructor(private browser: Browser) {}

  protected async scrape(
    html: string,
    scraper: (page: Page) => PriceRecord[] | Promise<PriceRecord[]>
  ) {
    const page = await this.browser.newPage()
    await page.setContent(html)
    const result = await scraper(page)
    await page.close()
    return result
  }
}
