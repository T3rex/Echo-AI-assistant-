"use client";

import { useEffect, useState } from "react";
import { StreamVideoClient } from "@stream-io/video-client";
import { StreamChat } from "stream-chat";

export function useStreamClients({ apikey, user, token }) {
  const [videoClient, setVideoClient] = useState(null);
  const [chatClient, setChatClient] = useState(null);

  useEffect(() => {
    if (!apikey || !user || !token) return;

    let isMounted = true;
    const initClients = async () => {
      try {
        const tokenProvider = () => Promise.resolve(token);

        const myVideoClient = new StreamVideoClient(
          apikey,
          user,
          tokenProvider,
        );
        const myChatClient = StreamChat.getInstance(apikey);
        await myChatClient.connectUser(user, tokenProvider);
        if (isMounted) {
          setVideoClient(myVideoClient);
          setChatClient(myChatClient);
        }
      } catch (error) {
        console.error("Error initializing Stream clients:", error);
      }
    };
    initClients();
    return async () => {
      isMounted = false;
      if (videoClient) {
        await videoClient.disconnectUser();
      }
      if (chatClient) {
        await chatClient.disconnectUser();
      }
      setVideoClient(null);
      setChatClient(null);
    };
  }, [apikey, user, token]);
  return { videoClient, chatClient };
}
