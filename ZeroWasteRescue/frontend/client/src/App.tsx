import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import AdminPanel from "@/pages/AdminPanel";
import NGOLogin from "@/pages/NGOLogin";
import ProviderLogin from "@/pages/ProviderLogin";
import NotFound from "@/pages/not-found";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/ngo-login" component={NGOLogin}/>
      <Route path="/provider-login" component={ProviderLogin}/>
      <Route path="/admin">
        <ProtectedAdminRoute>
          <AdminPanel/>
        </ProtectedAdminRoute>
      </Route>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
