# TutorLagbe

TutorLagbe is a tutoring marketplace where students can find classes and apply for tuition, teachers can publish listings and manage applicants, and administrators can moderate listings and manage accounts. This repository contains the Next.js client.

## Live URL

The live deployment URL is pending confirmation.

## Admin credentials

Demo admin sign-in details are pending. Use a dedicated demo account for assessment and share its password through the submission channel.

## Key features

- Browse tuition listings by subject, class level, and lesson format, or explore teacher profiles.
- Bookmark tuition listings, apply, track application status, cancel pending applications, and leave reviews.
- Submit tuition listings for approval, manage published listings, and review student applications from the teacher dashboard.
- Approve or reject listings, manage user accounts and roles, and review payments from the admin dashboard.
- View pricing plans, pay through Stripe Checkout, and review payment history.

## npm packages

| Purpose | Packages |
| --- | --- |
| Framework and rendering | `next`, `react`, `react-dom` |
| Authentication and database | `better-auth`, `@better-auth/mongo-adapter`, `mongodb` |
| Payments | `stripe`, `@stripe/stripe-js` |
| UI, styling, and notifications | `@base-ui/react`, `shadcn`, `class-variance-authority`, `cn`, `lucide-react`, `next-themes`, `sonner`, `tw-animate-css` |
| Validation | `zod` |
| CSS tooling | `tailwindcss`, `@tailwindcss/postcss` |
| Types, linting, and formatting | `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `eslint`, `eslint-config-next`, `prettier`, `prettier-plugin-tailwindcss` |

Package versions and scripts are listed in [package.json](package.json).
