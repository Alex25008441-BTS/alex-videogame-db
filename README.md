
# Proyecto AlexVideojuegosBD en Solana con Rust y Anchor

## 📖 Descripción

Este proyecto es una dApp en la blockchain Solana que implementa una base de datos simple para almacenar información sobre usuarios de videojuegos. Usamos Rust con el framework Anchor para crear el programa on-chain y TypeScript para interactuar con él desde cliente.

El programa permite crear una base de datos, agregar usuarios con información personalizada, actualizar datos y eliminar usuarios.

---

## 🛠 Tecnología usada

- **Rust** con **Anchor framework** para el desarrollo del smart contract en Solana.
- **TypeScript** usando la librería `@solana/web3.js` y el cliente generado por Anchor.
- **Solana Blockchain**: cuenta con el sistema de cuentas para almacenar datos persistentes.

---

## 📦 Estructura del programa on-chain (Rust)

### Cuentas

- `Database`: estructura que guarda el nombre de la base y un vector con las cuentas de usuarios.
- `InfoUser`: estructura para cada usuario con campos:
  - nombre
  - tiempo de juego
  - información general
  - juegos favoritos
  - calificación (u8)

### Instrucciones (handlers)

- `initialize_database`: Crea la cuenta de la base de datos inicializando nombre y usuarios vacíos.
- `initialize_infouser`: Crea la cuenta usuario con todos sus datos.
- `update_infouser`: Actualiza los datos de un usuario, permitiendo cambiar solo los campos deseados.
- `delete_infouser`: Elimina la cuenta usuario y devuelve los lamports al pagador.

---

## ⚙️ Archivo Client (TypeScript)

El cliente ejecuta en orden:

1. Crear la base de datos con un nombre fijo (`VideojuegosDB`).
2. Crear un usuario con datos iniciales.
3. Actualizar algunos campos del usuario.
4. Eliminar el usuario.

Utiliza helpers como `fetchWithRetry` para asegurar recuperar los datos antes de continuar.

---

## 📝 Cómo usar

1. Asegúrate de tener instalado:
   - Rust + Anchor CLI
   - Node.js + npm/yarn
   - Conexión a devnet o localhost Solana

2. Compila y despliega el programa con Anchor:
   ```bash
   anchor build
   anchor deploy
   ```

3. Ejecuta el cliente TypeScript para probar las funciones:
   ```bash
   ts-node client.ts
   ```

---

## 🧐 Notas importantes

- El espacio asignado a las cuentas se calcula estimando el tamaño de strings y vectores para evitar errores de space insuficiente.
- El pago de creación de cuentas se realiza por el `user` (pagador).
- Para actualizaciones parciales, se usa `Option<T>` en Rust y se envían valores o `null` desde el cliente para no modificar.

---

## 📚 Documentación recomendada

- [Anchor Framework Docs](https://book.anchor-lang.com/)
- [Solana Web3.js docs](https://solana-labs.github.io/solana-web3.js/)
- [Programación en Rust para Solana](https://docs.solana.com/developing/on-chain-programs/overview)

