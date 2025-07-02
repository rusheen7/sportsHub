import { NextRequest, NextResponse } from 'next/server';
import { updateAllData, getCurrentData, getDataWithPriority } from '../../../../lib/scraper';

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'preview') {
      // Get data with priority: Manual data > Web scraping > Fallback
      console.log("Getting data with priority...");
      const data = await getDataWithPriority();
      return NextResponse.json({
        success: true,
        data: data,
        message: "Data retrieved with priority (manual > web scraping > fallback)"
      });
    } else if (action === 'save') {
      // Scrape and save the data
      console.log("Updating and saving data...");
      const updatedData = await updateAllData();
      return NextResponse.json({
        success: true,
        data: updatedData,
        message: "Data updated and saved successfully"
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Invalid action. Use 'preview' or 'save'"
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in update endpoint:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to update data",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Return current data
    const currentData = getCurrentData();
    return NextResponse.json({
      success: true,
      data: currentData
    });
  } catch (error) {
    console.error("Error getting current data:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to get current data",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 