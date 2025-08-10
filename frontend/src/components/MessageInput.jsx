import { useState } from "react";
import { Image as ImageIcon, Send, X } from "lucide-react";
import { chatStore } from "../stores/chatStore";
import { authStore } from "../stores/authStore";

const MessageInput = () => {
  const { sendMessage, selectedChat } = chatStore();
  const { authUser } = authStore();

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  // Extract the receiver from chat participants
  const receiver = selectedChat?.participants?.find(
    (p) => p._id !== authUser._id
  );

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  // Remove selected image
  const removeImage = () => setImage(null);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Prevent page refresh

    // Prevent sending empty message
    if (!text.trim() && !image) return;

    await sendMessage({
      receiverId: receiver._id,
      text: text.trim(),
      image,
    });

    setText("");
    removeImage();
  };

  return (
    <div className="p-4 w-full">
      {/* Image preview */}
      {image && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={URL.createObjectURL(image)}
              className="w-20 h-20 object-cover rounded-md border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute cursor-pointer -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600"
              type="button"
            >
              <X className="size-3 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Message input form */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-5 py-2"
      >
        {/* Text input */}
        <input
          type="text"
          name="messageInput"
          autoComplete="off"
          className="flex-grow text-white placeholder-white/70 border-2 border-white rounded-2xl px-3 py-2 bg-transparent focus:outline-none focus:border-amber-500 transition-colors"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Image Selection */}
        <label className="flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors ">
          <ImageIcon
            size={25}
            className={image ? "text-green-500" : "text-white"}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim() && !image}
          className={`flex items-center justify-center transition-colors ${
            !text.trim() && !image ? "" : " cursor-pointer"
          }`}
        >
          <Send
            size={25}
            className={` ${
              !text.trim() && !image
                ? "text-gray-400"
                : "text-white cursor-pointer"
            }`}
          />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
