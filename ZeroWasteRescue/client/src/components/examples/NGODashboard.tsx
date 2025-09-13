import NGODashboard from "../NGODashboard";

export default function NGODashboardExample() {
  return (
    <div className="p-6 min-h-screen bg-background">
      <NGODashboard
        onContactProvider={(id) => console.log(`Contacting provider for listing ${id}`)}
        onClaimListing={(id) => console.log(`Claiming listing ${id}`)}
      />
    </div>
  );
}