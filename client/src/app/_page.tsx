"use client";

import { useEffect, useState } from "react";
import { message } from "./types";
import newConnection from "./types";
export default function Home() {
  let webSocket: WebSocket;
  const [conversation, setconversation] = useState<message[]>([
    { count: 1, text: "" },
  ]);
  function handlesubmit(e: any) {
    e.preventDefault();
    try {
      if (webSocket.readyState) {
      }
    } catch (error) {
      webSocket = newConnection();
    }
    webSocket.onopen = (event) => {
      console.log("connection established");
      webSocket.send(e.target.text.value);
    };
    try {
      if (webSocket.readyState === 1) {
        webSocket.send(e.target.text.value);
      }
    } catch (error) {
      console.log(error);
    }
    webSocket.onmessage = (event) => {
      const res = JSON.parse(event.data) as message;
      console.log(res);
      handlestate(res)
      //console.log(conversation);
    };
  }
  function handlestate(res:message){
setconversation([...conversation,res])
  }

  return (
    <div className="flex flex-col h-screen">
      <form onSubmit={handlesubmit}>
        <input placeholder="text" id="text" type="text"></input>
        <button type="submit">click</button>
      </form>
      <div>
        {conversation.map((item: message) => (
          <div key={item.count}>
            <div>
              {item.count} {item.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
