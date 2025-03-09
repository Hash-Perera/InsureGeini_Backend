import amqp from "amqplib";
import axios from "axios";

// dotenv.config();
const RABBITMQ_URI = process.env.RABBITMQ_URI;
let channel;

const EXCHANGE_NAME = "insure_geini_exchange";
const QUEUES = {
  DAMAGE: "damage_detection_queue",
  FRAUD: "fraud_detection_queue",
  POLICY: "policy_queue",
};
const QUEUE_NAMES = [QUEUES.DAMAGE, QUEUES.FRAUD, QUEUES.POLICY];

async function initializeRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URI);
    channel = await connection.createChannel();

    // Declare an exchange (type: direct)
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });

    // Declare and bind queues to the exchange with routing keys
    await channel.assertQueue(QUEUES.DAMAGE, { durable: true });
    await channel.bindQueue(QUEUES.DAMAGE, EXCHANGE_NAME, "damage.key");
    await channel.assertQueue(QUEUES.FRAUD, { durable: true });
    await channel.bindQueue(QUEUES.FRAUD, EXCHANGE_NAME, "fraud.key");
    await channel.assertQueue(QUEUES.POLICY, { durable: true });
    await channel.bindQueue(QUEUES.POLICY, EXCHANGE_NAME, "policy.key");

    console.log("✅ RabbitMQ Initialized with Exchange & Queues");
  } catch (err) {
    console.error("❌ RabbitMQ connection error:", err);
  }
}

async function sendToDamageDetectionQueue(data) {
  channel.publish(
    EXCHANGE_NAME,
    "damage.key",
    Buffer.from(JSON.stringify(data))
  );
}

async function sendToFraudDetectionQueue(data) {
  channel.publish(
    EXCHANGE_NAME,
    "fraud.key",
    Buffer.from(JSON.stringify(data))
  );
}

async function getQueueStats() {
  const stats = {};

  try {
    const response = await axios.get(process.env.RABBITMQ_API, {
      auth: {
        username: process.env.RABBITMQ_USER,
        password: process.env.RABBITMQ_PASS,
      },
    });

    // Loop through all queues and extract relevant data
    response.data.forEach((queue) => {
      if (QUEUE_NAMES.includes(queue.name)) {
        stats[queue.name] = {
          readyMessages: queue.messages_ready, // Messages waiting to be processed
          unackedMessages: queue.messages_unacknowledged, // Messages taken but not acked
          totalMessages: queue.messages, // Total messages (ready + unacked)
          consumers: queue.consumers, // Number of consumers listening to this queue
        };
      }
    });
  } catch (error) {
    console.error("❌ Error fetching queue stats:", error.message);
    stats["error"] = error.message;
  }

  return stats;
}

export default {
  initializeRabbitMQ,
  sendToDamageDetectionQueue,
  sendToFraudDetectionQueue,
  getQueueStats,
};
