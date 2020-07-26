import yaml from 'yaml'
import path from 'path'
import fs from 'fs'

export interface ScrapeConfig {
  targets: ScrapeTarget[]
}

export interface ScrapeTarget {
  type: ScrapeTargetType
  id: string
  name: string
}

export type ScrapeTargetType = 'steam_items' | 'sellfy'

export function loadConfig(configPath: string): ScrapeConfig {
  return yaml.parse(fs.readFileSync(path.resolve(configPath), 'utf-8')) as ScrapeConfig
}
