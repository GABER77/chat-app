import { useEffect, useRef } from "react";
import { chatStore } from "../stores/chatStore";
import { authStore } from "../stores/authStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedChat } =
    chatStore();
  const { authUser } = authStore();

  // Track if it's the first time loading messages for this chat
  const isFirstLoad = useRef(true);

  // Fetch messages when selected chat changes
  useEffect(() => {
    if (selectedChat?._id) {
      getMessages(selectedChat._id);
      isFirstLoad.current = true; // Reset scroll flag for instant jump to the bottom
    }
  }, [selectedChat?._id, getMessages]);

  // Scroll chat to bottom when messages update
  useEffect(() => {
    if (!messages.length) return; // Don't scroll if no messages

    const container = document.getElementById("messagesContainer");
    if (!container) return;

    if (isFirstLoad.current) {
      // First load: jump instantly to bottom
      container.scrollTop = container.scrollHeight;
      isFirstLoad.current = false; // Mark first load done
    } else {
      // Smooth scroll to bottom
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Loading spinner
  if (isMessagesLoading) {
    return (
      <div className="flex justify-center items-center flex-1">
        <div className="w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Chat header with user info */}
      <ChatHeader />

      {/* Messages container */}
      <div
        id="messagesContainer"
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.length > 0 ? (
          messages.map((msg) => {
            // Check if this message was sent by the logged-in user
            const isOwnMessage =
              String(msg.sender?._id || msg.sender) === String(authUser._id);

            return (
              <div
                key={msg._id}
                className={`flex ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow-md ${
                    isOwnMessage
                      ? "bg-amber-500 text-black"
                      : "bg-zinc-700 text-white"
                  }`}
                >
                  {/* Render image if message contains one */}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="attachment"
                      className="max-w-[200px] rounded-md mb-1"
                    />
                  )}

                  {/* Render message text */}
                  {msg.text && <p>{msg.text}</p>}
                </div>
              </div>
            );
          })
        ) : (
          // Show placeholder when no messages exist yet
          <p className="text-center text-gray-400">No messages yet</p>
        )}
      </div>

      {/* Input box for sending new messages */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
