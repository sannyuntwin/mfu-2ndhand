#!/bin/bash

BASE_URL="http://localhost:5000/api/v1"

echo "🧪 Testing E-commerce API Endpoints"
echo "======================================"

echo -e "\n📋 1. Testing Public Endpoints"

# Test products (public)
echo "GET /products"
curl -s -X GET "$BASE_URL/products" | jq '.' || echo "No jq available, raw response:"
curl -s -X GET "$BASE_URL/products"

echo -e "\n\n📋 2. Testing Authentication (should require auth)"

# Test buyer endpoints without auth
echo "GET /buyer/me (should return 401)"
curl -s -X GET "$BASE_URL/buyer/me" | jq '.' || echo "Response:"
curl -s -X GET "$BASE_URL/buyer/me"

echo -e "\n\n📋 3. Testing Cart Endpoints (should require auth)"

# Test cart endpoints without auth  
echo "GET /cart (should return 401)"
curl -s -X GET "$BASE_URL/cart" | jq '.' || echo "Response:"
curl -s -X GET "$BASE_URL/cart"

echo -e "\n\n📋 4. Testing Payment Endpoints (should require auth)"

# Test payment endpoints without auth
echo "POST /payments/create-intent (should return 401)"
curl -s -X POST "$BASE_URL/payments/create-intent" -H "Content-Type: application/json" -d '{"orderId": 1}' | jq '.' || echo "Response:"
curl -s -X POST "$BASE_URL/payments/create-intent" -H "Content-Type: application/json" -d '{"orderId": 1}'

echo -e "\n\n✅ API Testing Complete!"