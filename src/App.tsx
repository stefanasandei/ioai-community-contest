import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BecomeSetter from "./pages/BecomeSetter";
import Rules from "./pages/Rules";
import Community from "./pages/Community";
import Contests from "./pages/Contests";
import Tasks from "./pages/Tasks";
import Solution from "./pages/Solution";
import Team from "./pages/Team";
import Resources from "./pages/Resources";
import Roadmap from "./pages/Roadmap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/become-setter" element={<BecomeSetter />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/solutions/:round/:taskSlug" element={<Solution />} />
          <Route path="/team" element={<Team />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/roadmap" element={<Roadmap />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />


          {/*<Route path="/community" element={<Community />} />*/}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
