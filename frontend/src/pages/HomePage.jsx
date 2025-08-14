import { chatStore } from "../stores/chatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedChat } = chatStore();

  return (
    <div className="h-screen">
      <div className="flex items-center justify-center pt-22 px-4">
        <div className="rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-7rem)] bg-[#2a1d2a]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedChat ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
