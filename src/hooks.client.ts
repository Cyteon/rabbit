import type { HandleClientError } from "@sveltejs/kit";
// To use Clerk components:
import { initializeClerkClient } from "clerk-sveltekit/client";
// Or for headless mode:
// import { initializeClerkClient } from 'clerk-sveltekit/headless'
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from "$env/static/public";

initializeClerkClient(PUBLIC_CLERK_PUBLISHABLE_KEY, {
  afterSignInUrl: "/",
  afterSignUpUrl: "/",
  signInUrl: "/login",
  signUpUrl: "/register",
  appearance: {
    variables: {
      colorPrimary: "#8caaee",
      colorBackground: "#414559",
      colorText: "#c6d0f5",
      colorTextSecondary: "#b5bfe2",
      colorDanger: "#e78284",
      colorSuccess: "#a6d189",
      colorAlphaShade: "#ffffff",
      colorInputText: "#c6d0f5",
    },
    signIn: {
      variables: {
        colorInputText: "#000000",
      },
    },
    signUp: {
      variables: {
        colorInputText: "#000000",
      },
    },
  },
});

export const handleError: HandleClientError = async ({ error, event }) => {
  console.error(error, event);
};
