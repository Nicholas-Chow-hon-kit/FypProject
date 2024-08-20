import React, { createContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase"; // Adjust path as per your project structure
import { UserContextType, UserProviderProps } from "./AuthProvider.types";
import { Session } from "@supabase/supabase-js";
import { AuthError } from "@supabase/supabase-js";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { createTask, getTasks, updateTask, deleteTask } from "../lib/tasks";

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
        console.log("Initializing user...");
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data.session) {
          console.log("No session found, navigating to Auth...");
          navigation.navigate("Auth");
        } else {
          console.log("Session found, setting session...");

          setSession(data.session);
          await checkProfileCompletion(data.session.user.id);
        }
      } catch (error: any) {
        if (error instanceof AuthError) {
          console.error("Authentication Error:", error.message);
        } else {
          console.error("Unexpected Error:", error);
        }
        console.log("Error occurred, navigating to Auth...");
        navigation.navigate("Auth");
      } finally {
        console.log("Setting isLoading to false...");
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
          console.log("User signing in, setting session...");
          setSession(newSession);
          console.log(`User with UUID ${newSession?.user.id} has signed in.`);
          if (newSession?.user.id) {
            await checkProfileCompletion(newSession.user.id);
          }
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out, navigating to Auth...");
          navigation.navigate("Auth");
        }
      }
    );

    return () => {
      console.log("Unsubscribing from auth state changes...");
      authListener.subscription.unsubscribe(); // Unsubscribe to prevent memory leaks
    };
  }, [session]);

  // Function to check if the profile is complete
  const checkProfileCompletion = async (userId: string) => {
    console.log(
      `Checking profile completion for user with UUID ${userId} is running.`
    );
    try {
      console.log("Fetching user profile...");

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("username, full_name")
        .eq("id", userId)
        .single();
      console.log("Query executed");

      if (error) throw error;

      console.log("Profile data retrieved!");

      if (
        !profileData ||
        profileData.username === null ||
        profileData.full_name === null
      ) {
        console.log("Profile incomplete, navigating to ProfileSetup...");
        navigation.navigate("ProfileSetup");
      } else {
        console.log("Profile complete, navigating to HomeTabs...");
        navigation.navigate("HomeTabs");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      console.log("Error occurred, navigating to Auth...");
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
