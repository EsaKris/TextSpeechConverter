import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // Get conversion count for guests
  const { data: conversionData } = useQuery({
    queryKey: ["/api/conversions/count"],
    enabled: !user,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Update theme based on user preference if logged in
    if (user && isMounted) {
      setTheme(user.darkMode ? "dark" : "light");
    }
  }, [user, isMounted, setTheme]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <i className="fas fa-file-audio text-primary-600 text-2xl mr-2"></i>
                <span className="text-xl font-bold">VoiceDoc</span>
              </a>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <Link href="/">
                <a
                  className={`${
                    location === "/"
                      ? "border-primary-600 text-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                  } border-b-2 px-1 pt-1 text-sm font-medium`}
                >
                  Convert
                </a>
              </Link>
              
              {user && (
                <>
                  <Link href="/history">
                    <a
                      className={`${
                        location === "/history"
                          ? "border-primary-600 text-gray-900 dark:text-white"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                      } border-b-2 px-1 pt-1 text-sm font-medium`}
                    >
                      History
                    </a>
                  </Link>
                  
                  <Link href="/settings">
                    <a
                      className={`${
                        location === "/settings"
                          ? "border-primary-600 text-gray-900 dark:text-white"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                      } border-b-2 px-1 pt-1 text-sm font-medium`}
                    >
                      Settings
                    </a>
                  </Link>
                </>
              )}
            </nav>
          </div>
          
          <div className="flex items-center">
            {/* Free Conversions Counter for Guest */}
            {!user && (
              <div className="mr-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">
                  {conversionData ? `${conversionData.count}/${conversionData.limit}` : "0/3"}
                </span> conversions today
              </div>
            )}
            
            {/* Dark Mode Toggle */}
            {isMounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="mr-4"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
            
            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full flex items-center gap-2 pr-2"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center">
                      {user.username.substring(0, 1).toUpperCase()}
                    </div>
                    <span className="hidden sm:block font-medium">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem className="flex items-center">
                    <span className="font-medium">{user.username}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = "/settings"}>
                    <i className="fas fa-cog mr-2 text-sm"></i>
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = "/history"}>
                    <i className="fas fa-history mr-2 text-sm"></i>
                    <span>History</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="flex cursor-pointer items-center"
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt mr-2 text-sm"></i>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => window.location.href = "/auth"}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
