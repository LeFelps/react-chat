import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CloseIcon from '@mui/icons-material/Close';
import { useGame } from '../Context';
import { useEffect, useState } from 'react';

const Block = ({ top, bottom, left, right }: {
    top?: boolean,
    bottom?: boolean,
    left?: boolean,
    right?: boolean
}) => {

    const { message, moves, myId, amINext, makeMove, game } = useGame();

    const value = (top ? "t" : bottom ? "b" : "c") + (left ? "l" : right ? "r" : "m");
    const movePlayed = moves.find(move => move.move === value);
    const isCross = movePlayed?.player === message.sender;

    return (
        <button type="button" className={"w-24 h-24 border-2 border-black" +
            (top ? " border-t-0 " : bottom ? " border-b-0 " : "") +
            (left ? " border-l-0 " : right ? " border-r-0 " : "")
        }
            disabled={!!movePlayed || !amINext}
            onClick={() => makeMove({ gameId: game.id, player: myId, move: value })}
        >
            {!!movePlayed ? isCross ?
                <CloseIcon fontSize="large" />
                : <RadioButtonUncheckedIcon fontSize="large" />
                : ""}
        </button>
    )
}

const BlockRow = ({ top, bottom }: {
    top?: boolean,
    bottom?: boolean,
}) => {

    const props = { top, bottom }

    return (
        <div className="flex flex-row self-center">
            <Block {...props} left />
            <Block {...props} />
            <Block {...props} right />
        </div>
    )
}

function GameOverScreen({ myWin }: { myWin: boolean }) {

    const message = myWin ? "You Win!" : "You Lose!"

    return (
        <div className='w-48 flex justify-center py-4 bg-white/25 rounded'>
            <span className='text-xl text-white font-bold'>
                {message}
            </span>
        </div>
    )
}

export default function TicTacToe() {

    const { game: { id }, isMine, myId, name, moves } = useGame();
    type moveTypes = "tl" | "tm" | "tr" | "cl" | "cm" | "cr" | "bl" | "bm" | "br"

    const [winner, setWinner] = useState<string | undefined>()


    useEffect(() => {

        function isGameOver() {

            const winConditions: moveTypes[][] = [
                ["tl", "tm", "tr"],
                ["cl", "cm", "cr"],
                ["bl", "bm", "br"],
                ["tl", "cl", "bl"],
                ["tl", "cl", "bl"],
                ["tm", "cm", "bm"],
                ["tr", "cr", "br"],
                ["tl", "cm", "br"],
                ["tr", "cm", "bl"],
            ]

            const movesMade = {
                "tl": moves.find(m => m.move === "tl"),
                "tm": moves.find(m => m.move === "tm"),
                "tr": moves.find(m => m.move === "tr"),
                "cl": moves.find(m => m.move === "cl"),
                "cm": moves.find(m => m.move === "cm"),
                "cr": moves.find(m => m.move === "cr"),
                "bl": moves.find(m => m.move === "bl"),
                "bm": moves.find(m => m.move === "bm"),
                "br": moves.find(m => m.move === "br")
            }

            let result = null

            winConditions.map((wc) => {
                const [wcm1, wcm2, wcm3]: moveTypes[] = [...wc]
                const [m1, m2, m3] = [movesMade[wcm1]?.player, movesMade[wcm2]?.player, movesMade[wcm3]?.player]
                if (m1 === m2 && m2 === m3) result = m1
                return m1
            })

            return result
        }

        const winner = isGameOver()

        if (winner) setWinner(winner)

    }, [moves])

    return (
        <div className={`my-2 rounded relative overflow-hidden ${isMine ? "ml-auto" : "mr-auto"}`} key={id}>
            <div className={isMine ? " bg-orange-600/50" : " bg-zinc-900/60"}>
                <div className="p-2 flex flex-row flex-nowrap max-w-xs text-white">
                    <span className="font-bold overflow-hidden">
                        {name}
                    </span>
                </div>
                {winner ?
                    <GameOverScreen myWin={winner === myId} />
                    : <div className="p-2 flex flex-col bg-white/25 rounded">
                        <BlockRow top />
                        <BlockRow />
                        <BlockRow bottom />
                    </div>
                }
            </div>
        </div>
    )
};

