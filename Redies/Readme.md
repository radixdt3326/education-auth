# 🧠 Redis Service

This folder contains the Docker configuration for running a standalone Redis server used by the application.


## 🚀 How to Use

To build and run the Redis container:

```bash
docker build -t my-redis-server .
docker run -d -p 6379:6379 --name redis my-redis-server
```

> You can also use a `docker-compose.yml` to manage this along with other services like backend, frontend, and database.

## 🔧 Custom Configuration

To use a custom Redis config file (e.g., `redis.conf`), copy it into the image and update the `CMD` line:

```Dockerfile
COPY redis.conf /usr/local/etc/redis/redis.conf
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
```