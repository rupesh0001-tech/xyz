import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, MapPin, Clock } from "lucide-react";
import FoodListingCard, { type FoodListing } from "./FoodListingCard";
import { useFoodListings, useUpdateFoodListingStatus } from "@/hooks/useFoodListings";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

// Helper function to convert backend listings to FoodListing format
const convertToFoodListing = (listing: any): FoodListing => ({
  id: listing.id,
  title: listing.title,
  description: listing.description,
  quantity: listing.quantity,
  location: listing.location,
  provider: "Food Provider", // We'd need to join with users table to get actual name
  timePosted: new Date(listing.createdAt).toLocaleDateString() + " ago", // Simplified
  expiresIn: listing.expiresIn,
  urgency: listing.urgency as "low" | "medium" | "high",
  type: listing.foodType,
  claimStatus: listing.claimStatus,
  claimedByNgoId: listing.claimedByNgoId,
  providerId: listing.providerId
});

interface NGODashboardProps {
  onContactProvider: (listing: any, provider: any) => void;
  onClaimListing: (listingId: string) => void;
}

export default function NGODashboard({ onContactProvider, onClaimListing }: NGODashboardProps) {
  const { user } = useAuth();
  const updateStatusMutation = useUpdateFoodListingStatus();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const handleStatusUpdate = async (id: string, status: string) => {
    await updateStatusMutation.mutateAsync({ id, status });
  };

  // Get listings from API
  const { data: apiListings, isLoading } = useFoodListings({
    location: locationFilter !== "all" ? locationFilter : undefined,
    urgency: urgencyFilter !== "all" ? urgencyFilter : undefined,
    foodType: typeFilter !== "all" ? typeFilter : undefined
  });

  // Convert and filter listings
  const listings = (Array.isArray(apiListings) ? apiListings : []).map((listing: any) => convertToFoodListing(listing));
  const filteredListings = listings.filter((listing: FoodListing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.provider.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !locationFilter || locationFilter === "all" || listing.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesUrgency = !urgencyFilter || urgencyFilter === "all" || listing.urgency === urgencyFilter;
    const matchesType = !typeFilter || typeFilter === "all" || listing.type === typeFilter;

    return matchesSearch && matchesLocation && matchesUrgency && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Available Food Donations</h2>
          <p className="text-muted-foreground">Find and claim food donations from local providers</p>
        </div>
        <Badge variant="secondary" data-testid="badge-total-listings">
          {filteredListings.length} listings
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for food donations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger data-testid="select-location-filter">
                    <MapPin className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Any location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any location</SelectItem>
                    <SelectItem value="downtown">Downtown</SelectItem>
                    <SelectItem value="riverside">Riverside</SelectItem>
                    <SelectItem value="oak">Oak Avenue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                  <SelectTrigger data-testid="select-urgency-filter">
                    <Clock className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Any urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any urgency</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger data-testid="select-type-filter">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any type</SelectItem>
                    <SelectItem value="Prepared Meals">Prepared Meals</SelectItem>
                    <SelectItem value="Baked Goods">Baked Goods</SelectItem>
                    <SelectItem value="Raw Ingredients">Raw Ingredients</SelectItem>
                    <SelectItem value="Beverages">Beverages</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setLocationFilter("");
                  setUrgencyFilter("");
                  setTypeFilter("");
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-8 w-1/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-muted-foreground">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No listings found</p>
              <p>Try adjusting your search criteria or check back later for new donations.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing: FoodListing) => (
            <FoodListingCard
              key={listing.id}
              listing={listing}
              onContact={(id: string) => onContactProvider(listing, { 
                id: listing.providerId, 
                name: listing.provider || "Food Provider" 
              })}
              onClaim={onClaimListing}
              onStatusUpdate={handleStatusUpdate}
              userType="ngo"
              currentUserId={user?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}