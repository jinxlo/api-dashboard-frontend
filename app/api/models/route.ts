import { NextResponse } from "next/server";

import { modelCatalog } from "@/lib/models";

export async function GET() {
  return NextResponse.json({ models: modelCatalog });
}
