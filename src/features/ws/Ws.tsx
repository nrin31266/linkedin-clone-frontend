import { CompatClient, Stomp } from "@stomp/stompjs";
import { createContext, useContext, useEffect, useState } from "react";

const WsContext = createContext<CompatClient | null>(null);

export const useWebSocket = () => useContext(WsContext);

import React from "react";

const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  useEffect(() => {
    const client = Stomp.client("ws://localhost:8080/api/v1/ws");


    client.connect(
      {},
      () => {
        console.log("Connected WebSocket");
        setStompClient(client);
      },
      (error: unknown) => {
        console.log("Error connecting WebSocket:", error);
      }
    );

    return () =>{
        if(client.connected){
            client.disconnect();
            console.log("Disconnected WebSocket");
        }
    }
  }, []);

  return <WsContext.Provider value={stompClient}>{children}</WsContext.Provider>;
};

export default WebSocketProvider;
