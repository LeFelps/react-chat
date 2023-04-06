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