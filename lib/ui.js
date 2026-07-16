import chalk from 'chalk';
import boxen from 'boxen';

/**
 * Renders the application banner.
 */
export function renderBanner() {
  const title = chalk.bold.white('📰 GOOGLE ') + chalk.bold.red('NEWS') + chalk.bold.blue(' CLI');
  const subtitle = chalk.gray('Your terminal portal to global current affairs');
  
  console.log(
    boxen(`${title}\n${subtitle}`, {
      padding: 1,
      margin: { top: 1, bottom: 1 },
      borderStyle: 'round',
      borderColor: 'red',
      dimBorder: true,
      textAlignment: 'center'
    })
  );
}

/**
 * Renders a header section.
 */
export function renderSectionHeader(titleText) {
  console.log('\n' + chalk.bold.bgRed.white(` ${titleText} `) + '\n');
}

/**
 * Renders detail card for a selected news article.
 */
export function renderArticleDetail(article) {
  const dateStr = article.pubDate 
    ? new Date(article.pubDate).toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Unknown Date';

  const content = [
    chalk.bold.white(article.title),
    '',
    `${chalk.bold.red('Source:')}    ${chalk.cyan(article.publisher)}`,
    `${chalk.bold.red('Published:')} ${chalk.yellow(article.relativeTime)} (${dateStr})`,
    '',
    article.contentSnippet 
      ? `${chalk.italic.gray(article.contentSnippet.trim())}\n`
      : '',
    `${chalk.bold.red('Link:')}      ${chalk.blue.underline(article.link)}`
  ].join('\n');

  console.log(
    boxen(content, {
      padding: 1,
      margin: { top: 1, bottom: 1 },
      borderStyle: 'double',
      borderColor: 'cyan',
      title: chalk.bold.yellow(' 📰 Full Article Summary '),
      titleAlignment: 'left'
    })
  );
}

/**
 * Formats lists of article headlines to fit neatly into inquirer choices.
 */
export function formatArticleChoice(article, index, totalCount) {
  const idxStr = chalk.gray(`[${index + 1}/${totalCount}]`);
  const pubStr = chalk.cyan(`(${article.publisher})`);
  const timeStr = chalk.yellow(article.relativeTime);
  
  // Truncate title if it's too long for the selector
  const maxTitleLength = 60;
  let cleanTitle = article.title;
  if (cleanTitle.length > maxTitleLength) {
    cleanTitle = cleanTitle.substring(0, maxTitleLength - 3) + '...';
  }
  
  const titleStr = chalk.white.bold(cleanTitle);

  return `${idxStr} ${titleStr} ${pubStr} - ${timeStr}`;
}

/**
 * Renders system success message.
 */
export function printSuccess(message) {
  console.log(chalk.green(`✔ ${message}`));
}

/**
 * Renders system error message.
 */
export function printError(message) {
  console.log(chalk.red(`✘ Error: ${message}`));
}
