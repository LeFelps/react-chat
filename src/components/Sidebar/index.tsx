import LinearProgress from '@mui/material/LinearProgress';
import TopBar from "../Interface/TopBar";
import IconButton from '@mui/material/IconButton'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import SensorsOffIcon from '@mui/icons-material/SensorsOff';
import { interfaceProps } from "../Chat/types";

const Sidebar = ({ socket, isSearching, setIsSearching, user, setUser, isConnected, setIsConnected }:
    interfaceProps
) => {

    function startSearch() {
        socket.emit("startSearch", (response: { status: string }) => {
            if (response.status === "success") {
                setIsSearching(true);
            }
        });
    }

    function stopSearch() {
        socket.emit("stopSearch", (response: { status: string }) => {
            if (response.status === "success") {
                setIsSearching(false);
            }
        });
    }

    function endChat() {
        socket.emit("endChat");
    }

    return (<div>
        <div className="border-r-2 border-zinc-900">
            <TopBar>
                <span className="text-lg text-white self-center mx-auto font-bold">
                    {user.name}
                </span>
            </TopBar>
        </div>
        <div className="flex flex-row border-b-2 border-zinc-900 bg-orange-600/5 text-white">
            {isConnected ?
                <div className="p-4 w-100 flex">
                    <IconButton color="error" aria-label="send"
                        onClick={endChat}>
                        <SensorsOffIcon fontSize="large" />
                    </IconButton>
                    <span className="self-center ml-3">
                        End chat
                    </span>
                </div>
                :
                isSearching ?
                    <div className="w-full">
                        <div className="p-4">
                            <IconButton color="error" aria-label="stop-search"
                                onClick={stopSearch}>
                                <StopCircleIcon fontSize="large" />
                            </IconButton>
                            <span className="self-center ml-3">
                                Stop searching
                            </span>
                        </div>
                        <LinearProgress color="warning" />
                    </div>
                    :
                    <div className="p-4 w-100 flex">
                        <IconButton color="success" aria-label="start-search"
                            onClick={startSearch}>
                            <PlayCircleFilledIcon fontSize="large" />
                        </IconButton>
                        <span className="self-center ml-3">
                            Search for chat
                        </span>
                    </div>
            }
        </div>
    </div>)
}

export default Sidebar;
