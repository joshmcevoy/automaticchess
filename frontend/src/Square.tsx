function Square({ isDark, row, col, grid }: {
    isDark: boolean;
    row: number;
    col: number;
    grid: (string | null)[][];
}) {
    const piece = grid[row]?.[col];

    const isUpperCase = (str: string) => str === str.toUpperCase();

    return (
        <div className={isDark ? "square square-d" : "square square-l"}>
            {piece != null ? (
                <img
                    src={`/pieces/${isUpperCase(piece) ? "w" : "b"}${piece.toLowerCase()}.png`}
                    width="90" height="90"
                />
            ): ""}

        </div>
    );
}

export default Square;
