import { Link } from "react-router-dom";
import { authStore } from "../stores/authStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = authStore();

  return (
    <header className="bg-[#2a1d2a] border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="bg-yellow-600 w-8 h-8 flex items-center justify-center rounded-lg">
                <MessageSquare className="size-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-[#ca9767]">Chat</h1>
            </Link>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-1.5 px-4 py-2 cursor-pointer bg-[#191922] rounded-lg">
              <div className="flex items-center justify-center">
                <Settings className="size-5 text-[#ca9767]" />
              </div>
              <span className="hidden sm:inline text-md text-[#ca9767]">
                Settings
              </span>
            </div>
            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <div className="flex items-center gap-1.5 px-4 py-2 cursor-pointer bg-[#191922] rounded-lg">
                    <User className="size-5 text-[#ca9767]" />
                    <span className="hidden sm:inline text-md text-[#ca9767]">
                      Profile
                    </span>
                  </div>
                </Link>

                <button
                  className="flex gap-1 items-center cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="size-5  text-[#ca9767]" />
                  <span className="hidden sm:inline  text-[#ca9767]">
                    Logout
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
