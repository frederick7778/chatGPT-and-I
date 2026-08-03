import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import LandingPage from '@/pages/index';
import LoginPage from '@/pages/login';
import RegisterPage from '@/pages/register';
import DashboardPage from '@/pages/dashboard';
import ToolsPage from '@/pages/tools';
import ToolRunnerPage from '@/pages/tools/[slug]';
import HistoryPage from '@/pages/history';
import CreditsPage from '@/pages/credits';
import ProfilePage from '@/pages/profile';
import FavoritesPage from '@/pages/favorites';
import NotFound from '@/pages/not-found';
import { AppShell } from '@/components/app-shell';

const queryClient = new QueryClient();

function Router() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/tools" component={ToolsPage} />
        <Route path="/tools/:slug" component={ToolRunnerPage} />
        <Route path="/history" component={HistoryPage} />
        <Route path="/favorites" component={FavoritesPage} />
        <Route path="/credits" component={CreditsPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
