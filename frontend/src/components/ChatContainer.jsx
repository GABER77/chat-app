import { useEffect } from "react";
import { chatStore } from "../stores/chatStore";
import { authStore } from "../stores/authStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedChat } =
    chatStore();
  const { authUser } = authStore();

  useEffect(() => {
    getMessages(selectedChat._id);
  }, [selectedChat._id, getMessages]);

  // Loading Spinner
  if (isMessagesLoading)
    return (
      <div className="flex justify-center items-center flex-1">
        <div className="w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Chat header with user info */}
      <ChatHeader />

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length > 0 ? (
          messages.map((msg) => {
            // Determine if the message was sent by the logged-in user
            const isOwnMessage =
              String(msg.sender?._id || msg.sender) === String(authUser._id);

            return (
              <div
                key={msg._id}
                // Align right if my message, left if receiver's message
                className={`flex ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  // Limit max width so long text doesn't stretch full screen
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow-md 
                    ${
                      isOwnMessage
                        ? "bg-amber-500 text-black" // My messages
                        : "bg-zinc-700 text-white" // Their messages
                    }`}
                >
                  {/* If the message has an image, render it above the text */}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="attachment"
                      className="max-w-full rounded-md mb-1"
                    />
                  )}

                  {/* If the message has text, render it */}
                  {msg.text && <p>{msg.text}</p>}
                </div>
              </div>
            );
          })
        ) : (
          // Empty state message
          <p className="text-center text-gray-400">No messages yet</p>
        )}
      </div>

      {/* Message input box */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
