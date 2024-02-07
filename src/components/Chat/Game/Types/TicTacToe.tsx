import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CloseIcon from '@mui/icons-material/Close';
import { useGame } from '../Context';

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

function TicTacToe() {

    const { game: { id }, isMine, name } = useGame();

    return (
        <div className={`my-2 rounded relative overflow-hidden ${isMine ? "ml-auto" : "mr-auto"}`} key={id}>
            <div className={isMine ? " bg-orange-600/50" : " bg-zinc-900/60"}>
                <div className="p-2 flex flex-row flex-nowrap max-w-xs text-white">
                    <span className="font-bold overflow-hidden">
                        {name}
                    </span>
                </div>
                <div className="p-2 flex flex-col bg-white/25 rounded">
                    <BlockRow top />
                    <BlockRow />
                    <BlockRow bottom />
                </div>
            </div>
        </div>
    )
}

export default TicTacToe;

