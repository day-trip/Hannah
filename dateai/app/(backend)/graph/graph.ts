import OpenAI from "openai";
import {TeamsUserInfo} from "@/app/(backend)/microsoft/teams";
import neo from "neo4j-driver";
import cypher from "@/app/(backend)/graph/cypher";
import {ClientMessage, RichMessage} from "@/app/(talk)/Message";

export const SCHEMA = `\
MERGE (i:Interest {
  name: 'Interest Name'
})

MERGE (l:Location {
  name: 'As specific as possible, ex address or state or country'
})

MERGE (e:Event {
  name: 'Event Name',
  date: '2023-11-10',
  location: 'Event Location'
})

MERGE (r:Relationship {
  type: 'friend/husband/wife/girlfriend/boyfriend'
})

MERGE (s:Skill {
  name: 'Skill Name',
  level: 'beginner'
})

MERGE (h:Hobby {
  name: 'Hobby Name',
  description: 'Hobby Description'
})

MERGE (lang:Language {
  name: 'Language Name',
  proficiency: 'intermediate'
})

MERGE (m:Music {
  genre: 'Genre Name',
  favoriteArtists: ['Artist1', 'Artist2']
})

MERGE (m:Song {
  name: 'Song name',
})\
`;

/*const KNOWLEDGE_PROMPT = `\
Previous messages:
user: i like food.
assistant: Which one is your favorite?
LATEST MESSAGE:
user: Apples.
User's id is 1.
cypher\`\`\`
MATCH (person:Person {id: 1})
MERGE (apple:Food {name: 'Apple'}) // ALWAYS check if it already exists first, but don't assume it does
MERGE (person)-[:EATS]->(apple);
\`\`\`

###
Create Cypher statements based on the LATEST MESSAGE from the user. Always use MERGE, never use CREATE, to avoid duplicates.

Previous messages:
{prev}
LATEST MESSAGE:
{latest}
User's id is {id}.

ONLY INCLUDE INFORMATION THAT IS ACTUALLY USEFUL!
Good examples:
- User mentioned person 1
- User has a crush on person 2
- (gossip about people)
- User enjoys skating
Bad examples:
- User scored 10 points in soccer
- Person 1 knows about person 2

Node ideas: Person, Interest, Activity, Location, Event
Relation ideas: has_crush_on, mentioned, enjoys
cypher\`\`\`
`*/

const KNOWLEDGE_PROMPT = `\
Write knowledge triplets based on THE LATEST MESSAGE from the following conversation between a user and a dating chatbot. All triplets should either be about dating, gossip, or about people that would be relevant to another person. Triplets are in the form of \`Object(attr1: value, attr2: value) -> relation -> OtherObject(attr1: value)\`.

Examples (don't use the examples by mistake):
(good)
- User mentioned person 1 \`Person(id: ...) -> mentioned -> Person(name: ...)\`
- User has a crush on person 2 \`Person(id: ...) -> has_crush_on -> Person(name: ...)\`
- (any gossip about people)
- User enjoys skating \`Person(id: ...) -> has_interest -> Interest(name: "Skating", type: "sport)\`
(bad)
- User scored 10 points in soccer // too specific
- Person 1 knows about person 2 // like who cares?

Node ideas: Person, Interest, Activity, Location, Event
Relation ideas: has_crush_on, mentioned, has_interest (only use \`mentioned\` in the context of a person mentioning a person, and do not duplicate (eg has_crush_on & mentioned))
The graph is directed, so make sure to write the Person representing the user first (always refer to them by id).

###

Previous 5 messages:
{prev}
LATEST MESSAGE:
{latest}
User's id is 555.

Write triplets as a comma separated list (the latest message only, don't make things up the user didn't say):
\`\`\`
`

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

export async function generateKnowledge(info: TeamsUserInfo, messages: RichMessage[], message: RichMessage) {
    console.log(KNOWLEDGE_PROMPT.replaceAll("{id}", info.id).replace("{schema}", SCHEMA).replace("{latest}", `User: ${message.content}`).replace("{prev}", messages.map(m => `${m.role}: ${m.content}`).join('\n')));
    const chatCompletion = await openai.chat.completions.create({
        messages: [{role: "user", content: KNOWLEDGE_PROMPT.replaceAll("{id}", info.id).replace("{schema}", SCHEMA).replace("{latest}", `User: ${message.content}`).replace("{prev}", messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n'))}],
        model: 'gpt-4-0613',
        temperature: 0,
        max_tokens: 580,
    });
    const knowledge = chatCompletion.choices[0].message.content!;
    knowledge.replaceAll("555", `"${info.id}"`).trim().split(/,[\s\n]*/).forEach(pair => {
        const [node1, relation, node2] = pair.trim().split(/\s?->\s?/);
        console.log(node1, relation, node2);
    });
    /*const s = driver.session();

    const r = await s.run(knowledge.replace('```', '').trim());
    console.log(r);*/
}
