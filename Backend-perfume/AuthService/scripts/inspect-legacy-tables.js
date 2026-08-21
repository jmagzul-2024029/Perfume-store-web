/**
 * inspect-legacy-tables.js
 *
 * El código fuente ya no tiene ninguna referencia al proyecto de
 * restaurante (se revisó modelos, seeders, migraciones y rutas).
 * Si todavía "aparecen registros del restaurante", casi seguro es
 * porque:
 *
 *   1. sequelize.sync({ force: false }) NUNCA borra tablas ni filas,
 *      solo crea las que faltan. Si en algún momento levantaste el
 *      backend contra la misma base/volumen de Postgres que usaba el
 *      proyecto del restaurante, esas tablas y filas siguen ahí.
 *   2. El docker-compose.yml usa un volumen persistente
 *      (perfume_shop_postgres_data), así que los datos sobreviven aunque
 *      borres el contenedor.
 *
 * Este script NO borra nada solo. Te muestra qué tablas existen y cuántas
 * filas tiene cada una, para que decidas qué limpiar.
 *
 * Uso:
 *   node scripts/inspect-legacy-tables.js
 */
import 'dotenv/config';
import { sequelize } from '../configs/db.js';

const run = async () => {
  try {
    await sequelize.authenticate();

    const [tables] = await sequelize.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('\n📋 Tablas encontradas en la base de datos:\n');

    for (const { table_name } of tables) {
      const [[{ count }]] = await sequelize.query(
        `SELECT COUNT(*)::int AS count FROM "${table_name}";`
      );
      console.log(`  - ${table_name} (${count} filas)`);
    }

    console.log(`
Tablas esperadas por el proyecto de perfumería actual:
  users, user_profiles, user_emails, user_roles, roles,
  refresh_tokens, products, user_password_resets

Cualquier otra tabla que veas arriba (por ejemplo "dishes", "menu_items",
"reservations", "restaurants", etc.) es residuo del proyecto anterior y
se puede eliminar con:

  DROP TABLE IF EXISTS "nombre_de_la_tabla" CASCADE;

Si la tabla "products" tiene filas pero no son perfumes tuyos (nombres,
marcas o categorías que no reconoces), puedes vaciarla por completo con:

  TRUNCATE TABLE "products" RESTART IDENTITY CASCADE;

⚠️  TRUNCATE/DROP son irreversibles. Haz un respaldo si no estás seguro:
  docker exec perfume-shop-postgres pg_dump -U root PerfumeShop_DB > backup.sql
`);

    await sequelize.close();
  } catch (error) {
    console.error('Error inspeccionando la base de datos:', error.message);
    process.exit(1);
  }
};

run();
