import os from 'os';
import path from 'path';
import fs from 'fs/promises';

const CONFIG_PATH = path.join(os.homedir(), '.googlenews-cli-config.json');

const DEFAULT_CONFIG = {
  region: 'US',
  language: 'en-US',
  ceid: 'US:en',
  regionName: 'United States (English)',
  searchHistory: []
};

export const REGIONS = [
  { name: 'United States (English)', region: 'US', language: 'en-US', ceid: 'US:en' },
  { name: 'United Kingdom (English)', region: 'GB', language: 'en-GB', ceid: 'GB:en' },
  { name: 'India (English)', region: 'IN', language: 'en-IN', ceid: 'IN:en' },
  { name: 'India (Hindi)', region: 'IN', language: 'hi', ceid: 'IN:hi' },
  { name: 'France (French)', region: 'FR', language: 'fr', ceid: 'FR:fr' },
  { name: 'Germany (German)', region: 'DE', language: 'de', ceid: 'DE:de' },
  { name: 'Canada (English)', region: 'CA', language: 'en-CA', ceid: 'CA:en' },
  { name: 'Canada (French)', region: 'CA', language: 'fr-CA', ceid: 'CA:fr' },
  { name: 'Australia (English)', region: 'AU', language: 'en-AU', ceid: 'AU:en' },
  { name: 'Japan (Japanese)', region: 'JP', language: 'ja', ceid: 'JP:ja' }
];

/**
 * Loads the user configuration from the home directory.
 * Falls back to default config if none exists or if it fails to parse.
 */
export async function loadConfig() {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch (error) {
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Saves the user configuration to the home directory.
 */
export async function saveConfig(config) {
  try {
    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Adds a query to search history and keeps it capped at 10 items.
 */
export async function addToSearchHistory(query) {
  if (!query || !query.trim()) return;
  const config = await loadConfig();
  const history = config.searchHistory || [];
  
  // Remove duplicates and add to start
  const updatedHistory = [
    query.trim(),
    ...history.filter(item => item.toLowerCase() !== query.trim().toLowerCase())
  ].slice(0, 10);

  config.searchHistory = updatedHistory;
  await saveConfig(config);
}
