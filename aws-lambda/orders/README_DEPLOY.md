Orders Lambda

This Lambda provides simple CRUD for orders stored in DynamoDB. It supports:
- GET /orders?userId=<id> to list a user's orders
- POST /orders to create an order
- GET /orders/{id} to fetch an order
- POST /orders/{id}/cancel to cancel an order

Deploy with SAM or Serverless. Create a DynamoDB table (e.g., FalcorpOrders) with primary key `id` (string). The function needs IAM permissions to read/write the table.

Sample SAM resource (add to your template):

  OrdersFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: index.handler
      Runtime: nodejs18.x
      CodeUri: aws-lambda/orders/
      Environment:
        Variables:
          ORDERS_TABLE: FalcorpOrders
      Policies:
        - Version: '2012-10-17'
          Statement:
            - Effect: Allow
              Action:
                - dynamodb:PutItem
                - dynamodb:Scan
                - dynamodb:GetItem
                - dynamodb:UpdateItem
              Resource: arn:aws:dynamodb:us-east-1:YOUR_ACCOUNT_ID:table/FalcorpOrders
      Events:
        OrdersApi:
          Type: Api
          Properties:
            Path: /orders
            Method: any

After deployment, set:
VITE_ORDERS_API_URL=https://<id>.execute-api.us-east-1.amazonaws.com/prod/orders

