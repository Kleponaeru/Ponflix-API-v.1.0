import { NextResponse } from "next/server";
import type {
  ApiResponse,
  ApiErrorResponse,
} from "@/types/response";

export function ok<T, M extends object = {}>(
  data: T,
  meta?: M,
  status = 200
) {
  const body: ApiResponse<T> & M = {
    success: true,
    data,
    ...(meta ?? ({} as M)),
  };

  return NextResponse.json(body, { status });
}

export function fail(
  error: string,
  status = 500
) {
  const body: ApiErrorResponse = {
    success: false,
    error,
  };

  return NextResponse.json(body, { status });
}