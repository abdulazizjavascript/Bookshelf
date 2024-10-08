import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";

import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import type { Session, Router, Navigation } from "@toolpad/core";

import useAuth from "../hooks/useAuth";

const navigation: Navigation = [
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "books",
    title: "Books",
    icon: <AutoStoriesIcon />,
  },
  {
    segment: "search-books",
    title: "Search books",
    icon: <ContentPasteSearchIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [session, setSession] = useState<Session | null>({
    user: {
      name: user?.name,
      email: user?.email,
      image: "/ap.jpg",
    },
  });

  const authentication = useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            name: user?.name,
            email: user?.email,
            image: "/ap.jpg",
          },
        });
      },
      signOut: () => {
        logout(navigate);
      },
    };
  }, [logout, navigate, user]);

  const [pathname, setPathname] = useState("/dashboard");

  useEffect(() => {
    setPathname(location.pathname);
  }, [location]);

  const router = useMemo<Router>(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        navigate(path);
        setPathname(String(path));
      },
    };
  }, [pathname, navigate]);

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={navigation}
      router={router}
      theme={demoTheme}
      branding={{
        logo: <img src="/mui.png" alt="MUI logo" />,
        title: "BOOKSHELF",
      }}
    >
      <DashboardLayout>
        <Box
          sx={{
            p: 3,
          }}
        >
          <Outlet />
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}

export default Layout;
