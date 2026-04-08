"use client";
import CannotConnect from "@web/components/CannotConnect";
import GlobalLoadingComponent from "@web/components/GlobalLoading.component";
import { useAuth, useLogout } from "@web/libs/hooks/api/auth.api.hooks";
import { ReactNode, useEffect, useRef } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const hasLoggedOut = useRef(false);
  const { data: user, isLoading, isError } = useAuth({ enabled: true }); // always enabled
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  // Trigger logout if user invalid
  useEffect(() => {
    if (!hasLoggedOut.current && (isError || (!isLoading && !user))) {
      hasLoggedOut.current = true;
      logout(); // triggers queryClient.clear + router.replace
    }
  }, [isLoading, user, isError, logout]);

  // Show loader while initial auth check or logout is in progress
  if (isLoading || isLoggingOut) {
    return <GlobalLoadingComponent />;
  }

  // User exists: render children
  if (user) {
    return <>{children}</>;
  }

  // If user missing and logout triggered: render nothing
  // router.replace() will handle redirect
  // eslint-disable-next-line react-hooks/refs
  if (!user && hasLoggedOut.current) {
    return <CannotConnect />;
  }

  // fallback
  return <>{children}</>;
}
