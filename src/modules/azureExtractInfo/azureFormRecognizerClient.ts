import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";
import dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.AZURE_FORM_RECOGNIZER_ENDPOINT;
const apiKey = process.env.AZURE_FORM_RECOGNIZER_KEY;

if (!endpoint || !apiKey) {
  throw new Error("Form Recognizer API key or endpoint is missing.");
}

const formRecognizerClient = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

export default formRecognizerClient;
