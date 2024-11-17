import { DocumentAnalysisClient } from "@azure/ai-form-recognizer";
import formRecognizerClient from "./azureFormRecognizerClient"; 
import fs from "fs";

async function analyzeBusinessCard(filePath: string) {
    const businessCardModel = "prebuilt-businessCard"; 
    const fileStream = fs.createReadStream(filePath);
    let extractedFields: { [key: string]: string } = {}; 

    try {
        const poller = await formRecognizerClient.beginAnalyzeDocument(businessCardModel, fileStream);

        console.log("published poller", poller);
        
        // Wait for the operation to complete
        const result = await poller.pollUntilDone();
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
                } else {
                    console.log(`Field "${fieldName}" is not of kind 'array'.`);
                }
            }
        }

        console.log('extractedFields', extractedFields);
        return extractedFields; // Return the extracted key-value pairs
    } catch (error) {
        console.error("Error analyzing business card:", error);
        throw error; // Optionally, rethrow the error if you want it to propagate
    }
}

export { analyzeBusinessCard };
