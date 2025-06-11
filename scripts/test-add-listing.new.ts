import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

dotenv.config();

interface SignInResponse {
  url: string;
  error?: string;
}

async function login() {
  try {
    // Step 1: Sign in through the credentials provider
    const signInResponse = await fetch("http://localhost:3000/api/auth/signin/credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD,
        redirect: false,
      }),
      redirect: 'manual',
    });

    console.log("Sign-in response status:", signInResponse.status);
    console.log("Sign-in response headers:", signInResponse.headers);

    // Get cookies from the response
    const cookies = signInResponse.headers.get('set-cookie');
    console.log("Cookies received:", cookies);

    if (!signInResponse.ok || !cookies) {
      const error = await signInResponse.text();
      console.error("Sign-in error:", error);
      throw new Error('Failed to login');
    }

    // Step 2: Get session to verify authentication
    const sessionResponse = await fetch("http://localhost:3000/api/auth/session", {
      headers: {
        Cookie: cookies,
      },
    });

    const session = await sessionResponse.json();
    console.log("Session:", session);

    if (!session?.user) {
      throw new Error('No session found');
    }

    return cookies;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

async function testAddListing() {
  try {
    // First, login to get the authentication token
    const authCookies = await login();
    
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

    console.log("Sending request with cookies:", authCookies);
    
    const response = await fetch("http://localhost:3000/api/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: authCookies,
      },
      body: JSON.stringify(sampleData),
    });
    
    console.log("Add listing response status:", response.status);
    const responseText = await response.text();
    console.log("Add listing response body:", responseText);

    if (!response.ok) {
      throw new Error(`Failed to add listing: ${responseText}`);
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
