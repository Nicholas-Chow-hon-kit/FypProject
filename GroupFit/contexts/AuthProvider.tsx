import React, { createContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase"; // Adjust path as per your project structure
import { UserContextType, UserProviderProps } from "./AuthProvider.types";
import { Session } from "@supabase/supabase-js";
import { AuthError } from "@supabase/supabase-js";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";

// Create a context to hold user-related state
export const UserContext = createContext<UserContextType>({
  user: null,
  session: null,
  setSession: () => {},
  isLoading: true,
});

export const useAuth = () => React.useContext(UserContext);

// Context provider component
export const AuthProvider = ({ children }: UserProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Initialize user on mount
  useEffect(() => {
    const initializeUser = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data.session) {
          navigation.navigate("Auth");
        } else {
          setSession(data.session);
          await checkProfileCompletion(data.session.user.id);
        }
      } catch (error: any) {
        if (error instanceof AuthError) {
          console.error("Authentication Error:", error.message);
        } else {
          console.error("Unexpected Error:", error);
        }
        navigation.navigate("Auth");
      } finally {
        setTimeout(() => setIsLoading(false), 100);
      }
    };

    initializeUser();
  }, []);

  // Auth state change listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event); // Log the auth state change
        if (event === "SIGNED_IN") {
          setSession(newSession);
          console.log(`User with UUID ${newSession?.user.id} has signed in.`);
          if (newSession?.user.id) {
            await checkProfileCompletion(newSession.user.id);
          }
        } else if (event === "SIGNED_OUT") {
          navigation.navigate("Auth");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe(); // Unsubscribe to prevent memory leaks
    };
  }, [session]);

  // Function to check if the profile is complete
  const checkProfileCompletion = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, full_name")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (!data || data.username === null || data.full_name === null) {
        navigation.navigate("ProfileSetup");
      } else {
        navigation.navigate("HomeTabs");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      navigation.navigate("Auth");
    }
  };

  // Derive user from session
  const user = useMemo(() => session?.user ?? null, [session]);

  return (
    <UserContext.Provider value={{ user, session, setSession, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
