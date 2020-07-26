import { ScrapeConfig, ScrapeTarget, ScrapeTargetType } from '../config'
import { PriceScraper, PriceRecord } from './PriceSraper'

export class CombinedScraper {
  private scrapers: [PriceScraper, ScrapeTarget][]

  constructor(config: ScrapeConfig, scraperMap: Record<ScrapeTargetType, PriceScraper>) {
    this.scrapers = config.targets.map((target) => [scraperMap[target.type], target])
  }

  async getItems(): Promise<{ item: PriceRecord; target: ScrapeTarget }[]> {
    const items = await Promise.all(
      this.scrapers.map(async ([scraper, target]) => {
        const items = await scraper.getItems(target.id)

        return items.map((item) => ({ item, target }))
      })
    )

    return items.flat()
  }
}
