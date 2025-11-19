// Lambda: orders (CRUD for orders stored in DynamoDB)
// Supports:
// - GET /orders?userId=... -> list orders for user
// - POST /orders -> create new order (body contains order)
// - GET /orders/{id} -> get specific order
// - POST /orders/{id}/cancel -> mark order canceled

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.AWS_REGION || "us-east-1";
const TABLE = process.env.ORDERS_TABLE || "FalcorpOrders";

const ddb = new DynamoDBClient({ region: REGION });
const doc = DynamoDBDocumentClient.from(ddb);

export async function handler(event) {
  try {
    const method = event.httpMethod || event.requestContext?.http?.method;
    const path = event.path || event.requestContext?.http?.path || "";

    if (method === "GET" && event.queryStringParameters?.userId) {
      const userId = event.queryStringParameters.userId;
      // scan and filter by userId (simpler for demo)
      const res = await doc.send(new ScanCommand({ TableName: TABLE }));
      const items = (res.Items || []).filter((i) => (i.userId || "") === userId);
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ results: items }),
      };
    }

    if (method === "POST" && path.endsWith("/orders")) {
      const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
      const order = {
        ...body,
        status: body.status || "placed",
        createdAt: new Date().toISOString(),
      };
      // ensure id
      if (!order.id) order.id = `order_${Date.now()}`;

      await doc.send(new PutCommand({ TableName: TABLE, Item: order }));
      return {
        statusCode: 201,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ order }),
      };
    }

    // GET /orders/{id}
    if (method === "GET" && path.match(/\/orders\/.+/)) {
      const id = path.split('/').pop();
      const res = await doc.send(new GetCommand({ TableName: TABLE, Key: { id } }));
      if (!res.Item) return { statusCode: 404, body: JSON.stringify({ message: 'Not found' }), headers: { "Access-Control-Allow-Origin": "*" } };
      return { statusCode: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(res.Item) };
    }

    // POST /orders/{id}/cancel
    if (method === "POST" && path.match(/\/orders\/.+\/cancel$/)) {
      const parts = path.split('/');
      const id = parts[parts.length - 2];
      await doc.send(new UpdateCommand({ TableName: TABLE, Key: { id }, UpdateExpression: 'SET #s = :s', ExpressionAttributeNames: { '#s': 'status' }, ExpressionAttributeValues: { ':s': 'canceled' } }));
      return { statusCode: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ message: 'canceled' }) };
    }

    return { statusCode: 400, body: JSON.stringify({ message: 'Unsupported route' }), headers: { "Access-Control-Allow-Origin": "*" } };
  } catch (err) {
    console.error('orders error', err);
    return { statusCode: 500, body: JSON.stringify({ message: String(err) }), headers: { "Access-Control-Allow-Origin": "*" } };
  }
}
