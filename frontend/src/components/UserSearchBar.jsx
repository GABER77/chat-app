import { useState } from "react";
import { chatStore } from "../stores/chatStore";
import { authStore } from "../stores/authStore";

export default function UserSearchBar() {
  const [searchText, setSearchText] = useState("");

  const { authUser } = authStore();
  const { searchUsers, searchResults, isSearching, setSelectedChat } =
    chatStore();

  // Handle typing in the search input
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchText(value); // Update local state
    searchUsers(value); // Call search users in the database
  };

  return (
    <div className="p-2 border-b">
      {/* Search input */}
      <input
        type="text"
        placeholder="Search users..."
        value={searchText}
        onChange={handleChange}
        className="w-full p-2 rounded-md border border-gray-300 placeholder-gray-400 focus:outline-none  focus:border-yellow-500 dark:text-white"
      />

      {/* Dropdown with search results */}
      {searchText.trim() && (
        <div className="absolute bg-white shadow-lg mt-1 w-64 max-h-60 overflow-y-auto rounded-md z-10">
          {/* Show loading state */}
          {isSearching && (
            <p className="p-2 text-gray-500 bg-[#1d232a]">Searching...</p>
          )}

          {/* Show empty state */}
          {!isSearching && searchResults.length === 0 && (
            <p className="p-2 text-gray-400 bg-[#1d232a]">No results found</p>
          )}

          {/* Show user list */}
          {!isSearching &&
            searchResults.map((user) => (
              <div
                key={user._id}
                onClick={() => {
                  // Get all existing chats from the store
                  const chats = chatStore.getState().chats;

                  // Check if there is already a chat with this user
                  const existingChat = chats.find((chat) =>
                    chat.participants.some(
                      (participant) => participant._id === user._id
                    )
                  );

                  if (existingChat) {
                    // If a chat exists with this user, select it
                    setSelectedChat(existingChat);
                  } else {
                    // Otherwise, create a fake chat object
                    // Untill we send the first message and create the real chat
                    setSelectedChat({
                      _id: null,
                      participants: [authUser, user],
                    });
                  }
                  setSearchText(""); // Clear input
                  chatStore.setState({ searchResults: [] }); // Clear search results
                }}
                className="p-2 flex items-center gap-2 hover:bg-[#273039] cursor-pointer bg-[#1d232a]"
              >
                {/* Profile image */}
                <img
                  src={user.profileImage || "/default-avatar.png"}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />

                {/* Name */}
                <span className="text-gray-800 dark:text-gray-200">
                  {user.name}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
