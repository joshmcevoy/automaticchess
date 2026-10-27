export type Game = {
    id: number;
    gameid: number;
    whiteid: number;
    blackid: number;
    winnerid: number | null;
    isDraw: boolean;
    timestamp: number;
}

// type for game info + bot info
export type GameData = {
    game: Game;
    white: Bot;
    black: Bot;
    winner: Bot | null;
};

export type Bot = {
    id: number;
    playerid: number;
    name: string;
    path: string;
}

export type Move = {
    id: number;
    moveNum: number;
    gameid: number;
    move: string;
    fen: string;
}

export async function fetchJSON<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Request failed");
    }

    return response.json();
}

export function loadGame(gameId: string, all: true): Promise<GameData[]>;
export function loadGame(
    gameId: string,
    all?: false
): Promise<GameData | undefined>;

export async function loadGame(gameId: string, all: boolean = false) {
    const baseURL = "http://localhost:8000";
    let reqURL = `${baseURL}/games/get/?gameid=${gameId}`;
    // get latest game if no gameid provided
    if (!gameId) { reqURL = `${baseURL}/games/getlatest/` }
    // get all games if all flag true
    if (all) { reqURL = `${baseURL}/games/getall/` }

    const games = await fetchJSON<Game[]>(reqURL);

    const results = await Promise.all(
        games.map(async (game) => {
            const [white, black, winner, moves] = await Promise.all([
                fetchJSON<Bot[]>(`${baseURL}/bots/get/?botid=${game.whiteid}`),
                fetchJSON<Bot[]>(`${baseURL}/bots/get/?botid=${game.blackid}`),
                fetchJSON<Bot[]>(`${baseURL}/bots/get/?botid=${game.winnerid}`),
                fetchJSON<Move[]>(`${baseURL}/games/moves?gameid=${game.gameid}`)
            ]);

            return {
                game,
                white: white[0],
                black: black[0],
                winner: winner[0],
                moves: moves
            }
        })
    );

    return all ? results : results[0];
}
