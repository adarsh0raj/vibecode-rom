import { BlobServiceClient } from "@azure/storage-blob";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Verify authentication
async function isAuthenticated(request: NextRequest) {
  const cooks = await cookies();
  const authCookie = cooks.get("auth-token");
  
  if (!authCookie?.value) {
    return false;
  }
  
  try {
    const token = authCookie.value;
    jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret");
    return true;
  } catch (error) {
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { imageName: string } }
) {
  // Check authentication
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
    const imageName = params.imageName;
    
    if (!connectionString || !containerName) {
      return NextResponse.json(
        { error: "Azure Storage configuration missing" },
        { status: 500 }
      );
    }

    // Connect to Azure Storage
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(imageName);
    
    // Check if blob exists
    const exists = await blobClient.exists();
    if (!exists) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }
    
    // Get blob properties
    const properties = await blobClient.getProperties();
    
    return NextResponse.json({
      name: imageName,
      url: blobClient.url,
      contentType: properties.contentType,
      createdOn: properties.createdOn,
      size: properties.contentLength
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image from Azure" },
      { status: 500 }
    );
  }
}