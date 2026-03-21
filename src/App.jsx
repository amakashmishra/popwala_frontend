import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import ChatBot from "./components/ChatBot";
import AdminLayout from "@/admin/components/AdminLayout";
import AdminDashboard from "@/admin/pages/AdminDashboard";
import DesignList from "@/admin/pages/DesignList";
import DesignForm from "@/admin/pages/DesignForm";
import CatalogManager from "@/admin/pages/CatalogManager";
import WebsiteBannersPage from "@/admin/pages/WebsiteBannersPage";
import PlaceholderPage from "@/admin/pages/PlaceholderPage";
import UsersPage from "@/admin/pages/UsersPage";
import ContractorsPage from "@/admin/pages/ContractorsPage";
import ArchitectsPage from "@/admin/pages/ArchitectsPage";
import AdminLogin from "@/admin/pages/AdminLogin";
import PortalRouteGuard from "@/components/portal/PortalRouteGuard";
import ArchitectLayout from "@/architect/components/ArchitectLayout";
import ArchitectDashboard from "@/architect/pages/ArchitectDashboard";
import ArchitectPlaceholderPage from "@/architect/pages/ArchitectPlaceholderPage";
import ArchitectLogin from "@/architect/pages/ArchitectLogin";
import ContractorLayout from "@/contractor/components/ContractorLayout";
import ContractorDashboard from "@/contractor/pages/ContractorDashboard";
import ContractorPlaceholderPage from "@/contractor/pages/ContractorPlaceholderPage";
import ContractorLogin from "@/contractor/pages/ContractorLogin";
import { adminApi, architectApi, contractorApi } from "@/lib/api";

const queryClient = new QueryClient();

const UserHomeGuard = ({ children }) => {
  const rememberedUser = localStorage.getItem("ceilocraft-user");
  const sessionUser = sessionStorage.getItem("ceilocraft-user");
  const isAuthenticated = Boolean(rememberedUser || sessionUser);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/home"
              element={
                <UserHomeGuard>
                  <Index />
                </UserHomeGuard>
              }
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/design/:id" element={<DesignDetail />} />
            <Route path="/book-visit" element={<BookVisit />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/project/:id" element={<ProjectReport />} />
            <Route path="/benefits" element={<Benefits />} />
            <Route path="/upload" element={<UploadPhotos />} />
            <Route path="/landingpage" element={<Navigate to="/" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <PortalRouteGuard role="admin" loginPath="/admin/login" verifyApi={adminApi.me}>
                  <AdminLayout />
                </PortalRouteGuard>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="designs" element={<DesignList />} />
              <Route path="designs/new" element={<DesignForm />} />
              <Route path="product-types" element={<CatalogManager />} />
              <Route path="categories" element={<CatalogManager />} />
              <Route path="styles" element={<CatalogManager />} />
              <Route path="services" element={<CatalogManager />} />
              <Route path="contractors" element={<ContractorsPage />} />
              <Route path="architects" element={<ArchitectsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="leads" element={<PlaceholderPage />} />
              <Route path="projects" element={<PlaceholderPage />} />
              <Route path="pricing" element={<PlaceholderPage />} />
              <Route path="reviews" element={<PlaceholderPage />} />
              <Route path="banners" element={<WebsiteBannersPage />} />
              <Route path="pages" element={<PlaceholderPage />} />
              <Route path="ads" element={<PlaceholderPage />} />
              <Route path="reports" element={<PlaceholderPage />} />
            </Route>
            <Route path="/architect/login" element={<ArchitectLogin />} />
            <Route
              path="/architect"
              element={
                <PortalRouteGuard
                  role="architect"
                  loginPath="/architect/login"
                  verifyApi={architectApi.me}
                >
                  <ArchitectLayout />
                </PortalRouteGuard>
              }
            >
              <Route index element={<ArchitectDashboard />} />
              <Route path="projects" element={<ArchitectPlaceholderPage />} />
              <Route path="tasks" element={<ArchitectPlaceholderPage />} />
              <Route path="clients" element={<ArchitectPlaceholderPage />} />
            </Route>
            <Route path="/contractor/login" element={<ContractorLogin />} />
            <Route
              path="/contractor"
              element={
                <PortalRouteGuard
                  role="contractor"
                  loginPath="/contractor/login"
                  verifyApi={contractorApi.me}
                >
                  <ContractorLayout />
                </PortalRouteGuard>
              }
            >
              <Route index element={<ContractorDashboard />} />
              <Route path="work-orders" element={<ContractorPlaceholderPage />} />
              <Route path="projects" element={<ContractorPlaceholderPage />} />
              <Route path="site-visits" element={<ContractorPlaceholderPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ChatBot />
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
