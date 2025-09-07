// .env dosyasındaki ortam değişkenlerini yüklemek için
require('dotenv').config();

const mqtt = require('mqtt');
const { Pool } = require('pg');

/*
 * -----------------------------------------------------------------------------
 * GEREKLİ ORTAM DEĞİŞKENLERİ (.env dosyası)
 * -----------------------------------------------------------------------------
 * Bu servisin çalışması için projenin ana dizininde bir `.env` dosyası oluşturun
 * ve aşağıdaki değişkenleri kendi bilgilerinizle doldurun:
 *
 * # MQTT Broker Bilgileri
 * MQTT_BROKER_URL=wss://your-broker-url.hivemq.cloud:8884/mqtt
 * MQTT_USERNAME=your_mqtt_username
 * MQTT_PASSWORD=your_mqtt_password
 * MQTT_TOPIC=sensor/data
 *
 * # PostgreSQL Veritabanı Bilgileri
 * PG_USER=your_postgres_user
 * PG_HOST=your_postgres_host
 * PG_DATABASE=your_postgres_database
 * PG_PASSWORD=your_postgres_password
 * PG_PORT=5432
 * -----------------------------------------------------------------------------
 */

// --- PostgreSQL Bağlantı Bilgileri (.env dosyasından alınır) ---
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Veritabanı tablosunu başlatan ve hazır olduğunu doğrulayan fonksiyon
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query('SELECT NOW()'); // Bağlantıyı test et
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        topic VARCHAR(255) NOT NULL,
        payload TEXT,
        received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    await client.query(createTableQuery);
    console.log('✅ Veritabanı bağlantısı başarılı ve "messages" tablosu hazır.');
    return true;
  } catch (err) {
    console.error('❌ Veritabanı başlatılırken hata oluştu:', err);
    return false;
  } finally {
    client.release();
  }
}

// MQTT istemcisini başlatan fonksiyon
function startMqttClient() {
  // --- MQTT Bağlantı Bilgileri (.env dosyasından alınır) ---
  const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
  const MQTT_USERNAME = process.env.MQTT_USERNAME;
  const MQTT_PASSWORD = process.env.MQTT_PASSWORD;
  const MQTT_TOPIC = process.env.MQTT_TOPIC || 'sensor/data';

  console.log('🚀 MQTT istemcisi başlatılıyor...');
  const client = mqtt.connect(MQTT_BROKER_URL, {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
  });

  client.on('connect', () => {
    console.log('✅ MQTT Broker\'ına başarıyla bağlanıldı.');
    client.subscribe(MQTT_TOPIC, (err) => {
      if (!err) {
        console.log(`👂 '${MQTT_TOPIC}' topic'i dinleniyor...`);
      } else {
        console.error(`❌ '${MQTT_TOPIC}' topic'ine abone olurken hata:`, err);
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

  client.on('message', async (topic, payload) => {
    const messagePayload = payload.toString();
    console.log(`📨 Yeni mesaj alındı - Topic: [${topic}], Mesaj: [${messagePayload}]`);

    const insertQuery = 'INSERT INTO messages(topic, payload) VALUES($1, $2)';

    try {
      await pool.query(insertQuery, [topic, messagePayload]);
      console.log('💾 Mesaj veritabanına başarıyla kaydedildi.');
    } catch (err) {
      console.error('❌ Mesajı veritabanına kaydederken hata oluştu:', err);
    }
  });
}

// Ana uygulama fonksiyonu
async function main() {
  console.log('🚀 Backend servisi başlatılıyor...');
  const dbReady = await initializeDatabase();
  if (dbReady) {
    startMqttClient();
  } else {
    console.error('❗️ Veritabanı hazır olmadığı için servis başlatılamadı. Lütfen .env ayarlarınızı kontrol edin.');
    process.exit(1);
  }
}

main();
