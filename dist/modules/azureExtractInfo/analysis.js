"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeBusinessCard = analyzeBusinessCard;
const azureFormRecognizerClient_1 = __importDefault(require("./azureFormRecognizerClient"));
const fs_1 = __importDefault(require("fs"));
function analyzeBusinessCard(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const businessCardModel = "prebuilt-businessCard";
        const fileStream = fs_1.default.createReadStream(filePath);
        let extractedFields = {};
        try {
            const poller = yield azureFormRecognizerClient_1.default.beginAnalyzeDocument(businessCardModel, fileStream);
            console.log("published poller", poller);
            // Wait for the operation to complete
            const result = yield poller.pollUntilDone();
            console.log("puller result", result);
            // Check if the result and documents exist
            if (!result || !result.documents || result.documents.length === 0) {
                console.log("No business card information found.");
                return extractedFields; // Return empty object if no documents found
            }
            const document = result.documents[0]; // Get the first document
            // Log the fields to understand their structure
            console.log("Fields in document:", document.fields);
            // Iterate through the fields to extract key-value pairs
            if (document.fields) {
                for (const [fieldName, field] of Object.entries(document.fields)) {
                    // Check if the field is of kind 'array'
                    if (field.kind === 'array' && Array.isArray(field.values)) {
                        // Extract the content from each object in the values array
                        extractedFields[fieldName] = field.values.map(item => item.content).join(', ') || 'N/A'; // Join array values into a string
                    }
                    else {
                        console.log(`Field "${fieldName}" is not of kind 'array'.`);
                    }
                }
            }
            console.log('extractedFields', extractedFields);
            return extractedFields; // Return the extracted key-value pairs
        }
        catch (error) {
            console.error("Error analyzing business card:", error);
            throw error; // Optionally, rethrow the error if you want it to propagate
        }
    });
}
