"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github, Facebook } from "lucide-react";
import Image from "next/image";

export function SocialLoginButtons() {
  return (
    <div className="grid gap-3">
      <Button
        variant="outline"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="w-full"
      >
        <Image
          src="/google.svg"
          alt="Google"
          width={20}
          height={20}
          className="mr-2"
        />
        Continue with Google
      </Button>
      
      <Button
        variant="outline"
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        className="w-full"
      >
        <Github className="mr-2 h-5 w-5" />
        Continue with GitHub
      </Button>
      
      <Button
        variant="outline"
        onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
        className="w-full"
      >
        <Facebook className="mr-2 h-5 w-5" />
        Continue with Facebook
      </Button>
    </div>
  );
}
