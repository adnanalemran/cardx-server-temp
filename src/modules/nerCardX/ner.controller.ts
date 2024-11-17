import AWS from 'aws-sdk';
import config from "../../config";
import catchAsync from "../../utils/catchAsync";

AWS.config.update({
  accessKeyId: config.aws_access_key,
  secretAccessKey: config.aws_secret_key,
  region: config.aws_region
});

// Initialize AWS Comprehend client
const comprehend = new AWS.Comprehend();

const serviceRegex = /\b(E[-\s]*commerce|Mobile[-\s]*Apps|Cloud|Software|IoT|AI|Digital[-\s]*Marketing|Web[-\s]*Development|SEO|Cyber[-\s]*security|Block[-\s]*chain|Machine[-\s]*Learning|Data[-\s]*Science|Big[-\s]*Data|Dev[-\s]*Ops|Networking|IT[-\s]*Consulting|SaaS|PaaS|IaaS|AR[-\s]*VR|Automation|CRM|ERP|IT[-\s]*Support|Database[-\s]*Management|UI[-\s]*UX[-\s]*Design|Game[-\s]*Development|Cloud[-\s]*Migration|Cloud[-\s]*Security|Data[-\s]*Analytics|Robotics|Business[-\s]*Intelligence|System[-\s]*Integration|AI[-\s]*Chatbots|Virtualization|IT[-\s]*Auditing|Managed[-\s]*Services|Technical[-\s]*Support|Digital[-\s]*Transformation|Social[-\s]*Media[-\s]*Management|Content[-\s]*Creation|Video[-\s]*Production|Augmented[-\s]*Reality|Virtual[-\s]*Reality|Chatbot[-\s]*Development|Mobile[-\s]*Game[-\s]*Development|Voice[-\s]*Search[-\s]*Optimization|Data[-\s]*Visualization|Internet[-\s]*of[-\s]*Things|Financial[-\s]*Technology|Compliance[-\s]*Consulting|Quality[-\s]*Assurance|Risk[-\s]*Management|Change[-\s]*Management|Remote[-\s]*Monitoring|Product[-\s]*Management|Business[-\s]*Process[-\s]*Outsourcing|Cloud[-\s]*Native|Serverless[-\s]*Architecture|Microservices|APIs|Digital[-\s]*Product[-\s]*Design|User[-\s]*Research|IT[-\s]*Strategy|Teacher|Professor|Instructor|Trainer|Educator|Consultant|Manager|Director|Executive|Administrator|Analyst|Coordinator|Specialist|Lead|Developer|Designer|Marketer|Sales[-\s]*Representative|Project[-\s]*Manager|Researcher|Writer|Artist|Entrepreneur|Data[-\s]*Analyst|Quality[-\s]*Control|Human[-\s]*Resources|Accountant|Financial[-\s]*Analyst|Software[-\s]*Engineer|Network[-\s]*Engineer|Database[-\s]*Administrator|Systems[-\s]*Analyst|Technical[-\s]*Writer|Web[-\s]*Designer|Creative[-\s]*Director|Operations[-\s]*Manager|Product[-\s]*Owner|Chief[-\s]*Executive[-\s]*Officer|Chief[-\s]*Operating[-\s]*Officer|Chief[-\s]*Financial[-\s]*Officer|Chief[-\s]*Technology[-\s]*Officer|Chief[-\s]*Marketing[-\s]*Officer|Account[-\s]*Manager|Brand[-\s]*Manager|Legal[-\s]*Advisor|Compliance[-\s]*Officer|Sales[-\s]*Manager|Customer[-\s]*Service[-\s]*Representative|Support[-\s]*Technician|HR[-\s]*Manager|Data[-\s]*Scientist|Social[-\s]*Media[-\s]*Strategist|Event[-\s]*Planner|Public[-\s]*Relations[-\s]*Specialist|UX[-\s]*Researcher|Graphic[-\s]*Designer|Financial[-\s]*Consultant|Health[-\s]*Care[-\s]*Professional|Real[-\s]*Estate[-\s]*Agent|Construction[-\s]*Manager|Safety[-\s]*Officer|Logistics[-\s]*Coordinator|Supply[-\s]*Chain[-\s]*Manager|Manufacturing[-\s]*Engineer|Environmental[-\s]*Consultant|Pharmaceutical[-\s]*Sales|Veterinarian|Medical[-\s]*Technologist|Architect|Civil[-\s]*Engineer|Mechanical[-\s]*Engineer|Electrical[-\s]*Engineer|Quality[-\s]*Assurance[-\s]*Engineer|Field[-\s]*Service[-\s]*Technician|Network[-\s]*Administrator|DevOps[-\s]*Engineer|IT[-\s]*Manager|Solutions[-\s]*Architect)\b/gi;


// Improved regex to handle spaces at various points in an email
const emailRegex = /\b[A-Z0-9._%+-]+\s*@\s*[A-Z0-9.-]+\s*\.\s*[A-Z]{2,}\b/gi;
// Updated regex pattern to match different phone number formats
const phoneNumberPattern = /(?:\+?\d{1,3}[\s.-]?\(?\d{1,4}\)?[\s.-]?)?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,4}(?:[\s.-]?\d{1,4})?/g;

const urlRegex = /\b(?:https?:\/\/|www\.)[^\s]+/g;

// Regex to capture name and designation
const nameDesignationRegex = /([A-Z][a-zA-Z\s]*(?:\s+[A-Z][a-zA-Z]*)*)\s*,?\s*(Managing[-\s]*Director[-\s]*&[-\s]*CEO|Director|CEO|Manager|President|Chairman|Founder|CTO|COO|CFO|Engineer|Sales[-\s]*and[-\s]*Marketing[-\s]*Executive|Sales[-\s]*Executive|Marketing[-\s]*Executive|Business[-\s]*Development[-\s]*Manager|Account[-\s]*Manager|Project[-\s]*Manager|Technical[-\s]*Lead|Product[-\s]*Manager|Operations[-\s]*Manager|Chief[-\s]*Executive[-\s]*Officer|Chief[-\s]*Operating[-\s]*Officer|Chief[-\s]*Financial[-\s]*Officer|Chief[-\s]*Technology[-\s]*Officer|Chief[-\s]*Marketing[-\s]*Officer|Brand[-\s]*Manager|Sales[-\s]*Manager|Customer[-\s]*Service[-\s]*Representative|Human[-\s]*Resources[-\s]*Manager|Data[-\s]*Scientist|Software[-\s]*Engineer|Data[-\s]*Analyst|IT[-\s]*Manager|Web[-\s]*Developer|Mobile[-\s]*Developer|Game[-\s]*Developer|Creative[-\s]*Director|Graphic[-\s]*Designer|Digital[-\s]*Marketing[-\s]*Specialist|Business[-\s]*Analyst|Operations[-\s]*Coordinator|Compliance[-\s]*Officer|Financial[-\s]*Analyst|Network[-\s]*Engineer|Systems[-\s]*Analyst|Technical[-\s]*Support|Research[-\s]*Analyst|Logistics[-\s]*Manager|Public[-\s]*Relations[-\s]*Specialist|UX[-\s]*Designer|Event[-\s]*Coordinator|Sales[-\s]*Representative|Account[-\s]*Executive|Content[-\s]*Strategist|SEO[-\s]*Specialist|Video[-\s]*Producer|Web[-\s]*Designer|Virtual[-\s]*Assistant|Business[-\s]*Consultant|Trainer|Educator|Instructor|Consultant|Entrepreneur|Technical[-\s]*Writer|Health[-\s]*Care[-\s]*Professional|Legal[-\s]*Advisor|Pharmaceutical[-\s]*Sales|Construction[-\s]*Manager|Safety[-\s]*Officer|Environmental[-\s]*Consultant|Logistics[-\s]*Coordinator|Supply[-\s]*Chain[-\s]*Manager|Mechanical[-\s]*Engineer|Civil[-\s]*Engineer|Electrical[-\s]*Engineer|Quality[-\s]*Assurance[-\s]*Engineer|Field[-\s]*Service[-\s]*Technician|IT[-\s]*Consultant|Digital[-\s]*Transformation[-\s]*Lead)/gi;



// Function to clean up emails by removing unnecessary spaces
function cleanUpEmail(email: string) {
  return email.replace(/\s+/g, ''); // Remove all spaces within the email
}

// Function to extract emails, phone numbers, URLs, and name-designations using regex
function extractCustomEntities(text: string) {
    // Match emails, phone numbers, and URLs
    const rawEmails = text.match(emailRegex);
    const phoneNumbers = text.match(phoneNumberPattern);
    const urls = text.match(urlRegex);
  
    // Clean up the emails by removing any unwanted spaces
    const emails = rawEmails ? rawEmails.map(cleanUpEmail) : [];
  
    // Match name and designation pairs
    const nameDesignationMatches = [...text.matchAll(nameDesignationRegex)];
  
    // Extract name-designation pairs
    const nameDesignations = nameDesignationMatches.map((match) => ({
      name: match[1].trim(),
      designation: match[2].trim(),
    }));
  
    // Extract services based on predefined keywords
    const services = text.match(serviceRegex) || [];
  
    // Filter out phone numbers that don't have at least 10 digits
    const validPhoneNumbers = phoneNumbers
      ? phoneNumbers.filter((phone) => phone.replace(/\D/g, '').length >= 10)
      : [];
  
    return {
      emails: emails || [],
      phoneNumbers: validPhoneNumbers || [], // Only valid phone numbers
      urls: urls || [],
      nameDesignations: nameDesignations || [],
      services: services || [], // Extracted services
    };
  }  

// Use AWS Comprehend to detect entities
async function detectEntities(text: string): Promise<any> {
  const params = {
    Text: text,
    LanguageCode: 'en'
  };

  try {
    const result = await comprehend.detectEntities(params).promise();
    return result.Entities || [];
  } catch (error) {
    console.error('Error detecting entities:', error);
    throw error;
  }
}

// Process the text using both AWS Comprehend and regex-based extraction
async function processText(text: string) {
  const awsEntities = await detectEntities(text); // AWS Comprehend entities
  const customEntities = extractCustomEntities(text); // Custom entities from regex

  return {
    awsEntities,
    customEntities,
  };
}

// Controller function to handle the request
const extractData = catchAsync(async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send({ message: 'Text is required for NER' });
  }

  try {
    const result = await processText(text);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to detect entities' });
  }
});

export const NerController = {
  extractData
};
