package main

import (
	"os"
	"strconv"
	"time"
)

func getEnvInt(key string, defaultValue int) int {
	intStr := os.Getenv(key)

	value, err := strconv.Atoi(intStr)

	if len(intStr) == 0 || err != nil {
		return defaultValue
	}

	return value
}

func getEnvString(key string, defaultValue string) string {
	value := os.Getenv(key)

	if len(value) == 0 {
		return defaultValue
	}

	return value
}

func repeat(intervalSeconds int, action func()) {
	ticker := time.NewTicker(time.Second * time.Duration(intervalSeconds))
	defer ticker.Stop()

	action()
	for {
		<-ticker.C
		action()
	}
}
