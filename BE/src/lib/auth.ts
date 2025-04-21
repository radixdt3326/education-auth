import {
    betterAuth
} from 'better-auth';

// import { prismaAdapter } from "better-auth/adapters/prisma";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

export const auth = betterAuth({

    // database: prismaAdapter(prisma, {
    //     provider: "postgresql",
    //   }),
    trustedOrigins: ["http://localhost:3001","http://localhost:3000"],

    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
    },

    /** if no database is provided, the user data will be stored in memory.
     * Make sure to provide a database to persist user data **/
});





// import { google } from "better-auth/providers";
// import { prismaAdapter } from "better-auth/adapters/prisma";
// // import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export const auth = betterAuth({
// //   database: prismaAdapter(prisma),
//   providers: [
//     google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
// });