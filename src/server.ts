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

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the CardX Server");
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
