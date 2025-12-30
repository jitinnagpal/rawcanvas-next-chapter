import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FormData {
  name: string;
  phone: string;
  email: string;
  propertyLocation: string;
  projectType: string;
  propertyType: string;
  propertySize: string;
  propertyStatus: string;
  nextStep: string;
  consultationDate?: string;
  visitorLocation: string;
  deviceType: string;
  browser: string;
  intent?: string; // 'quick_estimate' | 'designer_consultation'
  scopeOfWork?: string;
  finishLevel?: string;
  storageRequirement?: string;
  upgrades?: string;
  estimateLow?: number | null;
  estimateHigh?: number | null;
  bhkSize?: string;
  sizeMultiplier?: number | null;
}

// Function to create JWT token for Google Sheets API authentication
async function createJWT(serviceAccount: any): Promise<string> {
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const expiry = now + 3600; // 1 hour from now

  const payload = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: expiry,
    iat: now,
  };

  // Encode header and payload
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  // Import the private key
  const privateKey = serviceAccount.private_key;
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  
  // Remove header, footer, and all whitespace/newlines
  const pemContents = privateKey
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/\s/g, "");

  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  // Sign the token
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    encoder.encode(unsignedToken)
  );

  // Encode signature
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${unsignedToken}.${encodedSignature}`;
}

// Function to get access token from Google
async function getAccessToken(serviceAccount: any): Promise<string> {
  const jwt = await createJWT(serviceAccount);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error("Failed to get access token:", data);
    throw new Error(`Failed to authenticate with Google: ${data.error_description || data.error}`);
  }

  return data.access_token;
}

// Function to convert UTC to IST timestamp
function getISTTimestamp(): string {
  const now = new Date();
  // IST is UTC + 5:30
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  
  // Format as "DD/MM/YYYY HH:mm:ss"
  const day = String(istDate.getUTCDate()).padStart(2, '0');
  const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
  const year = istDate.getUTCFullYear();
  const hours = String(istDate.getUTCHours()).padStart(2, '0');
  const minutes = String(istDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(istDate.getUTCSeconds()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} IST`;
}

// Function to append row to Google Sheets
async function appendToSheet(accessToken: string, sheetId: string, values: string[][]): Promise<void> {
  const range = "Sheet1!A:X"; // Extended to include all estimate fields
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: values,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Failed to append to sheet:", data);
    throw new Error(`Failed to write to Google Sheets: ${data.error?.message || 'Unknown error'}`);
  }

  console.log("Successfully appended row to sheet:", data);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request to submit contact form");

    // Parse request body
    const formData: FormData = await req.json();
    console.log("Form data received:", { 
      name: formData.name, 
      nextStep: formData.nextStep,
      propertyLocation: formData.propertyLocation 
    });

    // Validate required fields
    if (!formData.name || !formData.phone || !formData.propertyLocation || !formData.projectType) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Google Sheets credentials from environment
    const credentialsJson = Deno.env.get('GOOGLE_SHEETS_CREDENTIALS');
    if (!credentialsJson) {
      console.error("GOOGLE_SHEETS_CREDENTIALS not found in environment");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const serviceAccount = JSON.parse(credentialsJson);
    console.log("Service account loaded:", serviceAccount.client_email);

    // Get access token
    console.log("Getting access token...");
    const accessToken = await getAccessToken(serviceAccount);
    console.log("Access token obtained successfully");

    // Prepare row data with IST timestamp
    const timestamp = getISTTimestamp();
    const rowData = [
      formData.name,
      formData.phone,
      formData.email || '',
      formData.propertyLocation,
      formData.projectType,
      formData.propertyType || '',
      formData.propertySize || '',
      formData.propertyStatus || '',
      formData.nextStep === 'consultation' ? 'Schedule a free consultation' : (formData.nextStep === 'direct-call' ? "I'll call you directly" : ''),
      formData.consultationDate || '',
      formData.visitorLocation,
      formData.deviceType,
      formData.browser,
      timestamp,
      formData.intent || 'quick_estimate', // Intent column (was "Estimate Generated")
      formData.scopeOfWork || '',
      formData.finishLevel || '',
      formData.storageRequirement || '',
      formData.upgrades || '',
      formData.bhkSize || '',
      '', // Legacy entryMode column - now using intent instead
      formData.estimateLow != null ? String(formData.estimateLow) : '',
      formData.estimateHigh != null ? String(formData.estimateHigh) : '',
      formData.sizeMultiplier != null ? String(formData.sizeMultiplier) : '',
    ];

    console.log("Appending row to sheet...");
    const sheetId = "1IcnD7WMQBcweA0TRTFYMtGOFBgRFwRAXzYzE5lhoyNQ";
    await appendToSheet(accessToken, sheetId, [rowData]);

    console.log("Contact form submitted successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Form submitted successfully" 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in submit-contact-form function:', error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to submit form",
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
