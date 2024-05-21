"use client";

import { useState } from "react";
import { message } from "./types";

export default function Home() {
  let webSocket: WebSocket;
  const [conversation, setconversation] = useState<message[]>([{sub:'a',text:'b'}]);
  function handlesubmit(e: any) {
    e.preventDefault();
    try {
      if (webSocket.readyState !== 1) {
        throw new Error();
      }
    } catch (error) {
      webSocket = new WebSocket("ws://127.0.0.1:5000/echo");
    }
    const data = {
      sub: e.target.key.value,
      text: e.target.text.value,
    };
    if (webSocket.readyState === 1) {
      webSocket.send(JSON.stringify(data));
    } else {
      webSocket.onopen = (event) => {
        console.log("connection established");
        webSocket.send(JSON.stringify(data));
        webSocket.onmessage = (event) => {
          const res = event.data;
          console.log("data received");
          const json=JSON.parse(res) as message
          setconversation(()=>[...conversation,json])
          console.log(conversation);
        };
      };
    }
  }
  return (
    <div className="flex flex-col">
      <form onSubmit={handlesubmit}>
        <input placeholder="key" id="key" type="text"></input>
        <input placeholder="text" id="text" type="text"></input>
        <button type="submit">click</button>
      </form>
      {conversation.map((item: message) => (
        <div key={item.sub}>{item.sub} {item.text}</div>
      ))}
    </div>
  );
}
