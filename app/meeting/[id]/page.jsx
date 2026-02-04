"use client";
import StreamProvider from "@/app/components/stream-provider";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { StreamTheme } from "@stream-io/video-react-sdk";

const MeetingPage = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  const callId = params.id;
  const name = searchParams.get("name") || "anonymous";

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setUser({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
    });
  }, [name]);

  useEffect(() => {
    if (!user) return;

    fetch("/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.id }),
    })
      .then((res) => res.json())
      .then((data) => setToken(data.token))
      .catch((err) => setError(err));
  }, [user]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="p-8 bg-gray-800/60 rounded-2xl border border-gray-700 w-80 backdrop-blur-sm shadow-2xl">
          <h2 className="text-xl font-semibold mb-4 text-center text-red-500">
            Failed to join the meeting. Please try again.
          </h2>
          <p>{error.message}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-5 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium shadow-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="p-8 bg-gray-800/60 rounded-2xl border border-gray-700 w-80 backdrop-blur-sm shadow-2xl">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Joining the meeting...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <StreamProvider token={token} user={user}>
      <StreamTheme>Meeting Room</StreamTheme>
    </StreamProvider>
  );
};

export default MeetingPage;
