package scraper

import (
	"log"
	"regexp"
	"strings"
)

var numberRegex = regexp.MustCompile(`([\d\.]+)`)

func extractPriceNumberString(str string) (string, bool) {
	str = strings.ReplaceAll(str, ",", ".")
	match := numberRegex.FindStringSubmatch(str)

	if len(match) == 0 {
		log.Println("Could not parse number:", str)
		return "", false
	}

	return match[0], true
}
