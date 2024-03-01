import { gptPrompt } from "./shared/openai.js";
import { ask, say } from "./shared/cli.js";
import select, { Separator } from '@inquirer/select';

// Function that pulls the time and inserts it into the intro greeting.
function getGreeting() {
    const hour = new Date().getHours();
    return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

// Translations for the different parts of the game
const translations = {
  'jump': {
      'en': 'Jump',
      'zh': '跳'
  },
  'spell': {
      'en': 'Spell',
      'zh': '咒语'
  },
  'cross': {
      'en': 'Cross',
      'zh': '过'
  },
  'echo': {
      'en': 'Echo',
      'zh': '回声'
  },
  'freeze': {
      'en': 'Freeze',
      'zh': '冻结'
  },
  'knowledge': {
      'en': 'Knowledge',
      'zh': '知识'
  },
  'ask': {
    'en': 'Ask',
    'zh': '询问'
  },
  'exit': {
    'en': 'Exit',
    'zh': '退出'
  },
  'look': {
    'en': 'Look',
    'zh': '看'
  },
  'touch': {
    'en': 'Touch',
    'zh': '触摸'
  }
  // Add other translations as needed
};

// Define dungeon levels
const levels = [
    {
        description: "You enter the first floor looking around when all of a sudden a horde of enemies swarms you. Above you, a sword and shield appear. What action must you take to grab the gear?",
        correctAction: "jump",
        failureMessage: "The enemies laugh at your politeness. The gear remains out of reach."
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
        correctAction: "freeze",
        failureMessage: "The statues continue their advance. There must be a way to stop them in their tracks."
    },
    {
        description: "You reach the final floor where the treasure lies. However, it's guarded by a dragon. The dragon asks, 'What is the greatest treasure of all?'",
        correctAction: "knowledge",
        failureMessage: "The dragon seems unimpressed with your answer. Think about what could be the greatest treasure."
    }
];

async function main() {
  const chosenLanguage = await select({
    message: 'Choose your language:',
    choices: [
      { name: 'English', value: 'en' },
      { name: '中文', value: 'zh' },
      new Separator(),
      { name: 'Exit Game', value: 'exit' }
    ],
  });

  if (chosenLanguage === 'exit') {
    say("Exiting the adventure. Have a great day!");
    return; // Exit the entire adventure
  }

  say(`${getGreeting()}, Are you ready to enter the tunnel and fight your way through countless foes to recover the treasure? Your quest has begun!`);

  // Iterate through each level of the dungeon
  for (const level of levels) {
    let levelCompleted = false;
    while (!levelCompleted) {
      // Use the level description directly as it does not need translation here.
      const message = level.description; // The original level descriptions are in English.
      
      const actions = ['jump', 'ask', 'look', 'touch', 'spell', 'cross', 'echo', 'freeze', 'knowledge', 'exit'].map(action => ({
          name: translations[action][chosenLanguage],
          value: action
      }));
      const action = await select({
          message: message,
          choices: actions
      });

      if (action === 'exit') {
          say("Exiting the adventure. Have a great day!");
          return; // Exit the current level and eventually the adventure
      }

      if (action === level.correctAction) {
          say("You successfully navigate the challenge and move to the next level!");
          levelCompleted = true;
      } else {
          // Use the level failure message directly as it does not need translation here.
          const failureMessage = level.failureMessage; // The original failure messages are in English.
          say(`${failureMessage} Try again.`);
      }
    }
    say(""); // Add a space for readability between levels
  }

  say(`Congratulations Traveler, you've completed the adventure! Have a ${getGreeting()}!`);
}

main();
