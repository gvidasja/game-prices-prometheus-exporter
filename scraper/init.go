package scraper

import (
	"io/ioutil"

	"github.com/pkg/errors"

	"gopkg.in/yaml.v2"
)

type ScrapeConfig struct {
	Targets []Target `yaml:"targets"`
}

type Target struct {
	Type string `yaml:"type"`
	ID   string `yaml:"id"`
	Name string `yaml:"name"`
}

func Init(path string) (ScrapeConfig, error) {
	config := ScrapeConfig{}

	bytes, err := ioutil.ReadFile(path)

	if err != nil {
		return config, errors.Wrap(err, "Could not read scraper config")
	}

	yaml.Unmarshal(bytes, &config)

	return config, nil
}
