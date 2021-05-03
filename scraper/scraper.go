package scraper

import "fmt"

type ScrapeResult struct {
	ItemName  string
	ItemPrice float64
	Target    Target
}

func getScraper(target Target) func(target Target, results chan<- ScrapeResult) {
	switch target.Type {
	case "steam_items":
		return getSteamItemPrices
	case "sellfy":
		return getSellfyItemPrices
	default:
		panic(fmt.Sprintf("unknown target type %s", target.Type))
	}
}

func Scrape(config ScrapeConfig, results chan<- ScrapeResult) {
	for _, target := range config.Targets {
		getScraper(target)(target, results)
	}
}
