import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./components/Auth";
import { View } from "react-native";
import { Session } from "@supabase/supabase-js";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        console.log(`User with UUID ${session.user.id} signed in.`);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (event === "SIGNED_IN" && session) {
          console.log(`User with UUID ${session.user.id} signed in.`);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* If there is a session and a user, render the AppNavigator with the session prop, otherwise render the Auth component */}
      {session && session.user ? <AppNavigator session={session} /> : <Auth />}
    </View>
  );
}
