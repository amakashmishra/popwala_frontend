import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Gallery from "./pages/Gallery";
import DesignDetail from "./pages/DesignDetail";
import BookVisit from "./pages/BookVisit";
import Dashboard from "./pages/Dashboard";
import ProjectReport from "./pages/ProjectReport";
import Benefits from "./pages/Benefits";
import UploadPhotos from "./pages/UploadPhotos";
import NotFound from "./pages/NotFound";
import ChatBot from "./components/ChatBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/design/:id" element={<DesignDetail />} />
            <Route path="/book-visit" element={<BookVisit />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/project/:id" element={<ProjectReport />} />
            <Route path="/benefits" element={<Benefits />} />
            <Route path="/upload" element={<UploadPhotos />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ChatBot />
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
