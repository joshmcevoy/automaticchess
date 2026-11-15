import { loadGame, loadBot } from "./loadGame";

async function main() {
    const data = await loadGame({"gameid": 62171164});
    console.log(data);
}

main().catch(console.error);
