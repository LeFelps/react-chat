import { Socket } from "socket.io-client";

export type Message = {
  sender: string;
  message: string;
  timestamp: string;
  game?: Game;
};

export type Game = {
  id: string;
  type: string;
}

export type User = {
  id: string;
  name: string;
  socketId: string;
}

export type interfaceProps = {
  socket: Socket;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  user: User;
  setUser: (user: User) => void;
  partner: User | undefined;
  setPartner: (partner?: User) => void;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
}