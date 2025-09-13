import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { UserCircle, Menu, X, Heart, LogOut, Shield } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  userType: "provider" | "ngo";
  isAdmin: boolean;
  isVerified: boolean;
}

interface NavigationProps {
  user: User | null;
  onAuthClick: () => void;
  onLogout: () => void;
}

export default function Navigation({ user, onAuthClick, onLogout }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutConfirm = () => {
    onLogout();
    setShowLogoutConfirm(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-md">
              <Heart className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-foreground">FoodBridge</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <>
                <Badge variant="secondary" data-testid="badge-user-type">
                  {user.userType === "provider" ? "Food Provider" : user.userType === "ngo" ? "NGO" : "Admin"}
                </Badge>
                {user.userType === "ngo" && !user.isVerified && (
                  <Badge variant="destructive" className="text-xs">
                    Pending Verification
                  </Badge>
                )}
                {user.isAdmin && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/admin'}
                    data-testid="button-admin"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Button>
                )}
                <span className="text-sm text-muted-foreground">
                  {user.name}
                </span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      data-testid="button-logout"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to logout? You'll need to sign in again to access your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No, Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogoutConfirm}>
                        Yes, Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            {!user && (
              <Button 
                variant="outline" 
                onClick={onAuthClick}
                data-testid="button-auth"
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {user && (
                <>
                  <Badge variant="secondary" className="w-fit" data-testid="badge-user-type-mobile">
                    {user.userType === "provider" ? "Food Provider" : user.userType === "ngo" ? "NGO" : "Admin"}
                  </Badge>
                  {user.userType === "ngo" && !user.isVerified && (
                    <Badge variant="destructive" className="w-fit text-xs">
                      Pending Verification
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground px-2">
                    {user.name}
                  </span>
                  {user.isAdmin && (
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => {
                        window.location.href = '/admin';
                        setIsMenuOpen(false);
                      }}
                      data-testid="button-admin-mobile"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        data-testid="button-logout-mobile"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to logout? You'll need to sign in again to access your account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No, Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogoutConfirm}>
                          Yes, Logout
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
              {!user && (
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => {
                    onAuthClick();
                    setIsMenuOpen(false);
                  }}
                  data-testid="button-auth-mobile"
                >
                  <UserCircle className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}