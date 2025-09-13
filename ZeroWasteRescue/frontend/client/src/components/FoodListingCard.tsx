import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, Users, MessageCircle, Package } from "lucide-react";

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
  claimStatus?: string;
  claimedByNgoId?: string;
  providerId?: string;
}

interface FoodListingCardProps {
  listing: FoodListing;
  onContact: (id: string) => void;
  onClaim: (id: string) => void;
  onStatusUpdate?: (id: string, status: string) => void;
  userType: "provider" | "ngo";
  currentUserId?: string;
}

export default function FoodListingCard({ 
  listing, 
  onContact, 
  onClaim, 
  onStatusUpdate, 
  userType, 
  currentUserId 
}: FoodListingCardProps) {
  const urgencyColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300", 
    high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
  };

  const isClaimedByUser = userType === "ngo" && listing.claimedByNgoId === currentUserId;
  const canUpdateStatus = isClaimedByUser && listing.claimStatus && listing.claimStatus !== 'completed' && listing.claimStatus !== 'cancelled';

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'cancelled': return 'destructive'; 
      case 'in_transit': return 'secondary';
      case 'confirmed': case 'in_process': case 'delivery_partner_assigned': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'claimed': return 'Claimed';
      case 'confirmed': return 'Confirmed';
      case 'in_process': return 'In Process';
      case 'delivery_partner_assigned': return 'Driver Assigned';
      case 'in_transit': return 'In Transit';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getNextStatusOptions = (currentStatus?: string) => {
    switch (currentStatus) {
      case 'claimed':
        return [
          { value: 'confirmed', label: 'Confirm Pickup' },
          { value: 'cancelled', label: 'Cancel Order' }
        ];
      case 'confirmed':
        return [
          { value: 'in_process', label: 'Start Processing' },
          { value: 'cancelled', label: 'Cancel Order' }
        ];
      case 'in_process':
        return [
          { value: 'delivery_partner_assigned', label: 'Assign Driver' },
          { value: 'in_transit', label: 'Pick Up Food' },
          { value: 'cancelled', label: 'Cancel Order' }
        ];
      case 'delivery_partner_assigned':
        return [
          { value: 'in_transit', label: 'Start Delivery' },
          { value: 'cancelled', label: 'Cancel Order' }
        ];
      case 'in_transit':
        return [
          { value: 'completed', label: 'Mark Delivered' }
        ];
      default:
        return [];
    }
  };

  return (
    <Card className="hover-elevate" data-testid={`card-listing-${listing.id}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-lg text-card-foreground" data-testid="text-listing-title">
            {listing.title}
          </h3>
          <div className="flex gap-2">
            <Badge 
              className={urgencyColors[listing.urgency]}
              data-testid="badge-urgency"
            >
              {listing.urgency} priority
            </Badge>
            {listing.claimStatus && listing.claimStatus !== 'open' && (
              <Badge 
                variant={getStatusColor(listing.claimStatus)}
                data-testid="badge-status"
              >
                {getStatusLabel(listing.claimStatus)}
              </Badge>
            )}
          </div>
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

        {/* Status Update Section for NGOs */}
        {canUpdateStatus && onStatusUpdate && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Update Status:</span>
              <Select 
                value={listing.claimStatus} 
                onValueChange={(value) => onStatusUpdate(listing.id, value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getNextStatusOptions(listing.claimStatus).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
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
        {userType === "ngo" && listing.claimStatus === 'open' && (
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