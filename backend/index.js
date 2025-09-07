
// .env dosyasındaki ortam değişkenlerini yüklemek için
require('dotenv').config();

const mqtt = require('mqtt');
const { Pool } = require('pg');

// --- MQTT Bağlantı Bilgileri (.env dosyasından alınır) ---
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'sensor/data'; // Dinlenecek varsayılan topic

// --- PostgreSQL Bağlantı Bilgileri (.env dosyasından alınır) ---
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Veritabanı bağlantısını test et
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ PostgreSQL veritabanına bağlanırken hata oluştu:', err);
  } else {
    console.log('✅ PostgreSQL veritabanına başarıyla bağlanıldı:', res.rows[0].now);
  }
});

// --- MQTT İstemcisini Başlatma ---
const client = mqtt.connect(MQTT_BROKER_URL, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
});

client.on('connect', () => {
  console.log('✅ MQTT Broker\'ına başarıyla bağlanıldı.');
  // Belirtilen topic'e abone ol
  client.subscribe(MQTT_TOPIC, (err) => {
    if (!err) {
      console.log(`👂 '${MQTT_TOPIC}' topic'i dinleniyor...`);
    } else {
      console.error('❌ Topic\'e abone olurken hata:', err);
    }
  });
});

client.on('reconnect', () => {
  console.log('🔄 MQTT Broker\'ına yeniden bağlanılıyor...');
});

client.on('error', (err) => {
  console.error('❌ MQTT bağlantı hatası:', err);
  client.end();
});

client.on('close', () => {
  console.log('🔌 MQTT bağlantısı kapandı.');
});

// Mesaj geldiğinde çalışacak fonksiyon
client.on('message', async (topic, payload) => {
  const messagePayload = payload.toString();
  console.log(`📨 Yeni mesaj alındı - Topic: [${topic}], Mesaj: [${messagePayload}]`);

  const insertQuery = `
    INSERT INTO messages(topic, payload, received_at) 
    VALUES($1, $2, NOW())
  `;

  try {
    // Mesajı veritabanına kaydet
    await pool.query(insertQuery, [topic, messagePayload]);
    console.log('💾 Mesaj veritabanına başarıyla kaydedildi.');
  } catch (err) {
    console.error('❌ Mesajı veritabanına kaydederken hata oluştu:', err);
  }
});

console.log('🚀 Backend servisi başlatılıyor...');
