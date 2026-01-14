import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Elever from "./pages/Elever";
import Laerere from "./pages/Laerere";
import Klasser from "./pages/Klasser";
import Fag from "./pages/Fag";
import Skema from "./pages/Skema";
import Lokaler from "./pages/Lokaler";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/elever" element={<Elever />} />
          <Route path="/laerere" element={<Laerere />} />
          <Route path="/klasser" element={<Klasser />} />
          <Route path="/fag" element={<Fag />} />
          <Route path="/skema" element={<Skema />} />
          <Route path="/lokaler" element={<Lokaler />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
