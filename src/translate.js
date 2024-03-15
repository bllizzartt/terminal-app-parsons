
// Langify

import { gptPrompt } from "./shared/openai.js";
import { ask, say } from "./shared/cli.js";
import select, { Separator } from '@inquirer/select';
import chalk from 'chalk';
console.log(chalk.blue('Hello world!'));
import inquirer from 'inquirer';


const log = console.log;


// Function that pulls the time and inserts it into the intro greeting.
function getGreeting() {
    const hour = new Date().getHours();
    return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

// Translations for the different parts of the game
const translations = {
  'jump': {
    'en': 'Jump',
    'zh': '跳',
    'de': 'Springen',
    'ja': 'ジャンプ',
    'ko': '점프',
    'fr': 'Sauter',
    'sv': 'Hoppa',
    'pl': 'Skakać'
  },
  'spell': {
    'en': 'Spell',
    'zh': '咒语',
    'de': 'Zauberspruch',
    'ja': '呪文',
    'ko': '주문',
    'fr': 'Épeler',
    'sv': 'Stava',
    'pl': 'Zaklęcie'
  },
  'cross': {
    'en': 'Cross',
    'zh': '过',
    'de': 'Kreuz',
    'ja': 'クロス',
    'ko': '가로지르다',
    'fr': 'Traverser',
    'sv': 'Korsa',
    'pl': 'Przekroczyć'
  },
  'echo': {
    'en': 'Echo',
    'zh': '回声',
    'de': 'Echo',
    'ja': 'エコー',
    'ko': '메아리',
    'fr': 'Écho',
    'sv': 'Eko',
    'pl': 'Echo'
  },
  'freeze': {
    'en': 'Freeze',
    'zh': '冻结',
    'de': 'Einfrieren',
    'ja': 'フリーズ',
    'ko': '얼다',
    'fr': 'Geler',
    'sv': 'Frysa',
    'pl': 'Zamrozić'
  },
  'knowledge': {
    'en': 'Knowledge',
    'zh': '知识',
    'de': 'Wissen',
    'ja': '知識',
    'ko': '지식',
    'fr': 'Connaissance',
    'sv': 'Kunskap',
    'pl': 'Wiedza'
  },
  'ask': {
    'en': 'Ask',
    'zh': '询问',
    'de': 'Fragen',
    'ja': '尋ねる',
    'ko': '묻다',
    'fr': 'Demander',
    'sv': 'Fråga',
    'pl': 'Pytać'
  },
  'exit': {
    'en': 'Exit',
    'zh': '退出',
    'de': 'Ausgang',
    'ja': '出口',
    'ko': '출구',
    'fr': 'Sortie',
    'sv': 'Utgång',
    'pl': 'Wyjście'
  },
  'look': {
    'en': 'Look',
    'zh': '看',
    'de': 'Schauen',
    'ja': '見る',
    'ko': '보다',
    'fr': 'Regarder',
    'sv': 'Titta',
    'pl': 'Patrzeć'
  },
  'touch': {
    'en': 'Touch',
    'zh': '触摸',
    'de': 'Berühren',
    'ja': '触れる',
    'ko': '만지다',
    'fr': 'Toucher',
    'sv': 'Röra',
    'pl': 'Dotykać'
  },
  'attack': {
    'en': 'Attack',
    'zh': '攻击',
    'de': 'Angreifen',
    'ja': '攻撃',
    'ko': '공격',
    'fr': 'Attaquer',
    'sv': 'Attackera',
    'pl': 'Atakować'
  }
  // Add other translations as needed
};

// Define dungeon levels
const levels = [
    {
    description: `You enter the first floor looking around when all of a sudden a ${chalk.red('horde of enemies')} swarms you. Above you, a ${chalk.green('sword and shield')} appear. What action must you take to grab the gear?`,
    correctAction: "jump",
    failureMessage: `The ${chalk.red('enemies')} laugh at your politeness. The gear remains out of reach.`
    },
    {
        description: "You advance to the second floor, finding a dark room filled with mysterious symbols. In the center lies a glowing orb. How do you proceed to safely retrieve it?",
        correctAction: "spell",
        failureMessage: "You touch the orb with bare hands, and it shocks you, sending you reeling back."
    },
    {
        description: "On the third floor, you encounter a wide chasm blocking your path. A rickety bridge is the only way across. How do you proceed?",
        correctAction: "cross",
        failureMessage: "You hesitate and the bridge looks more unstable. You need to make a decisive action."
    },
    {
        description: "The fourth floor presents a locked door with a riddle inscribed. The riddle reads: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind.' What am I?",
        correctAction: "echo",
        failureMessage: "The door remains locked. Think about the answer to the riddle and try again."
    },
    {
        description: "On the fifth floor, you find a room filled with statues. One of them holds a key in its hand, but as soon as you enter, the statues come to life. How do you stop them?",
        correctAction: "attack",
        failureMessage: "The statues continue their advance. There must be a way to stop them in their tracks."
    },
    {
        description: "You reach the final floor where the treasure lies. However, it's guarded by a dragon. The dragon asks, 'What is the greatest treasure of all?'",
        correctAction: "knowledge",
        failureMessage: "The dragon seems unimpressed with your answer. Think about what could be the greatest treasure."
    }
];

function displaySeparator() {
  console.log('\n\n========================================\n\n');
}

// Main function to run the game
async function main() {
  const user = {};
  const context = [];
  // Language selection process
  console.log("Before language selection");
  const languageAnswers = await inquirer.prompt([
      {
          type: 'list',
          name: 'language',
          message: 'Choose your language:',
          choices: ['English', '中文', 'Deutsch', '日本語', '한국어', 'Français', 'Svenska', 'Polski'],
      },
  ]);
  const chosenLanguage = languageAnswers.language;
  console.log("After language selection:", chosenLanguage);

  // Map readable language choices to language codes
  const languageCodes = {
      'English': 'en',
      '中文': 'zh',
      'Deutsch': 'de',
      '日本語': 'ja',
      '한국어': 'ko',
      'Français': 'fr',
      'Svenska': 'sv',
      'Polski': 'pl'
  };
  const languageCode = languageCodes[chosenLanguage];

  // Dungeon choice
  const chosenDungeon = await select({
    message: 'Choose the dungeon you wish to explore:',
    choices: [
        { name: 'Red Dungeon', value: 'red' },
        { name: 'Blue Dungeon', value: 'blue' },
        new Separator(),
        { name: 'Exit Game', value: 'exit' }
    ],
  });

  if (chosenDungeon === 'exit') {
    say("Exiting the adventure. Have a great day!");
    return; // Exit the entire adventure
  }

  // Here you can handle the chosen dungeon logic
  // For example, adjusting your storytelling based on the chosen dungeon
  user.question = `Explore ${chosenDungeon} Dungeon`; // This sets up your story based on dungeon choice

  const prompt1 = `
  Respond as a professional storyteller. keep it at one word for testing right now
  User's question: '${user.question}'
  Recent interactions: ${context.slice(-3).join(" ")}  `;
  
  const response1 = await gptPrompt(prompt1, {
    max_tokens: 128,
    temperature: 0.1,
  });

  // Output the response or incorporate it into your game narrative
  say(`\n${response1}\n`);

  // Iterate through each level of the dungeon
  for (const level of levels) {
      let levelCompleted = false;
      while (!levelCompleted) {
          displaySeparator();  // Display a separator for clarity
          const message = level.description;  // Use the level's description
          const actions = ['jump', 'ask', 'look', 'touch', 'attack', 'spell', 'cross', 'echo', 'freeze', 'knowledge', 'exit'].map(action => ({
              name: translations[action][languageCode],  // Translate actions based on chosen language
              value: action
          }));

          // Display the level challenge and ask for user's action
          const action = await inquirer.prompt([
              {
                  type: 'list',
                  name: 'selectedAction',
                  message: message,
                  choices: actions
              },
          ]);

          if (action.selectedAction === 'exit') {
              say("Exiting the adventure. Have a great day!");
              return;  // Exit the current level and eventually the adventure
          }

          if (action.selectedAction === level.correctAction) {
              say("You successfully navigate the challenge and move to the next level!");
              levelCompleted = true;
          } else {
              // Display failure message and prompt user to try again
              const failureMessage = level.failureMessage;  // Use the level's failure message
              say(`${failureMessage} Try again.`);
          }
      }
      say("");  // Add a space for readability between levels
  }

  // Display final congratulatory message upon completing all levels
  say(`Congratulations Traveler, you've completed the adventure! Have a ${getGreeting()}!`);
}
main();