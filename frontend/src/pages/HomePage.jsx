import { chatStore } from "../stores/chatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedChat } = chatStore();

  return (
    <div className="h-screen">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)] bg-[#1F1F23]">
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
