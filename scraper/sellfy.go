package scraper

import (
	"fmt"
	"log"
	"strconv"
	"strings"

	"github.com/gocolly/colly/v2"
)

func getSellfyItemPrices(target Target, results chan<- ScrapeResult) {
	c := colly.NewCollector()

	c.OnHTML(".product-item", func(e *colly.HTMLElement) {
		title := strings.Trim(e.DOM.Find(".meta-content .title").Text(), " ")

		if priceStr, ok := extractPriceNumberString(e.DOM.Find(".price").Text()); ok {
			price, err := strconv.ParseFloat(priceStr, 64)

			if err != nil {
				log.Println("Could not parse price", err)
			}

			results <- ScrapeResult{
				Target:    target,
				ItemName:  title,
				ItemPrice: price,
			}
		}
	})

	c.Visit(fmt.Sprintf("https://sellfy.com/%s", target.ID))
}
