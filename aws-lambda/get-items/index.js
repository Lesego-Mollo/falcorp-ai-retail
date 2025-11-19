// Lambda: get-items (reads FalcorpGroceryItems DynamoDB table)
// Node 18+ style handler using AWS SDK v3 and DynamoDBDocumentClient

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.AWS_REGION || "us-east-1";
const TABLE = process.env.TABLE_NAME || "FalcorpGroceryItems";

const ddb = new DynamoDBClient({ region: REGION });
const doc = DynamoDBDocumentClient.from(ddb);

export async function handler(event) {
  try {
    // read all items (for production consider using Query + indexes or pagination)
    const resp = await doc.send(new ScanCommand({ TableName: TABLE, Limit: 500 }));
    const items = (resp.Items || []).map((i) => ({
      id: i.id || i.pk || i.PK || String(Math.random()).slice(2),
      category: i.category || i.Category || "Uncategorized",
      name: i.name || i.Name || "Unnamed Item",
      price: i.price || i.Price || "R0.00",
      stock: Number(i.stock ?? i.Stock ?? 0),
      emoji: i.emoji || i.Emoji || "🛒",
    }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        // Allow CORS (change origin list for production)
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ results: items }),
    };
  } catch (err) {
    console.error("get-items error:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Failed to read items", error: String(err) }),
    };
  }
}
