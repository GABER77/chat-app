import { useEffect } from "react";
import { chatStore } from "../stores/chatStore";
import { Users } from "lucide-react";
import { authStore } from "../stores/authStore";
import UserSearchBar from "./UserSearchBar";

const Sidebar = () => {
  const { getChats, chats, selectedChat, setSelectedChat, isChatsLoading } =
    chatStore();

  const { authUser } = authStore();

  const onlineUsers = [];

  useEffect(() => {
    getChats();
  }, [getChats]);

  // Loading Spinner
  if (isChatsLoading)
    return (
      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" />
      </aside>
    );

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Title */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6 text-white" />
          <span className="font-medium hidden lg:block text-white">
            Contacts
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <UserSearchBar />

      {/* Chat List */}
      <div className="overflow-y-auto w-full py-3">
        {chats.map((chat) => {
          // Find the receiver (other user in the chat)
          const receiver = chat.participants.find(
            (p) => p._id !== authUser._id
          );

          return (
            <button
              key={chat._id}
              onClick={() => setSelectedChat(chat)} // set active chat user
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors cursor-pointer
                ${
                  selectedChat?._id === receiver._id
                    ? "bg-[#1d232a] ring-1 ring-base-300" // highlight if selected
                    : ""
                }
              `}
            >
              {/* Profile Image */}
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={receiver.profileImage || "/default-avatar.jpg"}
                  className="size-12 object-cover rounded-full"
                />

                {/* Online Status*/}
                {onlineUsers.includes(receiver._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* User Info */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium text-white">{receiver.name}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(receiver._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}

        {/* Empty State */}
        {chats.length === 0 && (
          <div className="text-center text-zinc-400 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
