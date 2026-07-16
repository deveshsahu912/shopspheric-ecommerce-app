#!/usr/bin/env node

import inquirer from 'inquirer';
import ora from 'ora';
import open from 'open';
import { 
  loadConfig, 
  saveConfig, 
  REGIONS, 
  addToSearchHistory 
} from '../lib/config.js';
import { 
  fetchTopStories, 
  fetchSearchStories, 
  fetchTopicStories, 
  TOPICS 
} from '../lib/api.js';
import { 
  renderBanner, 
  renderSectionHeader, 
  renderArticleDetail, 
  formatArticleChoice, 
  printSuccess, 
  printError 
} from '../lib/ui.js';

// Global config state
let config = {};

/**
 * Main application entry point.
 */
async function main() {
  config = await loadConfig();
  
  const args = process.argv.slice(2);
  if (args.length > 0) {
    await handleCommandLineMode(args);
  } else {
    await startInteractiveMode();
  }
}

/**
 * Prints help instructions for command line arguments.
 */
function printHelp() {
  console.log(`
${process.argv[1].endsWith('index.js') ? 'node bin/index.js' : 'google-news-cli'} [command] [options]

Commands:
  search <query>  Fetch and display news articles matching the query.
  topic <code >    Fetch and display news for a topic (WORLD, BUSINESS, TECHNOLOGY, etc.).
  help, -h        Show this help message.

Examples:
  google-news-cli search "open source AI"
  google-news-cli topic TECHNOLOGY
  `);
}

/**
 * Handles command line arguments (non-interactive scripting mode).
 */
async function handleCommandLineMode(args) {
  const command = args[0].toLowerCase();
  
  if (command === 'search') {
    const query = args.slice(1).join(' ');
    if (!query) {
      printError('Please provide a search query. Example: search "climate change"');
      process.exit(1);
    }
    
    const spinner = ora(`Searching Google News for "${query}"...`).start();
    try {
      const feed = await fetchSearchStories(query, config);
      spinner.succeed(`Found ${feed.items.length} articles`);
      
      console.log(`\n--- SEARCH RESULTS: ${query.toUpperCase()} ---`);
      displayCommandLineArticles(feed.items.slice(0, 15));
    } catch (error) {
      spinner.fail('Search failed');
      printError(error.message);
    }
  } 
  
  else if (command === 'topic') {
    const topicCode = (args[1] || '').toUpperCase();
    const validTopic = TOPICS.find(t => t.value === topicCode);
    
    if (!validTopic) {
      printError(`Invalid topic code. Valid codes: ${TOPICS.map(t => t.value).join(', ')}`);
      process.exit(1);
    }
    
    const spinner = ora(`Fetching topic: ${topicCode}...`).start();
    try {
      const feed = await fetchTopicStories(topicCode, config);
      spinner.succeed(`Fetched ${feed.items.length} articles`);
      
      console.log(`\n--- TOPIC: ${topicCode} ---`);
      displayCommandLineArticles(feed.items.slice(0, 15));
    } catch (error) {
      spinner.fail('Failed to fetch topic');
      printError(error.message);
    }
  } 
  
  else if (command === 'help' || command === '-h' || command === '--help') {
    printHelp();
    process.exit(0);
  } 
  
  else {
    printError(`Unknown command: "${command}"`);
    printHelp();
    process.exit(1);
  }
  process.exit(0);
}

/**
 * Helper to display articles in standard plain-text stdout.
 */
function displayCommandLineArticles(articles) {
  if (articles.length === 0) {
    console.log('No articles found.');
    return;
  }
  
  articles.forEach((art, i) => {
    console.log(`\n[${i + 1}] ${art.title}`);
    console.log(`    Publisher: ${art.publisher} | Published: ${art.relativeTime}`);
    console.log(`    Link: ${art.link}`);
  });
  console.log('');
}

/**
 * Starts interactive mode (full shell application).
 */
async function startInteractiveMode() {
  let exitApp = false;
  
  while (!exitApp) {
    console.clear();
    renderBanner();
    
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: `Main Menu (Region: ${config.regionName}):`,
        choices: [
          { name: '🔥 Top Stories', value: 'top' },
          { name: '🔍 Search News', value: 'search' },
          { name: '📁 Browse by Topic', value: 'topic' },
          { name: '⚙️ Settings (Change Region/Lang)', value: 'settings' },
          { name: '❌ Exit', value: 'exit' }
        ]
      }
    ]);

    switch (action) {
      case 'top':
        await handleTopStories();
        break;
      case 'search':
        await handleSearch();
        break;
      case 'topic':
        await handleBrowseTopics();
        break;
      case 'settings':
        await handleSettings();
        break;
      case 'exit':
        exitApp = true;
        console.log('\nGoodbye! Keep reading.\n');
        break;
    }
  }
}

/**
 * Fetches and presents Top Stories.
 */
async function handleTopStories() {
  const spinner = ora('Loading top stories...').start();
  try {
    const feed = await fetchTopStories(config);
    spinner.succeed();
    await handleArticleListMenu(feed.items, '🔥 Top Stories');
  } catch (error) {
    spinner.fail();
    printError(error.message);
    await pressAnyKeyToContinue();
  }
}

/**
 * Search News menu handler (with search history support).
 */
async function handleSearch() {
  const history = config.searchHistory || [];
  
  let query = '';
  
  if (history.length > 0) {
    const choices = [
      { name: '➕ [New Search]', value: 'new' },
      ...history.map(q => ({ name: `🕒 ${q}`, value: q })),
      { name: '🔙 [Back to Main Menu]', value: 'back' }
    ];
    
    const { selectQuery } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectQuery',
        message: 'Search History:',
        choices
      }
    ]);
    
    if (selectQuery === 'back') return;
    if (selectQuery !== 'new') {
      query = selectQuery;
    }
  }
  
  if (!query) {
    const { inputQuery } = await inquirer.prompt([
      {
        type: 'input',
        name: 'inputQuery',
        message: 'Enter search keyword(s):',
        validate: input => input.trim() ? true : 'Search query cannot be empty.'
      }
    ]);
    query = inputQuery;
  }
  
  // Save to config history
  await addToSearchHistory(query);
  config = await loadConfig(); // Reload config
  
  const spinner = ora(`Searching for "${query}"...`).start();
  try {
    const feed = await fetchSearchStories(query, config);
    spinner.succeed();
    await handleArticleListMenu(feed.items, `🔍 Search: "${query}"`);
  } catch (error) {
    spinner.fail();
    printError(error.message);
    await pressAnyKeyToContinue();
  }
}

/**
 * Topic Browse menu handler.
 */
async function handleBrowseTopics() {
  const { topicValue } = await inquirer.prompt([
    {
      type: 'list',
      name: 'topicValue',
      message: 'Select a Topic:',
      choices: [
        ...TOPICS,
        { name: '🔙 [Back to Main Menu]', value: 'back' }
      ]
    }
  ]);
  
  if (topicValue === 'back') return;
  
  const topicObj = TOPICS.find(t => t.value === topicValue);
  const spinner = ora(`Fetching ${topicObj.name} stories...`).start();
  
  try {
    const feed = await fetchTopicStories(topicValue, config);
    spinner.succeed();
    await handleArticleListMenu(feed.items, `📁 Topic: ${topicObj.name}`);
  } catch (error) {
    spinner.fail();
    printError(error.message);
    await pressAnyKeyToContinue();
  }
}

/**
 * Settings (Region & Language) update menu handler.
 */
async function handleSettings() {
  const choices = REGIONS.map(r => ({
    name: r.name,
    value: r
  }));
  
  choices.push({ name: '🔙 [Back to Main Menu]', value: 'back' });
  
  const { selectedRegion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedRegion',
      message: 'Select default News Region & Language:',
      choices
    }
  ]);
  
  if (selectedRegion === 'back') return;
  
  config.region = selectedRegion.region;
  config.language = selectedRegion.language;
  config.ceid = selectedRegion.ceid;
  config.regionName = selectedRegion.name;
  
  const success = await saveConfig(config);
  if (success) {
    printSuccess(`Region successfully changed to: ${config.regionName}`);
  } else {
    printError('Failed to save settings.');
  }
  await pressAnyKeyToContinue();
}

/**
 * Renders list of articles and manages interactive navigation of the selection.
 */
async function handleArticleListMenu(articles, sectionTitle) {
  if (articles.length === 0) {
    console.log('\nNo articles found for this section.\n');
    await pressAnyKeyToContinue();
    return;
  }
  
  let menuActive = true;
  
  while (menuActive) {
    console.clear();
    renderSectionHeader(sectionTitle);
    
    const total = articles.length;
    const choices = articles.map((art, idx) => ({
      name: formatArticleChoice(art, idx, total),
      value: art
    }));
    
    choices.push({ name: '🔙 [Back to Main Menu]', value: 'back' });
    
    const { articleSelection } = await inquirer.prompt([
      {
        type: 'list',
        name: 'articleSelection',
        message: 'Select an article to view details:',
        pageSize: 15,
        choices
      }
    ]);
    
    if (articleSelection === 'back') {
      menuActive = false;
    } else {
      const result = await handleArticleDetailMenu(articleSelection, articles, sectionTitle);
      if (result === 'main') {
        menuActive = false;
      }
    }
  }
}

/**
 * Shows details of an article and allows opening it in browser.
 */
async function handleArticleDetailMenu(article, articlesList, sectionTitle) {
  let detailActive = true;
  
  while (detailActive) {
    console.clear();
    renderArticleDetail(article);
    
    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Article Options:',
        choices: [
          { name: '🌐 Open in Web Browser', value: 'open' },
          { name: '🔙 Back to Article List', value: 'list' },
          { name: '🏠 Back to Main Menu', value: 'main' }
        ]
      }
    ]);
    
    if (choice === 'open') {
      const spinner = ora('Opening browser...').start();
      try {
        await open(article.link);
        spinner.succeed('Browser opened successfully!');
      } catch (err) {
        spinner.fail('Could not open browser');
        printError(err.message);
      }
      await pressAnyKeyToContinue();
    } else if (choice === 'list') {
      detailActive = false;
    } else if (choice === 'main') {
      // Trick to pop all the way back to main menu
      detailActive = false;
      // We modify the loop control of the parent by returning/mutating state
      // Actually we can just return or pop up.
      // Let's modify the articlesList itself or set parent loop to false.
      // A cleaner way is to make handleArticleListMenu check if a global "exit to main" flag is set.
      // Let's check how we can do it. If we use throw/return or simply change list state.
      // Let's use a return value to signal to parent.
      return 'main';
    }
  }
}

/**
 * Prompts user to hit Enter to continue.
 */
async function pressAnyKeyToContinue() {
  console.log('');
  await inquirer.prompt([
    {
      type: 'input',
      name: 'continue',
      message: 'Press [Enter] to continue...'
    }
  ]);
}

// Execute main
main().catch(err => {
  printError(err.message);
  process.exit(1);
});
