import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "./db";
import { compare } from "bcrypt";

const authOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Early return on missing credentials
        if (!credentials?.email || !credentials?.password) {
          console.log("No email or password provided");
          return null;
        }

        try {
          // Fetch user by email
          const existingUser = await db.user.findUnique({
            where: { email: credentials.email },
          });

          // Early return on user not found
          if (!existingUser) {
            console.log("User not found");
            return null;
          }

          // Check password match
          const passwordMatch = await compare(
            credentials.password,
            existingUser.password
          );
          if (!passwordMatch) {
            console.log("Incorrect password");
            return null;
          }

          // Return user data on successful authentication
          return {
            id: existingUser.id,
            name:existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            pfp: existingUser.pfp,
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          name:token.name,
          email: token.email,
          role: token.role, // Include role in session
          pfp: token.pfp, // Include pfp in session
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name=user.name;
        token.email = user.email;
        token.role = user.role; // Include role in JWT token
        token.pfp = user.pfp; // Include pfp in JWT token
      }
      return token;
    },
  },
};

export { authOptions };
