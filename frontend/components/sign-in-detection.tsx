import { useEffect } from "react";
import { useRouter } from "next/router";

export default function SignInForm({ user }) {
  const router = useRouter();

  useEffect(() => {
    if (!user || !Object.keys(user).length)
      router.push("sign-in");
  });

  return null;
}
