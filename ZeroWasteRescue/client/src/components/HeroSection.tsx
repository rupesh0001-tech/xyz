import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Utensils, MapPin } from "lucide-react";
import heroImage from "@assets/generated_images/Food_sharing_community_collaboration_0e338ad3.png";

interface HeroSectionProps {
  onGetStarted: () => void;
  userType: "provider" | "ngo" | null;
}

export default function HeroSection({ onGetStarted, userType }: HeroSectionProps) {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="People sharing food and working together"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Bridge the Gap Between
          <span className="text-primary"> Food Surplus</span> and
          <span className="text-primary"> Community Need</span>
        </h1>
        
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Connect food providers like hotels and restaurants with NGOs to reduce waste 
          and feed communities. Every meal saved makes a difference.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            onClick={onGetStarted}
            data-testid="button-get-started"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {userType === "provider" ? "Register Food" : userType === "ngo" ? "Find Food" : "Get Started"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="bg-black/20 border-white/30 text-white hover:bg-black/30"
            data-testid="button-learn-more"
          >
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-flex items-center justify-center mb-2">
              <Utensils className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-white" data-testid="text-meals-saved">12,000+</div>
            <div className="text-white/80">Meals Saved</div>
          </div>
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-white" data-testid="text-partners">150+</div>
            <div className="text-white/80">Partner Organizations</div>
          </div>
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-flex items-center justify-center mb-2">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-white" data-testid="text-cities">25+</div>
            <div className="text-white/80">Cities Connected</div>
          </div>
        </div>
      </div>
    </section>
  );
}