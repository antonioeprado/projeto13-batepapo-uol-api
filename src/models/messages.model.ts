export type Message = {
  from: string;
  to: string;
  text: string;
  type: "PRIVATE_MESSAGE" | "MESSAGE" | "STATUS";
  time: string;
};

export type MessageInput = {
  from: string;
  to: string;
  text: string;
  type: "PRIVATE_MESSAGE" | "MESSAGE" | "STATUS";
};
