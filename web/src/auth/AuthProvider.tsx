import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, use, useEffect, useState, type ReactNode } from "react";
import { meQuery, type Me } from "@/api/players";
import { getToken, onTokenChange } from "@/lib/graphql";

type AuthState = {
  /** True until the stored session has been checked on first load. */
  loading: boolean;
  userId: string | null;
  email: string | null;
  profile: Me | null;
  isStaff: boolean;
  isAdmin: boolean;
  /** Opens the shared login dialog from anywhere. */
  requestLogin: (mode?: "login" | "register") => void;
  loginRequest: { open: boolean; mode: "login" | "register" };
  closeLogin: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setTokenState] = useState(getToken);
  const [loginRequest, setLoginRequest] = useState<{ open: boolean; mode: "login" | "register" }>({
    open: false,
    mode: "login",
  });

  useEffect(
    () =>
      onTokenChange((next) => {
        setTokenState(next);
        // Everything cached may depend on who is logged in, so start fresh.
        queryClient.resetQueries();
      }),
    [queryClient],
  );

  const { data: profile, isPending } = useQuery({ ...meQuery(), enabled: !!token });

  const value: AuthState = {
    loading: !!token && isPending,
    userId: profile?.id ?? null,
    email: profile?.email ?? null,
    profile: profile ?? null,
    isStaff: profile?.role === "ADMIN" || profile?.role === "ORGANIZER",
    isAdmin: profile?.role === "ADMIN",
    loginRequest,
    requestLogin: (mode = "login") => setLoginRequest({ open: true, mode }),
    closeLogin: () => setLoginRequest((current) => ({ ...current, open: false })),
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthState {
  const context = use(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
