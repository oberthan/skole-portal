import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Elever from "./pages/Elever";
import Laerere from "./pages/Laerere";
import Klasser from "./pages/Klasser";
import Fag from "./pages/Fag";
import Skema from "./pages/Skema";
import Lokaler from "./pages/Lokaler";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/elever" element={<ProtectedRoute><Elever /></ProtectedRoute>} />
            <Route path="/laerere" element={<ProtectedRoute allowedRoles={['admin', 'lærer']}><Laerere /></ProtectedRoute>} />
            <Route path="/klasser" element={<ProtectedRoute><Klasser /></ProtectedRoute>} />
            <Route path="/fag" element={<ProtectedRoute><Fag /></ProtectedRoute>} />
            <Route path="/skema" element={<ProtectedRoute><Skema /></ProtectedRoute>} />
            <Route path="/lokaler" element={<ProtectedRoute allowedRoles={['admin', 'lærer']}><Lokaler /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
