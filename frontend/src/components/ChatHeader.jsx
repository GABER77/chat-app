import { X } from "lucide-react";
import { chatStore } from "../stores/chatStore";
import { authStore } from "../stores/authStore";

const ChatHeader = () => {
  const { selectedChat, setSelectedChat } = chatStore();
  const { onlineUsers = [] } = authStore();

  // If no chat is selected, don't render anything
  if (!selectedChat) return null;

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* User Image */}
          <div className="avatar">
            <div className="size-10 rounded-full overflow-hidden relative">
              <img
                className="w-full h-full object-cover"
                src={selectedChat.profileImage || "/default-avatar.jpg"}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium text-white">{selectedChat.name}</h3>
            <p className="text-xs text-gray-300">
              {onlineUsers.includes(selectedChat._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          className="text-white cursor-pointer"
          onClick={() => setSelectedChat(null)}
        >
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
