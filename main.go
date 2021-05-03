package main

import (
	"fmt"
	"net/http"

	"github.com/gvidasja/game-prices-prometheus-exporter/logger"
	"github.com/gvidasja/game-prices-prometheus-exporter/scraper"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func main() {
	intervalSeconds := getEnvInt("SCRAPE_INTERVAL_SECONDS", 10)
	port := getEnvInt("PORT", 3000)
	configFile := getEnvString("SCRAPE_CONFIG", "./config.yml")

	config, err := scraper.Init(configFile)
	logger.Init()

	if err != nil {
		panic(errors.Wrap(err, "Could not initialize scraper"))
	}

	results := make(chan scraper.ScrapeResult)

	go repeat(intervalSeconds, func() {
		scraper.Scrape(config, results)
	})

	go func() {
		for {
			result := <-results
			logger.LogMetrics(result.Target.Type, result.Target.Name, result.ItemName, result.ItemPrice)
		}
	}()

	http.Handle("/metrics", promhttp.Handler())
	http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
}
