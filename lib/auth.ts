import { betterAuth } from "better-auth"

import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { minimumPasswordLength, registrationRole } from "@/lib/auth-validation"

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string)
const db = client.db("tutorlagbe_db")

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: minimumPasswordLength,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "student",
        validator: { input: registrationRole },
      },
      plan: {
        type: "string",
        defaultValue: "free",
        input: false,
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/update-user" && ctx.body?.role !== undefined) {
        throw new APIError("BAD_REQUEST", {
          message: "Role changes require an administrator.",
        })
      }
    }),
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
})
