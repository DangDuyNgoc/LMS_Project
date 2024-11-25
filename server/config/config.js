import dotenv from "dotenv";
dotenv.config();

export const config = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
};
