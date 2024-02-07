import { createContext, useContext } from "react";
import { Game, Message } from "../../types";

type GameContextType = {
    message: Message,
    senderId: string,
    myId: string,
    moves: { player: string, move: string }[],
    amINext: boolean,
    makeMove: (move: { gameId: string, player: string, move: string }) => void
}

export const GameContext = createContext<GameContextType>({
    message: { sender: "", message: "", timestamp: "", game: { id: "", type: "" } },
    senderId: "",
    myId: "",
    moves: [],
    amINext: false,
    makeMove: () => { }
});

export default function GameProvider({ message, senderId, myId, moves, amINext, makeMove, children }: {
    message: Message,
    senderId: string,
    myId: string,
    moves: { player: string, move: string }[],
    amINext: boolean,
    makeMove: (move: { gameId: string, player: string, move: string }) => void,
    children: React.ReactNode
}) {

    return (
        <GameContext.Provider value={{ message, senderId, myId, moves, amINext, makeMove }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const { message, senderId, myId, moves, amINext, makeMove } = useContext(GameContext);

    const game = message.game as Game;
    const name = message.message;
    const isMine = senderId === myId;

    return { message, senderId, myId, moves, amINext, makeMove, game, name, isMine };
}