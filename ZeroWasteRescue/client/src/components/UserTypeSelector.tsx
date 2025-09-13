import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Heart, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface UserTypeSelectorProps {
  onSelectType: (type: "provider" | "ngo") => void;
}

export default function UserTypeSelector({ onSelectType }: UserTypeSelectorProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            How would you like to help reduce food waste?
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose your role to get started with FoodBridge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Food Provider Card */}
          <Card className="hover-elevate cursor-pointer group">
            <CardContent className="p-8 text-center">
              <div className="bg-green-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Building2 className="w-10 h-10 text-green-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">Food Provider</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Hotels, restaurants, hostels, and catering services with surplus food 
                ready to donate to those in need.
              </p>
              
              <ul className="text-sm text-muted-foreground space-y-2 mb-6 text-left">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  Register surplus food quickly
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  Connect directly with NGOs
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  Reduce waste and help communities
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  Track your social impact
                </li>
              </ul>

              <Link href="/provider-login">
                <Button 
                  className="w-full group bg-green-600 hover:bg-green-700"
                  data-testid="button-select-provider"
                >
                  I'm a Food Provider
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* NGO Card */}
          <Card className="hover-elevate cursor-pointer group">
            <CardContent className="p-8 text-center">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Heart className="w-10 h-10 text-blue-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">NGO / Charity</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Non-profit organizations, food banks, and community groups 
                helping distribute food to those who need it most.
              </p>
              
              <ul className="text-sm text-muted-foreground space-y-2 mb-6 text-left">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  Find available food donations
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  Coordinate pickup and distribution
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  Serve more community members
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  Build partnerships with providers
                </li>
              </ul>

              <Link href="/ngo-login">
                <Button 
                  className="w-full group bg-blue-600 hover:bg-blue-700"
                  data-testid="button-select-ngo"
                >
                  I'm an NGO
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            You can always switch between roles later in your profile settings
          </p>
        </div>
      </div>
    </section>
  );
}