import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Settings | Dashboard",
  description: "Manage your profile settings and preferences",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Update your profile information and account settings
        </p>
      </div>
      <div className="space-y-8">
        <ProfileForm user={session?.user} />
      </div>
    </div>
  );
}
