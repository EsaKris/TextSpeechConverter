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
import { Sun, Moon, User, FileText, History, Settings, LogOut } from "lucide-react";

interface HeaderProps {
  landingMode?: boolean;
}

export default function Header({ landingMode = false }: HeaderProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Different header design for landing page vs app
  if (landingMode) {
    return (
      <header className="bg-white dark:bg-gray-900 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <div className="flex-shrink-0 flex items-center cursor-pointer">
                  <FileText className="text-primary-600 h-7 w-7 mr-2" />
                  <span className="text-xl font-bold">SpeechifyDocs</span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation for Landing Page */}
            <nav className="hidden md:flex md:space-x-8 items-center">
              <Link href="/features">
                <span className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium cursor-pointer">
                  Features
                </span>
              </Link>
              
              <Link href="/pricing">
                <span className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium cursor-pointer">
                  Pricing
                </span>
              </Link>
              
              {/* Dark Mode Toggle */}
              {isMounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              )}
              
              {/* Auth Actions */}
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/convert">
                    <Button variant="outline" size="sm">Go to App</Button>
                  </Link>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative rounded-full flex items-center gap-2"
                      >
                        <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center overflow-hidden">
                          {user.profilePhoto ? (
                            <img 
                              src={user.profilePhoto} 
                              alt={user.username} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            user.username.substring(0, 1).toUpperCase()
                          )}
                        </div>
                        <span className="hidden sm:block font-medium">{user.username}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuItem className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>{user.username}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <Link href="/convert">
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Convert</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/history">
                        <DropdownMenuItem>
                          <History className="mr-2 h-4 w-4" />
                          <span>History</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/settings">
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="flex cursor-pointer items-center"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/auth">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/auth?register=true">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>
            
            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <div className="h-6 w-6 flex flex-col justify-center items-center space-y-1.5">
                  <span className={`block h-0.5 w-6 bg-gray-600 transform transition duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`block h-0.5 w-6 bg-gray-600 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`block h-0.5 w-6 bg-gray-600 transform transition duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-4 pb-4">
                <Link href="/features">
                  <span className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium cursor-pointer">
                    Features
                  </span>
                </Link>
                <Link href="/pricing">
                  <span className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium cursor-pointer">
                    Pricing
                  </span>
                </Link>
                {user ? (
                  <>
                    <Link href="/convert">
                      <span className="text-primary-600 font-medium cursor-pointer">
                        Go to App
                      </span>
                    </Link>
                    <button 
                      className="text-red-600 text-left font-medium"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth">
                      <span className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium cursor-pointer">
                        Sign In
                      </span>
                    </Link>
                    <Link href="/auth?register=true">
                      <span className="text-primary-600 font-medium cursor-pointer">
                        Sign Up
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>
    );
  }
  
  // Regular App Header
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/convert">
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <FileText className="text-primary-600 h-6 w-6 mr-2" />
                <span className="text-xl font-bold">SpeechifyDocs</span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <Link href="/convert">
                <span
                  className={`${
                    location === "/convert"
                      ? "border-primary-600 text-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                  } border-b-2 px-1 pt-1 text-sm font-medium cursor-pointer`}
                >
                  Convert
                </span>
              </Link>
              
              {user && (
                <>
                  <Link href="/history">
                    <span
                      className={`${
                        location === "/history"
                          ? "border-primary-600 text-gray-900 dark:text-white"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                      } border-b-2 px-1 pt-1 text-sm font-medium cursor-pointer`}
                    >
                      History
                    </span>
                  </Link>
                  
                  <Link href="/settings">
                    <span
                      className={`${
                        location === "/settings"
                          ? "border-primary-600 text-gray-900 dark:text-white"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                      } border-b-2 px-1 pt-1 text-sm font-medium cursor-pointer`}
                    >
                      Settings
                    </span>
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
                    <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center overflow-hidden">
                      {user.profilePhoto ? (
                        <img 
                          src={user.profilePhoto} 
                          alt={user.username} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        user.username.substring(0, 1).toUpperCase()
                      )}
                    </div>
                    <span className="hidden sm:block font-medium">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span className="font-medium">{user.username}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Link href="/settings">
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/history">
                    <DropdownMenuItem>
                      <History className="mr-2 h-4 w-4" />
                      <span>History</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="flex cursor-pointer items-center"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
