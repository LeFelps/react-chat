import { Game, Message } from "../types";
import GameProvider from "./Context";
import TicTacToe from "./Types/TicTacToe";

function GameBubble(props: {
    message: Message,
    senderId: string,
    myId: string,
    moves: { player: string, move: string }[],
    amINext: boolean,
    makeMove: (move: { gameId: string, player: string, move: string }) => void
}) {

    const game = props.message.game as Game;

    return (
        <GameProvider {...props}>
            {game.type === "TICTACTOE" ?
                <TicTacToe /> : null}
        </GameProvider>)
}

export default GameBubble;