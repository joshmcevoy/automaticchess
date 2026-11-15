export type Bot = {
    id: number;
    playerid: number;
    name: string;
    path: string;
    profilepicture: string;
    elo: number;
}

export type Move = {
    id: number;
    moveNum: number;
    move: string;
    fen: string;
}

export type Game = {
    id: number;
    gameid: number;
    white: Bot;
    black: Bot;
    winner: Bot | undefined;
    ongoing: boolean;
    isDraw: boolean;
    timestamp: number;
    moves: Move[];
}

export async function fetchJSON<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) { throw new Error(`Request to ${url} failed`) }

    return response.json();
}

const baseURL = "http://localhost:8000"

// gameid or botid or neither, but never both.
type loadGameOptions = { gameid: number, botid?: never } | { botid: number, gameid?: never } | { gameid?: never, botid?: never }
export async function loadGame(options: loadGameOptions = {}): Promise<Game[]> {
    let endpoint = "/api/games";

    if (options.botid !== undefined) {
        endpoint = `/api/games?botid=${options.botid}`;
    }

    if (options.gameid !== undefined) {
        endpoint = `/api/games/${options.gameid}`;

        if (Number.isNaN(options.gameid)) {
            endpoint = "/api/games?latest";
        }
    }

    const result: Game[] = await fetchJSON<Game[]>(baseURL + endpoint);

    console.log(result);

    return result;
}

export async function loadBot(botid?: number): Promise<Bot[]> {
    let endpoint = "/api/bots";

    if (botid !== undefined) {
        endpoint = `/api/bots/${botid}`;
    }

    return await fetchJSON<Bot[]>(baseURL + endpoint);
}
