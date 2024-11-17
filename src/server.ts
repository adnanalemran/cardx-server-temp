import cors from "cors";
import express, { Request, Response } from "express";
import { StripeRoute } from "./modules/stripe/stripe.route";
import { NerRoute } from "./modules/nerCardX/ner.route";
import { AzureExtractRoute } from "./modules/azureExtractInfo/extract.route";
import { UserRoute } from "./modules/users/user.route";
import path from "path";
import { BusnessCardRoute } from "./modules/busnessCard/card.route";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = 3014;
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api", UserRoute);

app.use("/api", NerRoute);
app.use("/api", StripeRoute);
app.use("/api", AzureExtractRoute);

app.use("/api", BusnessCardRoute);

app.get("/", async (req: Request, res: Response) => {
  try {
    await prisma.$connect();

    res.send(`
      <html>
      <head>
      <style>
        body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        }
        .container {
        text-align: center;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
        color: #333;
        }
        p {
        color: #666;
        }
      </style>
      </head>
      <body>
      <div class="container">
        <h1>Welcome to the CardX Server!</h1>
        <p>The database connection was successful.</p>
      </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`
      <html>
      <head>
      <style>
      body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      }
      .container {
      text-align: center;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
      color: #333;
      }
      p {
      color: #666;
      }
      </style>
      </head>
      <body>
      <div class="container">
      <h1>Welcome to the CardX Server!</h1>
      <p style="color: red;">There was an error connecting to the database: ${error}</p>
      </div>
      </body>
      </html>
    `);
  }
});

app.listen(port, async () => {
  try {
    await prisma.$connect();
    console.log(`*------------------>Database connected successfully!`);

    console.log(`Server running on http://localhost:${port}`);
  } catch (error) {
    console.error(
      "*------------------>Error connecting to the database: \n",
      error
    );
  } finally {
    await prisma.$disconnect();
  }
});
