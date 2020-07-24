import yaml from 'yaml'
import path from 'path'
import fs from 'fs'

interface ScrapeConfig {
  targets: ScrapeTarget[]
}

interface ScrapeTarget {
  type: ScrapeTargetType
  id: string
  name: string
}

type ScrapeTargetType = 'steam_items'

export function loadConfig(configPath: string): ScrapeConfig {
  return yaml.parse(fs.readFileSync(path.resolve(configPath), 'utf-8')) as ScrapeConfig
}
