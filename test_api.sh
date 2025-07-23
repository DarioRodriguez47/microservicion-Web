#!/bin/bash

# Script de pruebas automatizadas para el microservicio de canciones
# Uso: ./test_api.sh [base_url]

BASE_URL=${1:-"http://localhost:3000"}
echo "🧪 Ejecutando pruebas para: $BASE_URL"
echo "=================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir resultados
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Test 1: Health Check
echo -e "${YELLOW}1. Health Check${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
if [ "$response" = "200" ]; then
    print_result 0 "Health check passed"
else
    print_result 1 "Health check failed (HTTP $response)"
fi

# Test 2: API Info
echo -e "${YELLOW}2. API Info${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
if [ "$response" = "200" ]; then
    print_result 0 "API info endpoint working"
else
    print_result 1 "API info endpoint failed (HTTP $response)"
fi

# Test 3: Get all songs (should be empty initially)
echo -e "${YELLOW}3. GET all songs (empty)${NC}"
response=$(curl -s "$BASE_URL/api/songs")
count=$(echo "$response" | grep -o '"count":[0-9]*' | cut -d':' -f2)
if [ "$count" = "0" ] || [ ! -z "$count" ]; then
    print_result 0 "GET all songs working"
else
    print_result 1 "GET all songs failed"
fi

# Test 4: Create first song
echo -e "${YELLOW}4. POST create song 1${NC}"
response=$(curl -s -X POST "$BASE_URL/api/songs" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test Song 1","path":"/test/song1.mp3","plays":0}')
song1_id=$(echo "$response" | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
if [ ! -z "$song1_id" ]; then
    print_result 0 "Song 1 created with ID: $song1_id"
else
    print_result 1 "Failed to create song 1"
fi

# Test 5: Create second song
echo -e "${YELLOW}5. POST create song 2${NC}"
response=$(curl -s -X POST "$BASE_URL/api/songs" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test Song 2","path":"/test/song2.mp3","plays":100}')
song2_id=$(echo "$response" | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
if [ ! -z "$song2_id" ]; then
    print_result 0 "Song 2 created with ID: $song2_id"
else
    print_result 1 "Failed to create song 2"
fi

# Test 6: Get all songs (should have 2 now)
echo -e "${YELLOW}6. GET all songs (should have 2)${NC}"
response=$(curl -s "$BASE_URL/api/songs")
count=$(echo "$response" | grep -o '"count":[0-9]*' | cut -d':' -f2)
if [ "$count" = "2" ]; then
    print_result 0 "GET all songs shows correct count: $count"
else
    print_result 1 "GET all songs shows incorrect count: $count (expected 2)"
fi

# Test 7: Get song by ID
echo -e "${YELLOW}7. GET song by ID${NC}"
if [ ! -z "$song1_id" ]; then
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/songs/$song1_id")
    if [ "$response" = "200" ]; then
        print_result 0 "GET song by ID working"
    else
        print_result 1 "GET song by ID failed (HTTP $response)"
    fi
else
    print_result 1 "Cannot test GET by ID - no song ID available"
fi

# Test 8: Update song with PUT
echo -e "${YELLOW}8. PUT update song${NC}"
if [ ! -z "$song1_id" ]; then
    response=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$BASE_URL/api/songs/$song1_id" \
        -H "Content-Type: application/json" \
        -d '{"name":"Updated Song 1","path":"/test/updated-song1.mp3","plays":50}')
    if [ "$response" = "200" ]; then
        print_result 0 "PUT update working"
    else
        print_result 1 "PUT update failed (HTTP $response)"
    fi
else
    print_result 1 "Cannot test PUT - no song ID available"
fi

# Test 9: Update song with PATCH
echo -e "${YELLOW}9. PATCH update song${NC}"
if [ ! -z "$song2_id" ]; then
    response=$(curl -s -o /dev/null -w "%{http_code}" -X PATCH "$BASE_URL/api/songs/$song2_id" \
        -H "Content-Type: application/json" \
        -d '{"plays":200}')
    if [ "$response" = "200" ]; then
        print_result 0 "PATCH update working"
    else
        print_result 1 "PATCH update failed (HTTP $response)"
    fi
else
    print_result 1 "Cannot test PATCH - no song ID available"
fi

# Test 10: Error handling - Invalid ID
echo -e "${YELLOW}10. Error handling - Invalid ID${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/songs/invalid_id")
if [ "$response" = "400" ]; then
    print_result 0 "Invalid ID error handling working"
else
    print_result 1 "Invalid ID error handling failed (HTTP $response, expected 400)"
fi

# Test 11: Error handling - Missing fields
echo -e "${YELLOW}11. Error handling - Missing fields${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/songs" \
    -H "Content-Type: application/json" \
    -d '{"name":"Incomplete Song"}')
if [ "$response" = "400" ]; then
    print_result 0 "Missing fields error handling working"
else
    print_result 1 "Missing fields error handling failed (HTTP $response, expected 400)"
fi

# Test 12: Error handling - Duplicate name
echo -e "${YELLOW}12. Error handling - Duplicate name${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/songs" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test Song 1","path":"/test/duplicate.mp3","plays":0}')
if [ "$response" = "409" ]; then
    print_result 0 "Duplicate name error handling working"
else
    print_result 1 "Duplicate name error handling failed (HTTP $response, expected 409)"
fi

# Test 13: Delete song
echo -e "${YELLOW}13. DELETE song${NC}"
if [ ! -z "$song1_id" ]; then
    response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE_URL/api/songs/$song1_id")
    if [ "$response" = "200" ]; then
        print_result 0 "DELETE working"
    else
        print_result 1 "DELETE failed (HTTP $response)"
    fi
else
    print_result 1 "Cannot test DELETE - no song ID available"
fi

# Test 14: Verify song was deleted
echo -e "${YELLOW}14. Verify deletion${NC}"
if [ ! -z "$song1_id" ]; then
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/songs/$song1_id")
    if [ "$response" = "404" ]; then
        print_result 0 "Song deletion verified"
    else
        print_result 1 "Song deletion verification failed (HTTP $response, expected 404)"
    fi
else
    print_result 1 "Cannot verify deletion - no song ID available"
fi

# Test 15: Cleanup - Delete remaining song
echo -e "${YELLOW}15. Cleanup - Delete remaining song${NC}"
if [ ! -z "$song2_id" ]; then
    response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE_URL/api/songs/$song2_id")
    if [ "$response" = "200" ]; then
        print_result 0 "Cleanup successful"
    else
        print_result 1 "Cleanup failed (HTTP $response)"
    fi
else
    print_result 1 "Cannot cleanup - no song ID available"
fi

echo ""
echo "=================================="
echo "🧪 Pruebas completadas"
echo "=================================="
