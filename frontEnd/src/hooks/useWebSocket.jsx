import { useEffect, useState, useCallback } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import msgDecode from "./messageDecode";

const useWebSocket = () => {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!url) return;

    const newSocket = new W3CWebSocket(url);
    console.log("Connecting to", url);
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    newSocket.onmessage = (message) => {
      try {
        const messageObject = JSON.parse(message.data);

        const { type, content } = msgDecode(messageObject);

        messageObject.type = type;
        messageObject.content = content;
        console.log(
          "type: " + messageObject.type + " content: " + messageObject.content
        );
        setMessage(messageObject);
        if (messageObject.type === "end") {
          newSocket.close();
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    const handleBeforeUnload = () => {
      if (
        newSocket.readyState === WebSocket.OPEN ||
        newSocket.readyState === WebSocket.CONNECTING
      ) {
        newSocket.close();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      if (
        newSocket.readyState === WebSocket.OPEN ||
        newSocket.readyState === WebSocket.CONNECTING
      ) {
        newSocket.close();
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [url]);
  const sendMessage = useCallback(
    (msg) => {
      if (socket && socket.readyState === W3CWebSocket.OPEN) {
        socket.send(msg);
      }
    },
    [socket]
  );

  return { message, sendMessage, setUrl };
};

export default useWebSocket;
