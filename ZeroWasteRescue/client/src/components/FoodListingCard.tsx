import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, MessageCircle } from "lucide-react";

export interface FoodListing {
  id: string;
  title: string;
  description: string;
  quantity: string;
  location: string;
  provider: string;
  timePosted: string;
  expiresIn: string;
  urgency: "low" | "medium" | "high";
  type: string;
}

interface FoodListingCardProps {
  listing: FoodListing;
  onContact: (id: string) => void;
  onClaim: (id: string) => void;
  userType: "provider" | "ngo";
}

export default function FoodListingCard({ listing, onContact, onClaim, userType }: FoodListingCardProps) {
  const urgencyColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300", 
    high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
  };

  return (
    <Card className="hover-elevate" data-testid={`card-listing-${listing.id}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-lg text-card-foreground" data-testid="text-listing-title">
            {listing.title}
          </h3>
          <Badge 
            className={urgencyColors[listing.urgency]}
            data-testid="badge-urgency"
          >
            {listing.urgency} priority
          </Badge>
        </div>
        <p className="text-muted-foreground" data-testid="text-listing-description">
          {listing.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span data-testid="text-quantity">{listing.quantity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span data-testid="text-expires">Expires {listing.expiresIn}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span data-testid="text-location">{listing.location}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span data-testid="text-provider">by {listing.provider}</span>
          <span data-testid="text-time-posted">{listing.timePosted}</span>
        </div>

        <Badge variant="secondary" data-testid="badge-food-type">
          {listing.type}
        </Badge>
      </CardContent>

      <CardFooter className="pt-3 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onContact(listing.id)}
          data-testid="button-contact"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat
        </Button>
        {userType === "ngo" && (
          <Button 
            size="sm" 
            onClick={() => onClaim(listing.id)}
            data-testid="button-claim"
          >
            Claim Food
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}