import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Index from "./pages/Index";
import BlogLoading from "./components/BlogLoading";
import RouteBoundary, { PageLoading } from "./components/RouteBoundary";

const BecomeSetter = lazy(() => import('./pages/BecomeSetter'));
const Rules = lazy(() => import('./pages/Rules'));
const Contests = lazy(() => import('./pages/Contests'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Solution = lazy(() => import('./pages/Solution'));
const Team = lazy(() => import('./pages/Team'));
const Resources = lazy(() => import('./pages/Resources'));
const ResourceCategory = lazy(() => import('./pages/ResourceCategory'));
const ResourceSyllabus = lazy(() => import('./pages/ResourceSyllabus'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const AdminRoadmap = lazy(() => import('./pages/AdminRoadmap'));
const AdminResources = lazy(() => import('./pages/AdminResources'));
const AdminTasks = lazy(() => import('./pages/AdminTasks'));
const AdminRounds = lazy(() => import('./pages/AdminRounds'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient();
const Blogs = lazy(() => import('./pages/Blogs'));
const AdminBlogs = lazy(() => import('./pages/AdminBlogs'));
const TaskAtlas = lazy(() => import('./features/task-atlas/TaskAtlas'));
const Ratings = import.meta.env.DEV ? lazy(() => import('./pages/Ratings')) : null;

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === '/' || !pathname.startsWith('/resources/syllabus') && !pathname.startsWith('/resources/general')) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
};

const PageRoutes = () => {
  const { pathname } = useLocation();
  return <RouteBoundary resetKey={pathname}>
    <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/become-setter" element={<BecomeSetter />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/contests" element={<Contests />} />
          {Ratings && <Route path="/ratings" element={<Suspense fallback={<div className="p-20" role="status">Loading ratings…</div>}><Ratings /></Suspense>} />}
          <Route path="/contests/:roundPath/leaderboard" element={<Leaderboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/clusters" element={<Navigate to="/tasks/atlas" replace />} />
          <Route path="/tasks/atlas" element={<Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] flex items-center justify-center" role="status">Loading task atlas…</div>}><TaskAtlas /></Suspense>} />
          <Route path="/solutions/:round/:taskSlug" element={<Solution />} />
          <Route path="/team" element={<Team />} />
          <Route path="/blogs" element={<Suspense fallback={<BlogLoading page />}><Blogs /></Suspense>} />
          <Route path="/blogs/:slug" element={<Suspense fallback={<BlogLoading page article />}><Blogs /></Suspense>} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/general/:categoryId" element={<ResourceCategory />} />
          <Route path="/resources/syllabus/:sectionId" element={<ResourceSyllabus />} />
          <Route path="/resources/syllabus/:sectionId/:subsectionId" element={<ResourceSyllabus />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/rounds" element={<AdminRounds />} />
            <Route path="/admin/roadmap" element={<AdminRoadmap />} />
            <Route path="/admin/resources" element={<AdminResources />} />
            <Route path="/admin/tasks" element={<AdminTasks />} />
            <Route path="/admin/blogs" element={<Suspense fallback={<p className="p-12">Loading editor…</p>}><AdminBlogs /></Suspense>} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Suspense>
  </RouteBoundary>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <PageRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
