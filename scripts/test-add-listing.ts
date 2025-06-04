import fetch from 'node-fetch';
import fetchCookie from 'fetch-cookie';
import * as dotenv from 'dotenv';

dotenv.config();

// Wrap fetch with cookie support
const fetchWithCookies = fetchCookie(fetch);

interface CSRFResponse {
  csrfToken: string;
}

interface SessionResponse {
  user?: {
    name?: string;
    email?: string;
  };
}

async function login() {
  
  // Step 1: Get CSRF token
  const csrfResponse = await fetchWithCookies("http://localhost:3000/api/auth/csrf");
  const { csrfToken } = await csrfResponse.json() as CSRFResponse;

  console.log("🚀 ~ login ~ csrfToken:", csrfToken)
  // Step 2: Sign in with credentials
  const signInResponse = await fetchWithCookies("http://localhost:3000/api/auth/callback/credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      csrfToken,
      email: process.env.TEST_USER_EMAIL || '',
      password: process.env.TEST_USER_PASSWORD || '',
      json: 'true',
    }),
  });

  console.log("Sign-in response status:", signInResponse.status);

  if (!signInResponse.ok) {
    const error = await signInResponse.text();
    console.error("Sign-in error:", error);
    throw new Error('Failed to login');
  }

  // Step 3: Check session (cookies now persist)
  const sessionResponse = await fetchWithCookies("http://localhost:3000/api/auth/session");
  const session = await sessionResponse.json() as SessionResponse;

  if (!session?.user) {
    throw new Error('No session found');
  }

  return fetchWithCookies;
}

async function testAddListing() {
  try {
    // Login and get authenticated fetch instance
    const authenticatedFetch = await login();

    const sampleData = {
      title: "Sample Property",
      description: "A beautiful property for testing purposes.",
      price: 500000,
      bedrooms: 3,
      bathrooms: 2,
      propertyType: "house",
      status: "for-sale",
      address: "123 Test Street",
      city: "Test City",
      state: "Test State",
      zipCode: "12345",
      area: 2000,
      yearBuilt: 2020,
      lotSize: "0.25 acres",
      garage: 2,
      amenities: ["pool", "garden"],
      coordinates: [-74.006, 40.7128],
    };

    const response = await authenticatedFetch("http://localhost:3000/api/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(sampleData),
    });

    console.log("Add listing response status:", response.status);
    const responseText = await response.text();
    console.log("Add listing response body:", responseText);

    if (!response.ok) {
      throw new Error(`Failed to add listing: ${response.statusText} - ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log("Listing added successfully:", result);
  } catch (error) {
    console.error("Error adding listing:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
  }
}

testAddListing();
