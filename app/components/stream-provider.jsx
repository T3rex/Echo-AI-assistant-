import { Chat } from "stream-chat-react";
import { useStreamClients } from "../hooks/use-stream-clients";
import { StreamVideo } from "@stream-io/video-react-sdk";

const apikey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export default function StreamProvider({ children, user, token }) {
  const { videoClient, chatClient } = useStreamClients({ apikey, user, token });

  if (!videoClient || !chatClient) {
    return <div>Connecting...</div>;
  }

  return (
    <StreamVideo client={videoClient}>
      <Chat client={chatClient}>{children}</Chat>
    </StreamVideo>
  );
}
