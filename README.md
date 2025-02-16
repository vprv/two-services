# 🚀 Brewery Microservices

This project consists of two **NestJS-based** microservices:

- **Service A:**

  - Fetches brewery data from a public API (**Open Brewery DB**)
  - Stores the data in **MongoDB**
  - Logs API execution times using **RedisTimeSeries**
  - Publishes events about executed operations (e.g., results, timestamps)

- **Service B:**
  - Listens for events published by **Service A** (via Redis Pub/Sub)
  - Stores received events in **MongoDB**
  - Provides an API to retrieve logs based on a **date range**

Both services are **fully containerized** using **Docker Compose** and documented via **Swagger UI**.

---

## 🛠 Prerequisites

Make sure you have the following installed:

- **[Docker](https://www.docker.com/get-started)**
- **[Docker Compose](https://docs.docker.com/compose/)**

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2️⃣ Start the Services with Docker Compose

```bash
docker compose up --build
```

> This command will build and start all containers, including:
>
> - **MongoDB** (Port: `27118` on host)
> - **Redis (RedisTimeSeries enabled)** (Port: `6579` on host)
> - **Service A** (Port: `3100` on host)
> - **Service B** (Port: `3101` on host)

---

## 📜 API Documentation

Both services expose their APIs via **Swagger UI**:

- **Service A Swagger:**  
  👉 [http://localhost:3100/api-docs](http://localhost:3100/api-docs)

- **Service B Swagger:**  
  👉 [http://localhost:3101/api-docs](http://localhost:3101/api-docs)

Use Swagger UI to explore and test available API endpoints.

---

## 🔬 Testing the API

### 1️⃣ Fetch and Store Brewery Data

**Endpoint:**

```http
GET /public-api/search-and-store?query=<brewery-name>
```

Example:

```bash
curl -X 'GET' 'http://localhost:3100/public-api/search-and-store?query=brewery' -H 'accept: */*'
```

Expected Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "name": "Brewery Name",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "_id": "67ab4370a53024799dda76f3"
    }
  ]
}
```

### 2️⃣ Search Stored Brewery Data

**Endpoint:**

```http
GET /public-api/search?query=<brewery-name>
```

Example:

```bash
curl -X 'GET' 'http://localhost:3100/public-api/search?query=brewery' -H 'accept: */*'
```

---

### 3️⃣ Retrieve Time Series Logs

**Endpoint:**

```http
GET /public-api/timeseries
```

Example:

```bash
curl -X 'GET' 'http://localhost:3100/public-api/timeseries' -H 'accept: */*'
```

---

### 4️⃣ Fetch Event Logs by Date Range

**Endpoint:**

```http
GET /events?from=<ISO_DATE>&to=<ISO_DATE>
```

Example:

```bash
curl -X 'GET' 'http://localhost:3101/events?from=2025-02-10T00:00:00Z&to=2025-02-11T23:59:59Z' -H 'accept: */*'
```

Expected Response:

```json
{
  "events": [
    {
      "timestamp": "2025-02-11T12:00:00Z",
      "operation": "search-and-store",
      "result": "Success"
    }
  ]
}
```

---

## 📌 Debugging and Logs

If something goes wrong, check the logs:

```bash
docker compose logs service-a
docker compose logs service-b
```

---

## 🔄 Stopping the Services

To stop and remove all running containers, use:

```bash
docker compose down
```

---

## 📝 Notes

- **If RedisTimeSeries is not working**: Ensure you're using the correct Redis image that supports RedisTimeSeries (e.g., `redislabs/redistimeseries:latest`).
- **If MongoDB is not connecting**: Check the MongoDB logs and verify that it's listening on the correct port (`27118`).
- **If Swagger UI does not load**: Make sure the services are running and accessible at `http://localhost:3100/api-docs` and `http://localhost:3101/api-docs`.

---

## 📜 License

MIT License - Feel free to use and modify this project.
