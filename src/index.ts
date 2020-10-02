import express from 'express'
import puppeteer from 'puppeteer'
import { Steam } from './scrapers/Steam'
import prom from 'prom-client'
import { loadConfig } from './config'
import { repeat } from './util'
import { CombinedScraper } from './scrapers/CombinedScraper'
import { Sellfy } from './scrapers/Sellfy'

const {
  PORT = '3000',
  INTERVAL_SECONDS = '10',
  PUPPETEER_NO_SANDBOX = 'false',
  CONFIG_PATH = 'config.yml',
} = process.env

main()

async function main() {
  const registry = new prom.Registry()

  const config = loadConfig(CONFIG_PATH)

  const browser = await puppeteer.launch({
    args: PUPPETEER_NO_SANDBOX === 'true' ? ['--no-sandbox'] : [],
  })

  const priceGauge = new prom.Gauge({
    name: 'price',
    help: 'price of item',
    labelNames: ['item', 'type', 'name'],
    registers: [registry],
  })

  const scraper = new CombinedScraper(config, {
    sellfy: new Sellfy(browser),
    steam_items: new Steam(browser),
  })

  repeat(parseInt(INTERVAL_SECONDS), async () => {
    const items = await scraper.getItems()

    items.forEach(({ item, target }) =>
      priceGauge.set({ item: item.title, name: target.name, type: target.type }, item.price)
    )
  })

  express()
    .get('/metrics', async (req, res) => res.send(await registry.metrics()))
    .listen(parseInt(PORT), () => console.log(`Listening on ${PORT}`))
}
