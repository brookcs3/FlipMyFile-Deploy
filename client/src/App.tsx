import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import HomeExperimental from "@/pages/HomeExperimental";
import AnyFileConverter from "@/pages/AnyFileConverter";
import AutoDetectConverter from "@/pages/AutoDetectConverter";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/experimental" component={HomeExperimental}/>
      <Route path="/any-format" component={AnyFileConverter}/>
      <Route path="/auto-detect" component={AutoDetectConverter}/>
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
