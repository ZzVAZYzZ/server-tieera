const redis = require("redis");
let client = {};

client.instaceClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

const connectRedis = async () => {
  client.instaceClient.on("error", (err) =>
    console.log("Redis Client Error", err),
  );
  await client.instaceClient
    .connect()
    .then(() => console.log("Redis connected"))
    .then(async()=>{
        await client.instaceClient.set("thanh",123);
        const test = await client.instaceClient.get("hai");
        console.log(test);
    })
};

const getRedis = () => client;

const closeRedis = async () => {
  client.instaceClient.off("error", (err) =>
    console.log("Redis Client Error", err),
  );
  await client.instaceClient.disconnect().then(() => {
    console.log("Redis disconnected");
  });
};

module.exports = { connectRedis, getRedis, closeRedis };
