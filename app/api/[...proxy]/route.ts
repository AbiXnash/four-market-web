import api from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

async function handleRequest(
  request: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> },
) {
  const { proxy } = await params;
  const url = `/api/${proxy.join("/")}${request.nextUrl.search}`;
  const method = request.method.toLowerCase();

  const hasBody = ["post", "put", "patch"].includes(method);
  let body: unknown;
  if (hasBody) {
    const text = await request.text();
    if (text) body = text;
  }

  const forwardedHeaders = Object.fromEntries(
    Array.from(request.headers).filter(([key]) => key.toLowerCase() !== "client-app"),
  );

  try {
    const response = await api.request({
      method,
      url,
      data: body,
      headers: {
        ...forwardedHeaders,
        "Client-App": "4M",
        host: undefined,
      },
      validateStatus: () => true,
      responseType: "text",
    });

    const appStatus = response.headers["x-application-status"];
    const headerForward: Record<string, string> = {};
    if (appStatus) {
      headerForward["x-application-status"] = appStatus;
    }

    if (appStatus === "offline") {
      return NextResponse.json(
        { error: "Server is offline", status: "offline" },
        { status: 503, headers: headerForward },
      );
    }

    let data: unknown;
    const contentType = `${response.headers["content-type"] ?? ""}`;
    if (contentType.includes("application/json")) {
      data = JSON.parse(response.data);
    } else {
      data = response.data;
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: headerForward,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Server unreachable",
        status: "offline",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503, headers: { "x-application-status": "offline" } },
    );
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
