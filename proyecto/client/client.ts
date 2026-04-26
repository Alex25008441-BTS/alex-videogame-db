//////////////////// Imports ////////////////////
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";

////////////////// Constantes ////////////////////
const DB_NAME = "VideojuegosDB";
const owner = pg.wallet.publicKey;

//////////////////// Logs base ////////////////////
console.log("My address:", owner.toBase58());
const balance = await pg.connection.getBalance(owner);
console.log(`My balance: ${balance / web3.LAMPORTS_PER_SOL} SOL`);

//////////////////// Keypairs ////////////////////
const databaseKp = Keypair.generate();
const user1Kp = Keypair.generate();

//////////////////// Helpers ////////////////////

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 🔥 fetch con reintentos (esto es la clave real)
async function fetchWithRetry(pubkey: PublicKey, type: "database" | "user") {
  for (let i = 0; i < 5; i++) {
    try {
      if (type === "database") {
        return await pg.program.account.database.fetch(pubkey);
      } else {
        return await pg.program.account.infoUser.fetch(pubkey);
      }
    } catch (e) {
      console.log(`⏳ Esperando cuenta... intento ${i + 1}`);
      await sleep(1000);
    }
  }
  throw new Error("❌ No se pudo obtener la cuenta");
}

function printUser(user: any) {
  console.log("Nombre:", user.nombre);
  console.log("Tiempo:", user.tiempoJuego);
  console.log("Info:", user.informacionGeneral);
  console.log("Favoritos:", user.juegosFavoritos);
  console.log("Calificación:", user.calificacion);
}

//////////////////// Instrucciones ////////////////////

// 1. Crear DB
async function initializeDatabase() {
  console.log("🚀 Creando database...");

  const txHash = await pg.program.methods
    .initializeDatabase(DB_NAME)
    .accounts({
      database: databaseKp.publicKey,
      user: owner,
      systemProgram: SystemProgram.programId,
    })
    .signers([databaseKp])
    .rpc();

  console.log("TX:", txHash);

  // 🔥 confirmación real
  await pg.connection.confirmTransaction(txHash, "confirmed");

  console.log("📦 Database:", databaseKp.publicKey.toBase58());

  const db = await fetchWithRetry(databaseKp.publicKey, "database");
  console.log("✅ DB creada:", db.name);
}

// 2. Crear usuario
async function createUser() {
  console.log("👤 Creando usuario...");

  const txHash = await pg.program.methods
    .initializeInfouser(
      "Alejandro",
      "120 horas",
      "Le gustan los RPG",
      "Elden Ring, Zelda",
      9
    )
    .accounts({
      infouser: user1Kp.publicKey,
      user: owner,
      systemProgram: SystemProgram.programId,
    })
    .signers([user1Kp])
    .rpc();

  console.log("TX:", txHash);

  await pg.connection.confirmTransaction(txHash, "confirmed");

  const user = await fetchWithRetry(user1Kp.publicKey, "user");
  console.log("✅ Usuario creado:");
  printUser(user);
}

// 3. Update
async function updateUser() {
  console.log("✏️ Actualizando usuario...");

  const txHash = await pg.program.methods
    .updateInfouser(
      "Alex Updated",
      null,
      null,
      "Dark Souls",
      10
    )
    .accounts({
      infouser: user1Kp.publicKey,
      user: owner,
    })
    .rpc();

  console.log("TX:", txHash);

  await pg.connection.confirmTransaction(txHash, "confirmed");

  const user = await fetchWithRetry(user1Kp.publicKey, "user");
  console.log("✅ Usuario actualizado:");
  printUser(user);
}

// 4. Delete
async function deleteUser() {
  console.log("🗑 Eliminando usuario...");

  const txHash = await pg.program.methods
    .deleteInfouser()
    .accounts({
      infouser: user1Kp.publicKey,
      user: owner,
    })
    .rpc();

  console.log("TX:", txHash);

  await pg.connection.confirmTransaction(txHash, "confirmed");

  console.log("✅ Usuario eliminado");
}

//////////////////// RUN ////////////////////

await initializeDatabase();
await createUser();
await updateUser();
await deleteUser();
