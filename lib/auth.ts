import { betterAuth } from "better-auth"

import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { minimumPasswordLength, registrationRole } from "@/lib/auth-validation"

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string)
const db = client.db("tutorlagbe_db")
const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim()
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim()

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
  socialProviders:
    googleClientId && googleClientSecret
      ? { google: { clientId: googleClientId, clientSecret: googleClientSecret } }
      : {},
  database: mongodbAdapter(db, {
    client,
  }),
})
