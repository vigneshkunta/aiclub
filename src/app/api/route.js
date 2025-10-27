import dbConnect from "@/utils/config/db";

export async function GET(request) {
  await dbConnect();
  console.log("Handling GET request");
  return new Response("Hello, World!");
}