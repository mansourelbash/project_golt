import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { executeQuery } from "@/lib/supabase";
import { authOptions } from "../../../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

// Get a single property
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const properties = await executeQuery(
      `SELECT * FROM properties 
       WHERE id = $1 AND user_id = $2`,
      [params.id, session.user.id]
    );

    if (properties.length === 0) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(properties[0]);
  } catch (error) {
    console.error("Get property error:", error);
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}

// Update a property
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const properties = await executeQuery(
      `SELECT * FROM properties 
       WHERE id = $1 AND user_id = $2`,
      [params.id, session.user.id]
    );

    if (properties.length === 0) {
      return NextResponse.json(
        { error: "Property not found or unauthorized" },
        { status: 404 }
      );
    }

    const data = await request.json();
    const {
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
      features,
      images
    } = data;

    const result = await executeQuery(
      `UPDATE properties 
       SET title = $1, description = $2, price = $3,
           bedroom_count = $4, bathroom_count = $5,
           property_type = $6, status = $7, location = $8,
           address = $9, city = $10, state = $11,
           zip_code = $12, square_feet = $13,
           year_built = $14, features = $15,
           images = $16, updated_at = CURRENT_TIMESTAMP
       WHERE id = $17 AND user_id = $18
       RETURNING *`,
      [
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
        features,
        images,
        params.id,
        session.user.id
      ]
    );

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Update property error:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}
