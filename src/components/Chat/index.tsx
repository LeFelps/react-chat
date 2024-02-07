import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import TextField from '@mui/material/TextField';
import { IconButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { Message } from "./types";
import MessageBubble from "./Message";
import TopBar from "../Interface/TopBar";
import SensorsIcon from '@mui/icons-material/Sensors';
import GameBubble from "./Game";

const ChatScreen = ({ socket, isSearching, setIsSearching, partnerId, setPartnerId, isConnected, setIsConnected }:
  {
    socket: Socket,
    isSearching: boolean,
    setIsSearching: (isSearching: boolean) => void,
    partnerId: string,
    setPartnerId: (partnerId: string) => void,
    isConnected: boolean,
    setIsConnected: (isConnected: boolean) => void
  }) => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [gameMoves, setGameMoves] = useState<{ gameId: string, player: string, move: string }[]>([]);
  const [gamesImNext, setGamesImNext] = useState<string[]>([]);

  type User = {
    id: string;
    name: string;
    socketId: string;
  }

  const [user, setUser] = useState<User>({
    id: "",
    name: "",
    socketId: ""
  });

  const [message, setMessage] = useState<string>("");

  const [currentChatRoomId, setCurrentChatRoomId] = useState<string>("");

  const messageContainerRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo(0, messageContainerRef.current.scrollHeight);
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      sendMessage(message);
      setMessage("");
    }
  };

  const sendMessage = (message: string) => {
    socket.emit("message", currentChatRoomId, message);
  }

  const makeGameMove = (move: { gameId: string, player: string, move: string }) => {
    socket.emit("gameMove", currentChatRoomId, move);
  }


  useEffect(() => {
    socket.on("chatConnected", ({ chatRoomId, partnerId }) => {
      setCurrentChatRoomId(chatRoomId);
      setPartnerId(partnerId);
      setIsSearching(false);
      setIsConnected(true);
    });

    socket.on("chatEnded", () => {
      setIsConnected(false);
      setIsSearching(false);
      setPartnerId("");
      setCurrentChatRoomId("");
      setMessages([]);
    });

    socket.on("gameMove", (gameMove) => {
      setGameMoves((prevGameMoves) => [...prevGameMoves, gameMove]);
      if (gameMove.player === socket.id) {
        setGamesImNext((prevGamesImNext) => prevGamesImNext.filter(gameId => gameId !== gameMove.gameId));
      } else {
        setGamesImNext((prevGamesImNext) => [...prevGamesImNext, gameMove.gameId]);
      }
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      if (message.game && message.sender === socket.id) {
        setGamesImNext((prevGamesImNext) => [...prevGamesImNext, message.game.id]);
      }
    });

    socket.on("identification", (user) => {
      setUser(user);
    });

    return () => {
      socket.off("message");
      socket.off("chatConnected");
    };
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <TopBar>
        <span className="text-lg text-white self-center mx-auto ">
          {partnerId !== "" ?
            `Talking to user ${partnerId}`
            : isSearching ? "Waiting for connection..." : "Not currently chatting"}
        </span>
      </TopBar>
      <div ref={messageContainerRef} className="bg-zinc-700 px-4 py-6 flex grow overflow-y-auto overflow-x-hidden lg:px-16">
        <div className="flex flex-col w-full mt-auto">
          {isConnected ?
            <div className="flex w-full">
              <span className="w-auto mx-auto rounded bg-green-500/10 px-2 py-1 text-white/75">
                <SensorsIcon color="success" fontSize="small" className="mr-2 mb-1" />
                You are now connected to another user
              </span>
            </div>
            : null}
          {messages.map((message: Message, index: number) => {
            if (!!message.game) return <GameBubble
              message={message}
              senderId={message.sender}
              myId={socket.id}
              moves={gameMoves.filter(move => move.gameId === message.game?.id) || []}
              amINext={gamesImNext.includes(message.game?.id)}
              makeMove={makeGameMove}
            />;
            return <MessageBubble message={message} isMine={message.sender === socket.id} key={index} />
          })}
        </div>
      </div>
      <div className="bg-zinc-800 py-3 px-4">
        <div className="flex flex-row">
          <div className="grow mr-4">
            <TextField
              inputProps={{ style: { color: "white" } }}
              color="warning"
              autoComplete="off"
              fullWidth size='small'
              onChange={handleInputChange}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSendMessage();
                }
              }}
              value={message}
              disabled={!isConnected}
            />
          </div>
          <IconButton color="warning" aria-label="send"
            disabled={!isConnected}
            onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;