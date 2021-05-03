package scraper

import (
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"strings"

	"github.com/gocolly/colly/v2"
)

func getSteamItemPrices(target Target, results chan<- ScrapeResult) {
	c := colly.NewCollector()

	c.OnHTML(".item_def_grid_item", func(e *colly.HTMLElement) {
		title := strings.Trim(e.DOM.Find(".item_def_name").Text(), " ")

		if priceStr, ok := extractPriceNumberString(e.DOM.Find(".item_def_price").Text()); ok {
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

	filter := "filter=All&count=1000"
	url := fmt.Sprintf("https://store.steampowered.com/itemstore/%s/ajaxgetitemdefs/render/?%s", target.ID, filter)

	c.OnResponse(func(r *colly.Response) {
		if strings.Contains(r.Headers.Get("content-type"), "application/json") {
			body := struct {
				Html string `json:"results_html"`
			}{}

			err := json.Unmarshal(r.Body, &body)

			if err != nil {
				log.Println("Could not deserialize Steam response", err)
			}

			r.Headers.Set("content-type", "text/html")
			r.Body = []byte(body.Html)
		}
	})

	c.Visit(url)
}
