import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./components/Auth";
import { View } from "react-native";
import { Session } from "@supabase/supabase-js";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        console.log(`User with UUID ${session.user.id} signed in.`);
        checkUserProfile(session);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (event === "SIGNED_IN" && session) {
          console.log(`User with UUID ${session.user.id} signed in.`);
          checkUserProfile(session);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function checkUserProfile(session: Session) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, full_name")
        .eq("id", session.user.id)
        .single();

      if (error) {
        throw error;
      }

      // If username or full name is missing, set profileComplete to false
      if (!data?.username || !data?.full_name) {
        setProfileComplete(false);
      } else {
        setProfileComplete(true);
      }
    } catch (error) {
      console.error("Error checking user profile:", error);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {/* If there is a session and a user, render the AppNavigator with the session and profileComplete props, otherwise render the Auth component */}
      {session && session.user ? (
        <AppNavigator session={session} profileComplete={profileComplete} />
      ) : (
        <Auth />
      )}
    </View>
  );
}
