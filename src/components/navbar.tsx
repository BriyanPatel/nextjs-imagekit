import Link from "next/link";

import {getCurrentUser} from "@/lib/auth";

import {LogoutButton} from "./auth/logout-button";
import Logo from "./logo";
import {ThemeSwitch} from "./theme-switch";
import UploadButton from "./upload/upload-button";

const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-5 px-6 py-4 backdrop-blur-md lg:px-8">
      <Logo />

      <div className="flex items-center gap-2.5">
        <ThemeSwitch />

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </span>
              <LogoutButton />
              <UploadButton />
            </>
          ) : (
            <Link href="/login" className="text-sm hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
