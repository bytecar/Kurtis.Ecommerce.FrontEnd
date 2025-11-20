// use-auth.tsx (FINAL Unified JWT Version)
import {
    createContext,
    ReactNode,
    useContext,
    useCallback,
} from "react";
import {
    useQuery,
    useMutation,
    UseMutationResult,
} from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AuthAPI } from "@/services/auth.service";
import type { InsertUser, LoginUser, User } from "@/shared/schema";

type LoginData = LoginUser;
type RegisterData = InsertUser;

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
    login: UseMutationResult<User, Error, LoginData>;
    register: UseMutationResult<User, Error, RegisterData>;
    logout: UseMutationResult<void, Error, void>;
    refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { toast } = useToast();

    // ############################
    // LOAD CURRENT USER
    // Backend must return:
    // GET /api/auth/me → { id, username, email, role }
    // ############################
    const {
        data: user,
        error,
        isLoading,
        refetch: refetchUser,
    } = useQuery<User | null, Error>({
        queryKey: ["/api/user"],
        queryFn: AuthAPI.currentUser,
        staleTime: 1000 * 60 * 5, // 5 min
        retry: false,
    });

    // ############################
    // LOGIN
    // ############################
    const login = useMutation<User, Error, LoginData>({
        mutationFn: AuthAPI.login,
        onSuccess: async () => {
            await refetchUser();
            toast({ title: "Welcome back!" });
        },
        onError: (err) => {
            toast({
                title: "Login failed",
                description: err.message,
                variant: "destructive",
            });
        },
    });

    // ############################
    // REGISTER
    // ############################
    const register = useMutation<User, Error, RegisterData>({
        mutationFn: AuthAPI.register,
        onSuccess: async () => {
            await refetchUser();
            toast({
                title: "Account created!",
                description: "You have been registered successfully.",
            });
        },
        onError: (err) => {
            toast({
                title: "Registration failed",
                description: err.message,
                variant: "destructive",
            });
        },
    });

    // ############################
    // LOGOUT
    // ############################
    const logout = useMutation({
        mutationFn: AuthAPI.logout,
        onSuccess: () => {
            queryClient.setQueryData(["/api/user"], null);
            toast({ title: "Logged out" });
        },
        onError: (err: Error) => {
            toast({
                title: "Logout failed",
                description: err.message,
                variant: "destructive",
            });
        },
    });

    // ############################
    // MANUAL REFRESH
    // ############################
    const refresh = useCallback(async () => {
        await refetchUser();
    }, [refetchUser]);

    return (
        <AuthContext.Provider
            value={{
                user: user ?? null,
                isLoading,
                error,
                login,
                register,
                logout,
                refresh,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
