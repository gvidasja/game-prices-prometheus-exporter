package logger

import (
	"github.com/prometheus/client_golang/prometheus"
)

var priceGauge = prometheus.NewGaugeVec(prometheus.GaugeOpts{
	Name: "price",
	Help: "price of item",
}, []string{"item", "type", "name"})

func Init() {
	prometheus.MustRegister(priceGauge)
}

func LogMetrics(shopType string, shopName string, itemName string, itemPrice float64) {
	priceGauge.WithLabelValues(itemName, shopType, shopName).Set(itemPrice)
}
