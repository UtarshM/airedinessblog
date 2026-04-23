import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

// Marketing pages
import AuthPage from "@/pages/AuthPage";
import Index from "@/pages/Index";
import PricingPage from "@/pages/PricingPage";
import AgentsPage from "@/pages/AgentsPage";
import FeaturesPage from "@/pages/FeaturesPage";
import UseCasesPage from "@/pages/UseCasesPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import BlogPage from "@/pages/BlogPage";
import NotFound from "./pages/NotFound";

// Legacy dashboard pages
import DashboardPage from "@/pages/DashboardPage";
import GeneratePage from "@/pages/GeneratePage";
import BulkGeneratePage from "@/pages/BulkGeneratePage";
import ContentViewPage from "@/pages/ContentViewPage";
import IntegrationsPage from "@/pages/IntegrationsPage";
import ShopifyIntegrationPage from "@/pages/ShopifyIntegrationPage";
import WordPressIntegrationPage from "@/pages/WordPressIntegrationPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import SettingsPage from "@/pages/SettingsPage";
import CalendarPage from "@/pages/CalendarPage";
import { ManagePostsPage, BrandIdentityPage } from "@/pages/Placeholders";

// Project-scoped layout & pages
import { ProjectLayout } from "@/pages/project/ProjectLayout";
import { ProjectOverviewPage } from "@/pages/project/ProjectOverviewPage";
import { KeywordResearchPage } from "@/pages/project/KeywordResearchPage";
import { SocialPostsPage } from "@/pages/project/SocialPages";
import { SocialCalendarPage } from "@/pages/project/SocialCalendarPage";
import { ComingSoonPage } from "@/pages/project/ComingSoonPage";
import { MetaAdsPage, MetaAdsAnalyticsPage, GoogleAdsPage, GoogleAdsAnalyticsPage } from "@/pages/project/AdsPages";
import { SeoKeywordsPage, BacklinksPage } from "@/pages/project/SeoPages";
import { AeoPromptGenerationPage, AeoAnalyticsPage, AeoVisibilityScorePage, AeoOpportunitiesPage } from "@/pages/project/AeoPages";
import { BrandWorkspacePage, CompetitorsPage } from "@/pages/project/BrandWorkspacePage";
import { ProjectSettingsPage, ProjectIntegrationsPage } from "@/pages/project/ProjectSettingsPages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              {/* Public marketing */}
              <Route path="/" element={<Index />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/use-cases" element={<UseCasesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Protected dashboard */}
              <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                {/* Legacy global routes (kept for backwards compat) */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/generate" element={<GeneratePage />} />
                <Route path="/bulk-generate" element={<BulkGeneratePage />} />
                <Route path="/content/:id" element={<ContentViewPage />} />
                <Route path="/manage-posts" element={<ManagePostsPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/brand-identity" element={<BrandIdentityPage />} />
                <Route path="/integrations" element={<IntegrationsPage />} />
                <Route path="/integrations/shopify" element={<ShopifyIntegrationPage />} />
                <Route path="/integrations/wordpress" element={<WordPressIntegrationPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />

                {/* Project-scoped routes */}
                <Route path="/project/:projectId" element={<ProjectLayout><ProjectOverviewPage /></ProjectLayout>} />

                {/* Content Creation */}
                <Route path="/project/:projectId/keyword-research" element={<ProjectLayout><KeywordResearchPage /></ProjectLayout>} />
                <Route path="/project/:projectId/generate" element={<ProjectLayout><GeneratePage /></ProjectLayout>} />
                <Route path="/project/:projectId/bulk-generate" element={<ProjectLayout><BulkGeneratePage /></ProjectLayout>} />
                <Route path="/project/:projectId/manage-posts" element={<ProjectLayout><ManagePostsPage /></ProjectLayout>} />
                <Route path="/project/:projectId/calendar" element={<ProjectLayout><CalendarPage /></ProjectLayout>} />

                <Route path="/project/:projectId/social-posts" element={<ProjectLayout><SocialPostsPage /></ProjectLayout>} />
                <Route path="/project/:projectId/social-calendar" element={<ProjectLayout><SocialCalendarPage /></ProjectLayout>} />
                <Route path="/project/:projectId/social-reels" element={<ProjectLayout><ComingSoonPage title="Video / Reel Generation" description="Generate short-form video scripts and reels from your blog content." features={["AI Video Script","Reel Storyboard","Auto-captioning"]} /></ProjectLayout>} />

                {/* Performance Ads */}
                <Route path="/project/:projectId/ads/meta" element={<ProjectLayout><MetaAdsPage /></ProjectLayout>} />
                <Route path="/project/:projectId/ads/meta-analytics" element={<ProjectLayout><MetaAdsAnalyticsPage /></ProjectLayout>} />
                <Route path="/project/:projectId/ads/google" element={<ProjectLayout><GoogleAdsPage /></ProjectLayout>} />
                <Route path="/project/:projectId/ads/google-analytics" element={<ProjectLayout><GoogleAdsAnalyticsPage /></ProjectLayout>} />

                {/* SEO */}
                <Route path="/project/:projectId/seo/keywords" element={<ProjectLayout><SeoKeywordsPage /></ProjectLayout>} />
                <Route path="/project/:projectId/seo/backlinks" element={<ProjectLayout><BacklinksPage /></ProjectLayout>} />

                {/* AEO */}
                <Route path="/project/:projectId/aeo/prompt-generation" element={<ProjectLayout><AeoPromptGenerationPage /></ProjectLayout>} />
                <Route path="/project/:projectId/aeo/analytics" element={<ProjectLayout><AeoAnalyticsPage /></ProjectLayout>} />
                <Route path="/project/:projectId/aeo/visibility-score" element={<ProjectLayout><AeoVisibilityScorePage /></ProjectLayout>} />
                <Route path="/project/:projectId/aeo/opportunities" element={<ProjectLayout><AeoOpportunitiesPage /></ProjectLayout>} />

                {/* Brand */}
                <Route path="/project/:projectId/brand" element={<ProjectLayout><BrandWorkspacePage /></ProjectLayout>} />
                <Route path="/project/:projectId/competitors" element={<ProjectLayout><CompetitorsPage /></ProjectLayout>} />

                {/* Settings */}
                <Route path="/project/:projectId/integrations" element={<ProjectLayout><ProjectIntegrationsPage /></ProjectLayout>} />
                <Route path="/project/:projectId/settings" element={<ProjectLayout><ProjectSettingsPage /></ProjectLayout>} />

                {/* Content view within project */}
                <Route path="/project/:projectId/content/:id" element={<ProjectLayout><ContentViewPage /></ProjectLayout>} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
