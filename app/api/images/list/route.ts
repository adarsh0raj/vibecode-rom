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

export async function GET(request: NextRequest) {
  // Check authentication
  if (!await isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
    
    if (!connectionString || !containerName) {
      return NextResponse.json(
        { error: "Azure Storage configuration missing" },
        { status: 500 }
      );
    }

    // Get pagination parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "5");
    const skip = (page - 1) * pageSize;

    // Connect to Azure Storage
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    // List all blobs in the container
    const imageList = [];
    const allImages = [];
    const listBlobsResponse = containerClient.listBlobsFlat();
    
    for await (const blob of listBlobsResponse) {
      const blobClient = containerClient.getBlobClient(blob.name);
      const properties = await blobClient.getProperties();
      
      allImages.push({
        name: blob.name,
        url: blobClient.url,
        contentType: properties.contentType,
        createdOn: properties.createdOn,
        size: properties.contentLength
      });
    }
    
    // Sort by creation date (newest first) and apply pagination
    const sortedImages = allImages.sort((a, b) => 
      new Date(b.createdOn ?? 0).getTime() - new Date(a.createdOn ?? 0).getTime()
    );
    
    const paginatedImages = sortedImages.slice(skip, skip + pageSize);
    
    return NextResponse.json({
      images: paginatedImages,
      totalCount: allImages.length,
      page,
      pageSize,
      totalPages: Math.ceil(allImages.length / pageSize)
    });
  } catch (error) {
    console.error("Error listing images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images from Azure" },
      { status: 500 }
    );
  }
}