import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, User, Mail, Phone, MapPin } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (data: any) => void;
  onRegister: (data: any) => void;
  initialTab?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, onLogin, onRegister, initialTab = "login" }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    userType: "provider" as "provider" | "ngo",
    organizationType: "",
    address: "",
    description: ""
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-determine userType based on organizationType
    const ngoOrgTypes = ["ngo", "food-bank", "community-group"];
    const userType = ngoOrgTypes.includes(registerData.organizationType) ? "ngo" : "provider";
    
    const registrationData = {
      ...registerData,
      userType
    };
    
    onRegister(registrationData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to FoodBridge</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" data-testid="tab-login">Sign In</TabsTrigger>
            <TabsTrigger value="register" data-testid="tab-register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    placeholder="your@email.com"
                    className="pl-9"
                    required
                    data-testid="input-login-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    placeholder="Enter your password"
                    required
                    data-testid="input-login-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" data-testid="button-login">
                Sign In
              </Button>
            </form>

          </TabsContent>

          <TabsContent value="register" className="space-y-4 max-h-96 overflow-y-auto">
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Basic Info */}
              <div className="space-y-2">
                <Label htmlFor="register-name">Organization/Contact Name*</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="register-name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                    placeholder="Your name or organization"
                    className="pl-9"
                    required
                    data-testid="input-register-name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email*</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    placeholder="your@email.com"
                    className="pl-9"
                    required
                    data-testid="input-register-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-phone">Phone Number*</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="register-phone"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                    className="pl-9"
                    required
                    data-testid="input-register-phone"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-type">Organization Type*</Label>
                <Select value={registerData.organizationType} onValueChange={(value) => setRegisterData({...registerData, organizationType: value})}>
                  <SelectTrigger data-testid="select-org-type">
                    <SelectValue placeholder="Select your type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="hostel">Hostel</SelectItem>
                    <SelectItem value="catering">Catering Service</SelectItem>
                    <SelectItem value="ngo">NGO/Charity</SelectItem>
                    <SelectItem value="food-bank">Food Bank</SelectItem>
                    <SelectItem value="community-group">Community Group</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-address">Address*</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                  <Textarea
                    id="register-address"
                    value={registerData.address}
                    onChange={(e) => setRegisterData({...registerData, address: e.target.value})}
                    placeholder="Full address including city and postal code"
                    className="pl-9 resize-none"
                    rows={2}
                    required
                    data-testid="input-register-address"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-description">Brief Description</Label>
                <Textarea
                  id="register-description"
                  value={registerData.description}
                  onChange={(e) => setRegisterData({...registerData, description: e.target.value})}
                  placeholder="Tell us about your organization and how you plan to use FoodBridge"
                  className="resize-none"
                  rows={3}
                  data-testid="input-register-description"
                />
              </div>

              {/* Password Fields */}
              <div className="space-y-2">
                <Label htmlFor="register-password">Password*</Label>
                <Input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  placeholder="Create a password"
                  required
                  data-testid="input-register-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Confirm Password*</Label>
                <Input
                  id="register-confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                  placeholder="Confirm your password"
                  required
                  data-testid="input-register-confirm-password"
                />
              </div>

              <Button type="submit" className="w-full" data-testid="button-register">
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-xs text-muted-foreground">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
}