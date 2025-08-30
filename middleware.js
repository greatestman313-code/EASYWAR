import { NextResponse } from "next/server";
export function middleware(req){ 
  // Pass-through middleware to avoid runtime issues
  return NextResponse.next(); 
}
export const config = { matcher: ["/((?!_next|.*\..*).*)"] };
