Deploying the `get-items` Lambda (reads DynamoDB table FalcorpGroceryItems)

This folder contains a small Node.js Lambda that scans the DynamoDB table `FalcorpGroceryItems` and returns a JSON object `{ results: [...] }`.

Recommended deploy options

1) AWS SAM (quick)
- Install AWS SAM CLI and Docker if you don't have it.
- Create a SAM template (example below) or reuse an existing one.

Example SAM snippet (paste into template.yaml at repo root or adapt):

Resources:
  GetItemsFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: index.handler
      Runtime: nodejs18.x
      CodeUri: aws-lambda/get-items/
      Environment:
        Variables:
          TABLE_NAME: FalcorpGroceryItems
      Policies:
        - Version: '2012-10-17'
          Statement:
            - Effect: Allow
              Action:
                - dynamodb:Scan
                - dynamodb:Query
                - dynamodb:GetItem
              Resource: arn:aws:dynamodb:us-east-1:YOUR_ACCOUNT_ID:table/FalcorpGroceryItems
      Events:
        GetItemsApi:
          Type: Api
          Properties:
            Path: /items
            Method: get

Then run:
  sam build
  sam deploy --guided

2) Serverless Framework
- Create serverless.yml that deploys the function with IAM permissions to read the table and an HTTP endpoint.

IAM permissions
- The Lambda needs permission to read the table (Scan/Query/GetItem). Example policy:

{
  "Effect": "Allow",
  "Action": ["dynamodb:Scan", "dynamodb:Query", "dynamodb:GetItem"],
  "Resource": "arn:aws:dynamodb:us-east-1:YOUR_ACCOUNT_ID:table/FalcorpGroceryItems"
}

Frontend wiring
- After deploying, you'll get an API Gateway URL, e.g. https://<id>.execute-api.us-east-1.amazonaws.com/prod/items
- Set the Vite env var in your frontend:
  - Create a `.env` file in the project root with:
    VITE_ITEMS_API_URL=https://<id>.execute-api.us-east-1.amazonaws.com/prod/items
- Restart dev server. `src/Prices.tsx` prefers this URL now and will load items from the table.

Notes
- For production, tighten CORS to your domain and limit IAM resource ARNs.
- Consider using Query with a GSI instead of Scan for large tables.
