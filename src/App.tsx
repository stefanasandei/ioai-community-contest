import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Index from "./pages/Index";
import BecomeSetter from "./pages/BecomeSetter";
import Rules from "./pages/Rules";
import Community from "./pages/Community";
import Contests from "./pages/Contests";
import Tasks from "./pages/Tasks";
import Solution from "./pages/Solution";
import Team from "./pages/Team";
import Resources from "./pages/Resources";
import ResourceCategory from "./pages/ResourceCategory";
import ResourceSyllabus from "./pages/ResourceSyllabus";
import Roadmap from "./pages/Roadmap";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminRoadmap from "./pages/AdminRoadmap";
import AdminResources from "./pages/AdminResources";
import AdminTasks from "./pages/AdminTasks";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import BlogLoading from "./components/BlogLoading";

const queryClient = new QueryClient();
const Blogs = lazy(() => import('./pages/Blogs'));
const AdminBlogs = lazy(() => import('./pages/AdminBlogs'));
const TaskAtlas = lazy(() => import('./features/task-atlas/TaskAtlas'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === '/' || !pathname.startsWith('/resources/syllabus') && !pathname.startsWith('/resources/general')) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/become-setter" element={<BecomeSetter />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/contests" element={<Contests />} />
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
            <Route path="/admin/roadmap" element={<AdminRoadmap />} />
            <Route path="/admin/resources" element={<AdminResources />} />
            <Route path="/admin/tasks" element={<AdminTasks />} />
            <Route path="/admin/blogs" element={<Suspense fallback={<p className="p-12">Loading editor…</p>}><AdminBlogs /></Suspense>} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />


          {/*<Route path="/community" element={<Community />} />*/}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
