import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";
import ConvertPage from "@/pages/convert-page";
import AuthPage from "@/pages/auth-page";
import HistoryPage from "@/pages/history-page";
import SettingsPage from "@/pages/settings-page";
import { ProtectedRoute } from "./lib/protected-route";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

function Router() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Header landingMode={location === "/"} />
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/convert" component={ConvertPage} />
        <ProtectedRoute path="/history" component={HistoryPage} />
        <ProtectedRoute path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
      <Footer /> {/* Added Footer component */}
    </div>
  );
}

function App() {
  return (
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Router />
      </AuthProvider>
    </TooltipProvider>
  );
}

export default App;