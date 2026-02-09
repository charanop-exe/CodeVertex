import React from "react";
import { User, Code, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

// Ghibli / anime-style avatar generator (deterministic)
const getAvatarUrl = (name) => {
    if (!name) return "https://api.dicebear.com/7.x/adventurer/svg?seed=guest";
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
        name
    )}`; 
};

const Navbar = () => {
    const { authUser } = useAuthStore();

    return (
        <nav className="sticky top-0 z-50 w-full py-5">
            <div className="flex w-full justify-between mx-auto max-w-4xl bg-black/15 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-gray-200/10 p-4 rounded-2xl">

                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-3 cursor-pointer">
                    <img
                        src="/codevertex.svg"
                        alt="CodeVertex Logo"
                        className="h-10 w-10 rounded-full bg-primary/20 p-2"
                    />
                    <span className="text-lg md:text-2xl font-bold tracking-tight text-white hidden md:block">
                        CodeVertex
                    </span>
                </Link>

                {/* User Profile */}
                <div className="flex items-center gap-8">
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                                <img
                                    src={authUser?.image || getAvatarUrl(authUser?.name)}
                                    alt="User Avatar"
                                    className="object-cover"
                                />
                            </div>
                        </label>

                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-2"
                        >
                            <li>
                                <p className="text-base font-semibold text-center">
                                    {authUser?.name}
                                </p>
                                <hr className="border-gray-200/10" />
                            </li>

                            <li>
                                <Link
                                    to="/profile"
                                    className="hover:bg-primary hover:text-white text-base font-semibold"
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    My Profile
                                </Link>
                            </li>

                            {authUser?.role === "ADMIN" && (
                                <li>
                                    <Link
                                        to="/add-problem"
                                        className="hover:bg-primary hover:text-white text-base font-semibold"
                                    >
                                        <Code className="w-4 h-4 mr-2" />
                                        Add Problem
                                    </Link>
                                </li>
                            )}

                            <li>
                                <LogoutButton className="hover:bg-primary hover:text-white">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </LogoutButton>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
