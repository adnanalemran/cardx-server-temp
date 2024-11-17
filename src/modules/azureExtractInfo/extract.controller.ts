import catchAsync from "../../utils/catchAsync";
import { analyzeBusinessCard } from './analysis';

import fs from "fs";

// Controller function to handle the request
const extractData = catchAsync(async (req, res) => {
  console.log(req.file); // Log the uploaded file information

  if (!req.file) {
    res.status(400).send("Please upload a business card image.");
    return;
  }

  try {
    // Analyze the business card
    const result = await analyzeBusinessCard(req.file.path);
    console.log("Azure result", result); // Logs extracted fields

    // Send response with the analyzed data
    res.status(200).json({ businessCard: result });
  } catch (error) {
    console.error("Error analyzing business card:", error);
    res.status(500).send("Error processing the business card.");
  } finally {
    // Delete the uploaded file after processing, regardless of success or failure
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Failed to delete the file:", err);
      } else {
        console.log("File deleted successfully:");
      }
    });
  }
});

export const AzureExtractInfo = {
  extractData
};
