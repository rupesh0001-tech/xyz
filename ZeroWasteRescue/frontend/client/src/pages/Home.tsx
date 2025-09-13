import { useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import UserTypeSelector from "@/components/UserTypeSelector";
import FoodRegistrationForm from "@/components/FoodRegistrationForm";
import NGODashboard from "@/components/NGODashboard";
import ProviderDashboard from "@/components/ProviderDashboard";
import ChatInterface from "@/components/ChatInterface";
import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";
import FoodWasteAwareness from "@/components/FoodWasteAwareness";
import FeaturesSection from "@/components/FeaturesSection";
import CommunityImpact from "@/components/CommunityImpact";
import { useAuth } from "@/hooks/useAuth";
import { useCreateFoodListing, useClaimFoodListing } from "@/hooks/useFoodListings";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  // Authentication
  const { user, login, register, logout } = useAuth();
  const { toast } = useToast();
  const createFoodListingMutation = useCreateFoodListing();
  const claimFoodListingMutation = useClaimFoodListing();
  
  // UI state
  const [currentView, setCurrentView] = useState<"home" | "register-food" | "dashboard" | "provider-dashboard">("home");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentChatData, setCurrentChatData] = useState<{
    listing: {
      id: string;
      title: string;
      provider: { id: string; name: string; };
    };
    otherUser: { id: string; name: string; };
  } | null>(null);

  // Handle user type selection
  const handleUserTypeSelection = (type: "provider" | "ngo") => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    // Check if NGO is verified before allowing access
    if (type === "ngo" && user.userType === "ngo") {
      if (!user.isVerified) {
        toast({
          title: "Verification Required",
          description: "Your NGO account is pending admin verification. Please wait for approval before accessing the dashboard.",
          variant: "destructive",
        });
        return;
      }
      setCurrentView("dashboard");
    } else if (type === "provider" && user.userType === "provider") {
      setCurrentView("provider-dashboard");
    } else {
      toast({
        title: "Access denied",
        description: `You are registered as a ${user.userType}. This feature is only available for ${type}s.`,
        variant: "destructive",
      });
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setCurrentView("home");
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle authentication
  const handleLogin = async (data: any) => {
    try {
      await login(data.email, data.password);
      setIsAuthModalOpen(false);
      toast({
        title: "Success!",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (data: any) => {
    try {
      await register(data);
      setIsAuthModalOpen(false);
      toast({
        title: "Success!",
        description: "Account created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle food registration
  const handleFoodRegistration = async (data: any) => {
    try {
      await createFoodListingMutation.mutateAsync(data);
      setCurrentView("home");
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  // Handle chat
  const handleContactProvider = (listing: any, provider: any) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    // Validate required data
    if (!listing?.id || !provider?.id) {
      toast({
        title: "Error",
        description: "Unable to start chat - missing required information",
        variant: "destructive",
      });
      return;
    }

    setCurrentChatData({
      listing: {
        id: listing.id,
        title: listing.title || "Food Listing",
        provider: {
          id: provider.id,
          name: provider.name || "Food Provider"
        }
      },
      otherUser: {
        id: provider.id,
        name: provider.name || "Food Provider"
      }
    });
    setIsChatOpen(true);
  };

  const handleClaimListing = async (listingId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (user.userType !== "ngo") {
      toast({
        title: "Access Denied",
        description: "Only NGOs can claim food listings.",
        variant: "destructive",
      });
      return;
    }

    if (!user.isVerified) {
      toast({
        title: "Verification Required",
        description: "Your NGO account must be verified before you can claim listings.",
        variant: "destructive",
      });
      return;
    }

    try {
      await claimFoodListingMutation.mutateAsync(listingId);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "register-food":
        return (
          <div className="min-h-screen bg-background py-8 px-4">
            <FoodRegistrationForm
              onSubmit={handleFoodRegistration}
              onCancel={() => setCurrentView("home")}
            />
          </div>
        );
      
      case "dashboard":
        return (
          <div className="min-h-screen bg-background py-8 px-4">
            <NGODashboard
              onContactProvider={handleContactProvider}
              onClaimListing={handleClaimListing}
            />
          </div>
        );
      
      case "provider-dashboard":
        return (
          <div className="min-h-screen bg-background py-8 px-4">
            <ProviderDashboard
              onCreateNew={() => setCurrentView("register-food")}
              onEditListing={(listing) => {
                // TODO: Implement edit functionality
                toast({
                  title: "Edit Listing",
                  description: "Edit functionality coming soon!"
                });
              }}
              onViewMessages={(listing) => {
                // ProviderDashboard passes listing with claimedBy NGO data
                if (listing.claimedBy) {
                  handleContactProvider(listing, listing.claimedBy);
                } else {
                  toast({
                    title: "No NGO to message",
                    description: "This listing hasn't been claimed by any NGO yet.",
                    variant: "default"
                  });
                }
              }}
            />
          </div>
        );
      
      default:
        return (
          <>
            <HeroSection 
              onGetStarted={() => {
                if (user?.userType) {
                  handleUserTypeSelection(user.userType);
                } else {
                  // Scroll to user type selector
                  document.getElementById('user-type-selector')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              userType={user?.userType || null}
            />
            {!user && (
              <div id="user-type-selector">
                <UserTypeSelector onSelectType={handleUserTypeSelection} />
              </div>
            )}
            
            {/* Food Waste Impact Content */}
            <FoodWasteAwareness />
            
            {/* Statistics and Features */}
            <FeaturesSection />
            
            {/* Community Impact */}
            <CommunityImpact />
          </>
        );
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <Navigation
        user={user}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {renderCurrentView()}

      {/* Footer - only show on home view */}
      {currentView === "home" && <Footer />}

      {/* Chat Interface */}
      {currentChatData && user && (
        <ChatInterface
          isOpen={isChatOpen}
          onClose={() => {
            setIsChatOpen(false);
            setCurrentChatData(null);
          }}
          listing={currentChatData.listing}
          otherUser={currentChatData.otherUser}
          currentUserId={user.id}
          userType={user.userType}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}