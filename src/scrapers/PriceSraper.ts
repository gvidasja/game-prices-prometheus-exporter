export interface PriceRecord {
  title: string
  price: number
  image: string
}

export interface PriceScraper {
  getItems(pageId: string): Promise<PriceRecord[]>
}
