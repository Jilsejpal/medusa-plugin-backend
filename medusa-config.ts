import { loadEnv, defineConfig } from "@medusajs/framework/utils";
import EmailPassAuthProvider from "@medusajs/medusa/auth-emailpass";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    // redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  plugins: [
    {
      resolve: "@tsc_tech/medusa-plugin-notification-template",
      options: {},
    },
    {
      resolve: "@tsc_tech/medusa-plugin-auth-passkey",
      options: {},
    },
    {
      resolve: "@tsc_tech/medusa-plugin-brand",
      options: {},
    },
    {
      resolve: "@tsc_tech/medusa-plugin-product-variant-images",
      options: {},
    },
    {
      resolve: "@tsc_tech/medusa-plugin-product-seo",
      options: {},
    },
    {
      resolve: "@tsc_tech/medusa-plugin-wishlist",
      options: {},
    },
  ],
  admin: {},
  modules: [
    {
      resolve: "@medusajs/medusa/auth",
      options: {
        providers: [
          {
            resolve: EmailPassAuthProvider,
            id: "emailpass",
          },
          {
            resolve:
              "@tsc_tech/medusa-plugin-auth-passkey/providers/auth-passkey",
            id: "auth-passkey",
            options: {
              rpID: process.env.RP_ID,
              rpName: process.env.RP_NAME,
              enableHTTPS: process.env.ENABLE_HTTPS === "true" ? true : false,
            },
          },
          {
            resolve: "@tsc_tech/medusa-plugin-auth-passkey/providers/auth",
            id: "otp",
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve:
              "@tsc_tech/medusa-plugin-razorpay-payment/providers/razorpay",
            id: "razorpay",
            options: {
              key_id:
                process?.env?.RAZORPAY_TEST_KEY_ID ?? process?.env?.RAZORPAY_ID,
              key_secret:
                process?.env?.RAZORPAY_TEST_KEY_SECRET ??
                process?.env?.RAZORPAY_SECRET,
              razorpay_account:
                process?.env?.RAZORPAY_TEST_ACCOUNT ??
                process?.env?.RAZORPAY_ACCOUNT,
              automatic_expiry_period: 30 /* any value between 12minuts and 30 days expressed in minutes*/,
              manual_expiry_period: 20,
              refund_speed: "normal",
              webhook_secret:
                process?.env?.RAZORPAY_TEST_WEBHOOK_SECRET ??
                process?.env?.RAZORPAY_WEBHOOK_SECRET,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          // # SMTP Notification
          {
            resolve: "@tsc_tech/medusa-plugin-smtp/providers/smtp",
            id: "notification-smtp",
            options: {
              channels: ["email"],
              fromEmail: process.env.SMTP_FROM,
              transport: {
                host: process.env.SMTP_HOST || "smtp.gmail.com",
                port: process.env.SMTP_PORT || 465,
                secure: process.env.SMTP_SECURE || false,
                auth: {
                  user: process.env.SMTP_AUTH_USER,
                  pass: process.env.SMTP_AUTH_PASS,
                },
              },
            },
          },
        ],
      },
    },

    // client credentials

    // {
    //   resolve: "@medusajs/medusa/notification",
    //   options: {
    //     providers: [
    //       {
    //         resolve: "@tsc_tech/medusa-plugin-mailgun/providers/mailgun",
    //         id: "notification-mailgun",
    //         options: {
    //           channels: ["email"],
    //           username: "api",
    //           key: process.env.MAILGUN_API_KEY,
    //           domain: process.env.MAILGUN_DOMAIN,
    //           from: process.env.MAILGUN_FROM,
    //         },
    //       },
    //     ],
    //   },
    // },
  ],
});
