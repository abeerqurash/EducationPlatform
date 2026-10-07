import {
  NextResponse,
} from "next/server";

import {
  registerUser,
} from "@/lib/auth/register";

export async function POST(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const result =
      await registerUser(body);

    if (!result.success) {
      const status =
        result.error ===
        "ACCOUNT_EXISTS"
          ? 409
          : 400;

      return NextResponse.json(
        result,
        {
          status,
        },
      );
    }

    return NextResponse.json(
      result,
      {
        status: 201,
      },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
      },
      {
        status: 500,
      },
    );
  }
}