"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ai_form_recognizer_1 = require("@azure/ai-form-recognizer");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const endpoint = process.env.AZURE_FORM_RECOGNIZER_ENDPOINT;
const apiKey = process.env.AZURE_FORM_RECOGNIZER_KEY;
if (!endpoint || !apiKey) {
    throw new Error("Form Recognizer API key or endpoint is missing.");
}
const formRecognizerClient = new ai_form_recognizer_1.DocumentAnalysisClient(endpoint, new ai_form_recognizer_1.AzureKeyCredential(apiKey));
exports.default = formRecognizerClient;
