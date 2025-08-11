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
    <div className="p-2 border-b border-gray-300 bg-gray-50">
      {/* Search input */}
      <input
        type="text"
        placeholder="Search users..."
        value={searchText}
        onChange={handleChange}
        className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
      />

      {/* Dropdown with search results */}
      {searchText.trim() && (
        <div className="absolute bg-white shadow-lg mt-1 w-64 max-h-60 overflow-y-auto rounded-md z-10">
          {/* Show loading state */}
          {isSearching && <p className="p-2 text-gray-500">Searching...</p>}

          {/* Show empty state */}
          {!isSearching && searchResults.length === 0 && (
            <p className="p-2 text-gray-400">No results found</p>
          )}

          {/* Show user list */}
          {!isSearching &&
            searchResults.map((user) => (
              <div
                key={user._id}
                onClick={() => {
                  setSelectedChat({
                    // fake a chat object
                    _id: null,
                    participants: [authUser, user],
                  });
                  setSearchText(""); // Clear input
                  chatStore.setState({ searchResults: [] }); // Clear search results
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {user.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
