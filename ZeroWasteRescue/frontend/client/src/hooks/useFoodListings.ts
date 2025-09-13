import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { foodListingsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function useFoodListings(filters?: { location?: string; urgency?: string; foodType?: string; providerId?: string }) {
  return useQuery({
    queryKey: ['food-listings', filters],
    queryFn: () => foodListingsApi.getAll(filters),
  });
}

export function useProviderFoodListings(providerId: string) {
  return useQuery({
    queryKey: ['food-listings', 'provider', providerId],
    queryFn: () => foodListingsApi.getAll({ providerId }),
    enabled: !!providerId,
  });
}

export function useFoodListing(id: string) {
  return useQuery({
    queryKey: ['food-listing', id],
    queryFn: () => foodListingsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateFoodListing() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: foodListingsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-listings'] });
      toast({
        title: "Success!",
        description: "Food listing created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateFoodListing() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => foodListingsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['food-listings'] });
      queryClient.invalidateQueries({ queryKey: ['food-listing', id] });
      toast({
        title: "Success!",
        description: "Food listing updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteFoodListing() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: foodListingsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-listings'] });
      toast({
        title: "Success!",
        description: "Food listing deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateFoodListingStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      fetch(`/api/food-listings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ claimStatus: status })
      }).then(async res => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to update status');
        }
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-listings'] });
      toast({
        title: "Status Updated!",
        description: "Food listing status updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useClaimFoodListing() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (listingId: string) => 
      fetch(`/api/food-listings/${listingId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }).then(async res => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to claim listing');
        }
        return res.json();
      }),
    onSuccess: (data) => {
      // Invalidate all food listings queries to refresh both NGO and Provider dashboards
      queryClient.invalidateQueries({ queryKey: ['food-listings'] });
      toast({
        title: "Listing Claimed!",
        description: "You have successfully claimed this listing. The provider has been notified and you can now coordinate pickup.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Unable to Claim",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}