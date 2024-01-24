import neo, {Record} from "neo4j-driver";

const driver = neo.driver(process.env.NEO_URL!, neo.auth.basic("neo4j", process.env.NEO_KEY!), {

});

export default async function cypher(query: string): Promise<Record[]> {
    return (await driver.session().run(query.split('\n').map(x => x.trim()).join('\n').trim())).records;
}
