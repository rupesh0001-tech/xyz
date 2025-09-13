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