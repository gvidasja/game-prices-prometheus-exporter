import express from 'express'
import puppeteer from 'puppeteer'
import { Steam } from './steam'
import prom from 'prom-client'

const { PORT = '3000', INTERVAL_MINUTES = '1', PUPPETEER_NO_SANDBOX = 'false' } = process.env

main()

async function main() {
  const registry = new prom.Registry()

  const steam = new Steam(
    await puppeteer.launch({
      args: PUPPETEER_NO_SANDBOX === 'true' ? ['--no-sandbox'] : [],
    })
  )

  updateMetrics()
  setInterval(updateMetrics, parseInt(INTERVAL_MINUTES) * 60 * 1000)

  express()
    .get('/metrics', async (req, res) => res.send(await registry.metrics()))
    .listen(parseInt(PORT), () => console.log(`Listening on ${PORT}`))

  const priceGauge = new prom.Gauge({
    name: 'price',
    help: 'price of item',
    labelNames: ['item', 'type'],
    registers: [registry],
  })

  async function updateMetrics() {
    const rfactor2Items = await steam.getGameItems(365960)

    rfactor2Items.forEach((item) => priceGauge.labels(item.title, 'rfactor2-dlc').set(item.price))
  }
}
