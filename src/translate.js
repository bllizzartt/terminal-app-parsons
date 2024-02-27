// Used GPT for some support 

import { gptPrompt } from "./shared/openai.js";
import { ask, say } from "./shared/cli.js";

// Function that pulls the time and inserts it into the intro greeting.
function getGreeting() {
    const hour = new Date().getHours();
    return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}
// Translations for the different parts of the game
const translations = {
  'jump': {
      'en': 'jump',
      'zh': '跳'
  },
  'spell': {
      'en': 'spell',
      'zh': '咒语'
  },
  'cross': {
      'en': 'cross',
      'zh': '过'
  },
  'echo': {
      'en': 'echo',
      'zh': '回声'
  },
  'freeze': {
      'en': 'freeze',
      'zh': '冻结'
  },
  'knowledge': {
      'en': 'knowledge',
      'zh': '知识'
  },
  'ask': {
    'en': 'ask',
    'zh': '询问'
},
'exit': {
    'en': 'exit',
    'zh': '退出'
},
'look': {
    'en': 'look',
    'zh': '看'
},
'touch': {
    'en': 'touch',
    'zh': '触摸'
}
  // Add other translations as needed
};

// Define dungeon levels
const levels = [
    {
        description: "You enter the first floor looking around when all of a sudden a horde of enemies swarms you. Above you, a sword and shield appear. What action must you take to grab the gear? (jump/ask/spell/exit)",
        correctAction: "jump",
        failureMessage: "The enemies laugh at your politeness. The gear remains out of reach."
    },
    {
        description: "You advance to the second floor, finding a dark room filled with mysterious symbols. In the center lies a glowing orb. How do you proceed to safely retrieve it? (spell/look/touch/exit)",
        correctAction: "spell",
        failureMessage: "You touch the orb with bare hands, and it shocks you, sending you reeling back."
    },
    {
        description: "On the third floor, you encounter a wide chasm blocking your path. A rickety bridge is the only way across. How do you proceed? (cross/wait/jump/exit)",
        correctAction: "cross",
        failureMessage: "You hesitate and the bridge looks more unstable. You need to make a decisive action."
    },
    {
        description: "The fourth floor presents a locked door with a riddle inscribed. The riddle reads: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind.' What am I? (echo/whisper/scream/exit)",
        correctAction: "echo",
        failureMessage: "The door remains locked. Think about the answer to the riddle and try again."
    },
    {
        description: "On the fifth floor, you find a room filled with statues. One of them holds a key in its hand, but as soon as you enter, the statues come to life. How do you stop them? (freeze/run/attack/exit)",
        correctAction: "freeze",
        failureMessage: "The statues continue their advance. There must be a way to stop them in their tracks."
    },
    {
        description: "You reach the final floor where the treasure lies. However, it's guarded by a dragon. The dragon asks, 'What is the greatest treasure of all?' (knowledge/gold/fame/exit)",
        correctAction: "knowledge",
        failureMessage: "The dragon seems unimpressed with your answer. Think about what could be the greatest treasure."
    }
];

async function main() {
  const chosenLanguage = await ask("Choose your language (en/zh): ");
  say(`${getGreeting()}, Are you ready to enter the tunnel and fight your way through countless foes to recover the treasure? Your quest has begun!`);
  const context = [];
  const user = {}; // Currently unused but can be utilized for personalized interactions.

  // Iterate through each level of the dungeon
    // GPT support here 
  for (const level of levels) {
      let levelCompleted = false;
      while (!levelCompleted) {
          const translatedDescription = level.description.replace(/\b(jump|ask|look|touch|exit|spell|cross|echo|freeze|knowledge)\b/g, match => translations[match][chosenLanguage]);
          const action = await ask(`${translatedDescription} (Type your action or '${translations['exit'][chosenLanguage]}' to give up):`);

          if (action.toLowerCase() === 'exit') {
              say("Exiting the adventure. Have a great day!");
              return; // Exit the entire adventure
          }

          const translatedAction = translations[level.correctAction][chosenLanguage];
          if (action.toLowerCase() === translatedAction) {
              say("You successfully navigate the challenge and move to the next level!");
              levelCompleted = true;
          } else {
              const translatedFailureMessage = level.failureMessage.replace(/\b(jump|ask|look|touch|exit|spell|cross|echo|freeze|knowledge)\b/g, match => translations[match][chosenLanguage]);
              say(`${translatedFailureMessage} Try again.`);
          }
      }
      say(""); // Add a space for readability between levels
  }

  say(`Congratulations Traveler, you've completed the adventure! Have a ${getGreeting()}!`);
}

main();
