import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Users, Clock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NGO {
  id: string;
  email: string;
  name: string;
  phone: string;
  organizationType: string;
  address: string;
  description?: string;
  isVerified: boolean;
  createdAt: string;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending");

  // Fetch NGOs by status
  const { data: pendingNgos, isLoading: loadingPending } = useQuery<NGO[]>({
    queryKey: ["admin", "ngos", "pending"],
    queryFn: async () => {
      const response = await fetch("/api/admin/ngos?status=pending", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch pending NGOs");
      return response.json();
    },
  });

  const { data: verifiedNgos, isLoading: loadingVerified } = useQuery<NGO[]>({
    queryKey: ["admin", "ngos", "verified"],
    queryFn: async () => {
      const response = await fetch("/api/admin/ngos?status=verified", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch verified NGOs");
      return response.json();
    },
  });

  const { data: allNgos, isLoading: loadingAll } = useQuery<NGO[]>({
    queryKey: ["admin", "ngos", "all"],
    queryFn: async () => {
      const response = await fetch("/api/admin/ngos", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch all NGOs");
      return response.json();
    },
  });

  // Verify NGO mutation
  const verifyMutation = useMutation({
    mutationFn: async (ngoId: string) => {
      const response = await fetch(`/api/admin/ngos/${ngoId}/verify`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to verify NGO");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "ngos"] });
      toast({
        title: "Success",
        description: "NGO has been verified successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to verify NGO",
        variant: "destructive",
      });
    },
  });

  // Reject NGO mutation
  const rejectMutation = useMutation({
    mutationFn: async (ngoId: string) => {
      const response = await fetch(`/api/admin/ngos/${ngoId}/reject`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to reject NGO");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "ngos"] });
      toast({
        title: "Success",
        description: "NGO application has been rejected",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject NGO",
        variant: "destructive",
      });
    },
  });

  const handleVerify = (ngoId: string) => {
    verifyMutation.mutate(ngoId);
  };

  const handleReject = (ngoId: string) => {
    if (confirm("Are you sure you want to reject this NGO application? This action cannot be undone.")) {
      rejectMutation.mutate(ngoId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const NGOCard = ({ ngo, showActions = true }: { ngo: NGO; showActions?: boolean }) => (
    <Card key={ngo.id} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{ngo.name}</CardTitle>
            <CardDescription>{ngo.organizationType}</CardDescription>
          </div>
          <Badge variant={ngo.isVerified ? "default" : "secondary"}>
            {ngo.isVerified ? "Verified" : "Pending"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p><strong>Email:</strong> {ngo.email}</p>
          <p><strong>Phone:</strong> {ngo.phone}</p>
          <p><strong>Address:</strong> {ngo.address}</p>
          {ngo.description && (
            <p><strong>Description:</strong> {ngo.description}</p>
          )}
          <p><strong>Applied:</strong> {formatDate(ngo.createdAt)}</p>
        </div>
        
        {showActions && !ngo.isVerified && (
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => handleVerify(ngo.id)}
              disabled={verifyMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Verify
            </Button>
            <Button
              onClick={() => handleReject(ngo.id)}
              disabled={rejectMutation.isPending}
              variant="destructive"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-2 mb-8">
        <Shield className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingNgos?.length || 0}</div>
            <p className="text-xs text-muted-foreground">NGOs awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified NGOs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedNgos?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active organizations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total NGOs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allNgos?.length || 0}</div>
            <p className="text-xs text-muted-foreground">All organizations</p>
          </CardContent>
        </Card>
      </div>

      {/* NGO Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending Verification ({pendingNgos?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="verified">
            Verified NGOs ({verifiedNgos?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="all">
            All NGOs ({allNgos?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {loadingPending ? (
            <div className="text-center py-8">Loading pending NGOs...</div>
          ) : pendingNgos?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No NGOs pending verification
            </div>
          ) : (
            <div className="space-y-4">
              {pendingNgos?.map((ngo) => (
                <NGOCard key={ngo.id} ngo={ngo} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="verified" className="mt-6">
          {loadingVerified ? (
            <div className="text-center py-8">Loading verified NGOs...</div>
          ) : verifiedNgos?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No verified NGOs yet
            </div>
          ) : (
            <div className="space-y-4">
              {verifiedNgos?.map((ngo) => (
                <NGOCard key={ngo.id} ngo={ngo} showActions={false} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          {loadingAll ? (
            <div className="text-center py-8">Loading all NGOs...</div>
          ) : allNgos?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No NGOs registered yet
            </div>
          ) : (
            <div className="space-y-4">
              {allNgos?.map((ngo) => (
                <NGOCard key={ngo.id} ngo={ngo} showActions={!ngo.isVerified} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}