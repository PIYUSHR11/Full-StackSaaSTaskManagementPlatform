//v3
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { authOptions } from "@/lib/auth/config"

const handler =  NextAuth(authOptions);

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
// })

export { handler as GET, handler as POST }


// //v2
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export const authOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//   },
// };

// export default NextAuth(authOptions);


//v1
//src/app/api/auth/[...nextauth]/route.ts
// import NextAuth from "next-auth";
// import { authOptions } from "@/lib/auth/config";

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };