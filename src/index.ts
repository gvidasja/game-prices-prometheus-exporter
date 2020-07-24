import express from 'express'
import puppeteer from 'puppeteer'
import { Steam } from './steam'
import prom from 'prom-client'
import { loadConfig } from './config'
import { repeat } from './util'

const {
  PORT = '3000',
  INTERVAL_MINUTES = '1',
  PUPPETEER_NO_SANDBOX = 'false',
  CONFIG_PATH = 'config.yml',
} = process.env

const config = loadConfig(CONFIG_PATH)

main()

async function main() {
  const registry = new prom.Registry()

  const steam = new Steam(
    await puppeteer.launch({
      args: PUPPETEER_NO_SANDBOX === 'true' ? ['--no-sandbox'] : [],
    })
  )

  const scrape = createScraper()

  repeat(
    parseInt(INTERVAL_MINUTES) * 60,
    scrape,
    new prom.Gauge({
      name: 'price',
      help: 'price of item',
      labelNames: ['item', 'type', 'name'],
      registers: [registry],
    })
  )

  express()
    .get('/metrics', async (req, res) => res.send(await registry.metrics()))
    .listen(parseInt(PORT), () => console.log(`Listening on ${PORT}`))

  function createScraper() {
    return async () => {
      const scrapers = config.targets.map(({ id, name, type }) => {
        switch (type) {
          case 'steam_items':
            return (priceGauge: prom.Gauge<'item' | 'type' | 'name'>) =>
              steam
                .getItems(id)
                .then((items) =>
                  items.forEach((item) => priceGauge.labels(item.title, type, name).set(item.price))
                )
        }
      })

      return () => Promise.all(scrapers.map((s) => s()))
    }
  }
}
