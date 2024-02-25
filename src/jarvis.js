// Overall I adapted the dungeon_master.js file into this and used minor openAI prompts for resolution
// Used to openAI for guidance on the getGreeting() setup

import { gptPrompt } from "./shared/openai.js";
import { ask, say } from "./shared/cli.js";

// function that pulls the time and inserts it into the intro greeting.
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

main();

async function main() {
  say(`${getGreeting()}, ready to learn? I just know you are going to do amazing! Let's begin!`);
  const context = [];
//   let playing = true;
//   const name = "Cat Galaxy";
  const user = {};
  // const appt = "Doctor appointment for physical therapy @ 2pm on 2/20/24 with Dr. Fen"
  // const thesis = "Thesis 2 class @ 4pm on 2/13/24 with Ayo"

  user.name = await ask("Who am I speaking with?");
  user.question = await ask("What do you want to translate?");

  say("");
// Here i have added appt and thesis in my prompt but the goal down the road is to make it unique to each user. a if chase === true statement
  const prompt1 = `
  Respond to the user as a professional linguistic who speaks every language on the earth and can translate any lagnuage into another language when told to .
  User's name: ${user.name}
  User's question: '${user.question}'
  Recent interactions: ${context.slice(-3).join(" ")}
    `;
  
  const response1 = await gptPrompt(prompt1, {
    max_tokens: 128,
    temperature: 0.1,
  });
  context.push(`Question: ${user.question} - Response: ${response1}`);
  say(`\n${response1}\n`);
  
  user.finalize = await ask("Is there anything else I can help you with today?");
  
  say(`Have a ${getGreeting()} ${user.name}.`);

  }