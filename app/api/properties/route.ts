import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { executeQuery } from "@/lib/supabase";
import { authOptions } from "../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

type PropertyResponse = {
  id: string;
  title: string;
  description: string;
  price: number;
  bedroom_count: number;
  bathroom_count: number;
  property_type: string;
  status: string;
  location: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  square_feet: number | null;
  year_built: number | null;
  lot_size: string | null;
  garage_spaces: number;
  features: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
};

// Get all properties for the current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const properties = (await executeQuery(
      `SELECT * FROM properties 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [session.user.id]
    )) as PropertyResponse[];

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Get properties error:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

// Create a new property
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const {
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      propertyType,
      status,
      address,
      city,
      state: propertyState,
      zipCode,
      area,
      yearBuilt,
      lotSize,
      garage,
      amenities,
      coordinates,
    } = data;

    // Convert coordinates to a PostGIS point if provided
    const location = coordinates ? `POINT(${coordinates[0]} ${coordinates[1]})` : null;

    const result = (await executeQuery(
      `INSERT INTO properties (
        title,
        description,
        price,
        bedroom_count,
        bathroom_count,
        property_type,
        status,
        location,
        address,
        city,
        state,
        zip_code,
        square_feet,
        year_built,
        lot_size,
        garage_spaces,
        features,
        user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, ST_GeomFromText($8, 4326), $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
      RETURNING *`,
      [
        title,
        description,
        price,
        Number(bedrooms) || 0,
        Number(bathrooms) || 0,
        propertyType,
        status,
        location,
        address,
        city,
        propertyState,
        zipCode,
        Number(area) || null,
        Number(yearBuilt) || null,
        lotSize || null,
        Number(garage) || 0,
        amenities || [],
        session.user.id,
      ]
    )) as PropertyResponse[];

    if (!result?.[0]) {
      throw new Error("Failed to create property");
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Create property error:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
