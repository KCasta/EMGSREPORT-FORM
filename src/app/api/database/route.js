import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collections = await db.listCollections().toArray();
    return new Response(
      JSON.stringify({ message: "✅ MongoDB Connected!", collections }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "❌ MongoDB Connection Failed", error }),
      { status: 500 }
    );
  }
}
