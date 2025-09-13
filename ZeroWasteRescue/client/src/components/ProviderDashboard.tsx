import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash2, MessageCircle, Plus, Eye } from "lucide-react";
import { useProviderFoodListings, useUpdateFoodListing, useDeleteFoodListing } from "@/hooks/useFoodListings";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProviderDashboardProps {
  onCreateNew: () => void;
  onEditListing: (listing: any) => void;
  onViewMessages: (listing: any) => void;
}

export default function ProviderDashboard({ 
  onCreateNew, 
  onEditListing, 
  onViewMessages 
}: ProviderDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingListing, setEditingListing] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const { toast } = useToast();
  const { user } = useAuth();
  
  // SECURITY FIX: Get provider's own listings only
  const { data: apiListings, isLoading, refetch } = useProviderFoodListings(user?.id || "");
  const updateListingMutation = useUpdateFoodListing();
  const deleteListingMutation = useDeleteFoodListing();

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      return;
    }
    
    try {
      await deleteListingMutation.mutateAsync(listingId);
      refetch();
    } catch (error) {
      // Error handling is done by the mutation hook
    }
  };

  // COMPLETENESS FIX: Implement actual edit functionality
  const handleEditListing = (listing: any) => {
    setEditingListing(listing);
    setEditFormData({
      title: listing.title,
      description: listing.description,
      quantity: listing.quantity,
      location: listing.location,
      foodType: listing.foodType,
      urgency: listing.urgency,
      expiresIn: listing.expiresIn
    });
  };

  const handleSaveEdit = async () => {
    if (!editingListing) return;
    
    try {
      await updateListingMutation.mutateAsync({ 
        id: editingListing.id, 
        data: editFormData 
      });
      setEditingListing(null);
      setEditFormData({});
      refetch();
    } catch (error) {
      // Error handling is done by the mutation hook
    }
  };

  // FUNCTIONAL FIX: Fix messaging integration
  const handleViewMessages = (listing: any) => {
    // Only allow messaging if the listing has been claimed by an NGO
    if (!listing.claimedByNgoId) {
      toast({
        title: "No messages available",
        description: "This listing hasn't been claimed by any NGO yet. Messages will be available once claimed.",
        variant: "default"
      });
      return;
    }
    
    // Call the parent's onViewMessages with valid NGO data
    onViewMessages({
      ...listing,
      claimedBy: {
        id: listing.claimedByNgoId,
        name: listing.claimedByNgoName || "Claimed NGO"
      }
    });
  };

  // Filter listings based on search
  const filteredListings = (Array.isArray(apiListings) ? apiListings : []).filter((listing: any) =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Enhanced filtering for new status options
  const activeListings = filteredListings.filter((listing: any) => listing.claimStatus === 'open');
  const claimedListings = filteredListings.filter((listing: any) => 
    listing.claimStatus !== 'open' && listing.claimStatus !== 'cancelled'
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const ListingCard = ({ listing }: { listing: any }): JSX.Element => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{listing.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Posted {new Date(listing.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={listing.urgency === 'high' ? 'destructive' : 
                           listing.urgency === 'medium' ? 'default' : 'secondary'}>
              {listing.urgency} priority
            </Badge>
            {listing.claimStatus !== 'open' && (
              <Badge variant={
                listing.claimStatus === 'completed' ? 'default' :
                listing.claimStatus === 'cancelled' ? 'destructive' :
                listing.claimStatus === 'in_transit' ? 'secondary' :
                'outline'
              }>
                {listing.claimStatus === 'claimed' ? 'Claimed' :
                 listing.claimStatus === 'confirmed' ? 'Confirmed' :
                 listing.claimStatus === 'in_process' ? 'In Process' :
                 listing.claimStatus === 'delivery_partner_assigned' ? 'Driver Assigned' :
                 listing.claimStatus === 'in_transit' ? 'In Transit' :
                 listing.claimStatus === 'completed' ? 'Completed' :
                 listing.claimStatus === 'cancelled' ? 'Cancelled' :
                 listing.claimStatus}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{listing.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="font-medium">Quantity:</span> {listing.quantity}
          </div>
          <div>
            <span className="font-medium">Location:</span> {listing.location}
          </div>
          <div>
            <span className="font-medium">Food Type:</span> {listing.foodType}
          </div>
          <div>
            <span className="font-medium">Expires:</span> {listing.expiresIn}
          </div>
        </div>

        {/* Status Timeline for claimed listings */}
        {listing.claimStatus !== 'open' && listing.claimedByNgoId && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm">NGO:</span>
              <span className="text-sm">{listing.claimedByNgoName || 'Claimed NGO'}</span>
            </div>
            {listing.claimedAt && (
              <div className="text-xs text-muted-foreground">
                Claimed: {new Date(listing.claimedAt).toLocaleDateString()} at {new Date(listing.claimedAt).toLocaleTimeString()}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewMessages(listing)}
            className="flex items-center gap-2"
            disabled={!listing.claimedByNgoId}
          >
            <MessageCircle className="h-4 w-4" />
            Messages {listing.claimedByNgoId ? "" : "(No NGO yet)"}
          </Button>
          
          {listing.claimStatus === 'open' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditListing(listing)}
                className="flex items-center gap-2"
                disabled={updateListingMutation.isPending}
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteListing(listing.id)}
                className="flex items-center gap-2 text-destructive hover:text-destructive"
                disabled={deleteListingMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Food Listings</h2>
          <p className="text-muted-foreground">Manage your donated food listings</p>
        </div>
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Listing
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search your listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Badge variant="secondary">
              {filteredListings.length} total listings
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Listings Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Active ({activeListings.length})
          </TabsTrigger>
          <TabsTrigger value="claimed" className="flex items-center gap-2">
            <Badge variant="outline" className="h-4 w-4 rounded-full" />
            Claimed ({claimedListings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeListings.length > 0 ? (
            activeListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No active listings found.</p>
                <Button onClick={onCreateNew} className="mt-4">
                  Create Your First Listing
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="claimed" className="space-y-4">
          {claimedListings.length > 0 ? (
            claimedListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No claimed listings yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={!!editingListing} onOpenChange={() => setEditingListing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Food Listing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editFormData.title || ""}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                placeholder="Food listing title"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editFormData.description || ""}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                placeholder="Describe the food items..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  value={editFormData.quantity || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
                  placeholder="e.g., 5 portions"
                />
              </div>
              
              <div>
                <Label htmlFor="foodType">Food Type</Label>
                <Select 
                  value={editFormData.foodType || ""} 
                  onValueChange={(value) => setEditFormData({ ...editFormData, foodType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prepared">Prepared Food</SelectItem>
                    <SelectItem value="packaged">Packaged Food</SelectItem>
                    <SelectItem value="fresh">Fresh Produce</SelectItem>
                    <SelectItem value="baked">Baked Goods</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="urgency">Urgency</Label>
                <Select 
                  value={editFormData.urgency || ""} 
                  onValueChange={(value) => setEditFormData({ ...editFormData, urgency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="expiresIn">Expires In</Label>
                <Select 
                  value={editFormData.expiresIn || ""} 
                  onValueChange={(value) => setEditFormData({ ...editFormData, expiresIn: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Expiry time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2 hours">2 hours</SelectItem>
                    <SelectItem value="4 hours">4 hours</SelectItem>
                    <SelectItem value="8 hours">8 hours</SelectItem>
                    <SelectItem value="1 day">1 day</SelectItem>
                    <SelectItem value="2 days">2 days</SelectItem>
                    <SelectItem value="3 days">3 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editFormData.location || ""}
                onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                placeholder="Pickup location"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSaveEdit} 
                disabled={updateListingMutation.isPending}
                className="flex-1"
              >
                {updateListingMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setEditingListing(null)}
                disabled={updateListingMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}