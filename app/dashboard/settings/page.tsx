import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { executeQuery } from "@/lib/supabase";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Dashboard",
  description: "Manage your account settings and preferences",
};

interface UserSettings {
  notification_preferences: {
    email: boolean;
    push: boolean;
  };
  theme: string;
  language: string;
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  // Get user settings
  const settings = await executeQuery<UserSettings[]>(
    `SELECT notification_preferences, theme, language 
     FROM user_settings 
     WHERE user_id = $1`,
    [session?.user?.id]
  );

  // If no settings exist, create default settings
  if (settings.length === 0) {
    await executeQuery(
      `INSERT INTO user_settings (user_id) VALUES ($1)`,
      [session?.user?.id]
    );
  }

  const userSettings = settings[0] || {
    notification_preferences: { email: true, push: true },
    theme: "system",
    language: "en"
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-muted-foreground mb-8">
        Manage your account settings and preferences
      </p>
      <div className="space-y-8">
        <SettingsForm 
          user={session?.user} 
          settings={userSettings}
        />
      </div>
    </div>
  );
}
