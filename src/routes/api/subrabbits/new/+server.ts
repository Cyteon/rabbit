import { createClerkClient } from "@clerk/backend";
import { PUBLIC_CLERK_PUBLISHABLE_KEY } from "$env/static/public";
import { CLERK_SECRET_KEY } from "$env/static/private";

const PUBLIC_KEY = `
  -----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5pSfcHch0qU3taBZvfXo
KDUezTFtL9RslLNlUAIYVlmG3eXVNxKn41ZxJubUBcRuI44veER1T6sq9nEFIiMc
KZ8wkGmU9ppIpjRoduXaMYJLZB0I4wihSkYyS2G5ZSUcfylkSkGcf79aVtH9VYtm
09WWpwA7muBKWy+Kax14UyIJViCihGtJU7tTYhKVhTKBoKa55bjNQo15TtcmC787
JN9CHd64skJCmfJhcj9BJT7F7Z6EcSgRJqDv4ZsyDj6eSxcs4Zv9KfJ1Dr1ZiZ/n
1hI992l02DE/Oum9GZKNl+flg4jNEdHfXWYt1b4kybkAKOF2AP72E+2H0OrH1apj
QQIDAQAB
-----END PUBLIC KEY-----
`;

export async function POST(req: Request) {
  const clerkClient = createClerkClient({
    secretKey: CLERK_SECRET_KEY,
    publishableKey: PUBLIC_CLERK_PUBLISHABLE_KEY,
  });

  try {
    const { isSignedIn, reason } = await clerkClient.authenticateRequest(req, {
      jwtKey: PUBLIC_KEY,
    });

    console.log("Authentication reason:", reason); // Log reason for debugging

    if (!isSignedIn) {
      return new Response(JSON.stringify({ status: 401, message: reason }), {
        status: 401,
      });
    }

    // Add logic to perform protected actions

    return new Response(JSON.stringify({ message: "This is a reply" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Authentication error:", error); // Log any errors that occur
    return new Response(
      JSON.stringify({ status: 500, message: "Internal Server Error" }),
      { status: 500 },
    );
  }
}
