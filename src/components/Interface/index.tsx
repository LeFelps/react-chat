import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import ChatScreen from "../Chat";
import Sidebar from "../Sidebar";
import { Socket, io } from "socket.io-client";
import { useState } from "react";
import { User, interfaceProps } from "../Chat/types";

const socket: Socket = io(process.env.REACT_APP_SOCKET_URL as string);

const Interface = () => {

    const [partner, setPartner] = useState<User>();

    const [user, setUser] = useState<User>({
        id: "",
        name: "",
        socketId: ""
    });

    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const interfaceProps: interfaceProps = {
        socket: socket,
        isSearching: isSearching,
        setIsSearching: setIsSearching,
        user: user,
        setUser: setUser,
        partner: partner,
        setPartner: setPartner,
        isConnected: isConnected,
        setIsConnected: setIsConnected
    }

    return (
        <Box className="bg-zinc-900 h-screen w-full flex justify-center">
            <div className="chat-window flex h-screen w-full">
                <Grid container className="h-full shadow-lg">
                    <Grid item xs={4} md={3} className="bg-zinc-900">
                        <Sidebar {...interfaceProps} />
                    </Grid>
                    <Grid item xs={8} md={9} className="max-h-full">
                        <ChatScreen  {...interfaceProps} />
                    </Grid>
                </Grid>
            </div>
        </Box>
    )
}

export default Interface;