"use client";

import { signIn, signOut } from "next-auth/react";

export const SignIn: React.FC<{ signedIn: boolean }> = (props) => {
  const { signedIn } = props;

  return (
    <button
      onClick={() =>
        signedIn ? signOut() : signIn("google", { callbackUrl: "/home" })
      }
    >
      {signedIn ? "Sign Out" : "Sign In with Google"}
    </button>
  );
};
