import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id || !/^[\w-]{6,20}$/.test(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${id}`,
  )}&format=json`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 * 60 * 12 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "upstream" }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 502 });
  }
}
