use anchor_lang::prelude::*;
declare_id!("CuyxDHFfD2KWG3QQ5N9WCULgkXsYfUMeY4Pqx7YT2M4d");

#[program]
pub mod videojuegos_db {
    use super::*;
    pub fn initialize_database(ctx: Context<InitializeDatabase>, name: String) -> Result<()> {
        let database = &mut ctx.accounts.database;
        database.name = name;
        database.usuarios = Vec::new();
        Ok(())
    }
    pub fn initialize_infouser(
        ctx: Context<InitializeInfoUser>,
        nombre: String,
        tiempo_juego: String,
        informacion_general: String,
        juegos_favoritos: String,
        calificacion: u8,
    ) -> Result<()> {
        let infouser = &mut ctx.accounts.infouser;
        infouser.nombre = nombre;
        infouser.tiempo_juego = tiempo_juego;
        infouser.informacion_general = informacion_general;
        infouser.juegos_favoritos = juegos_favoritos;
        infouser.calificacion = calificacion;
        Ok(())
    }
    pub fn delete_infouser(_ctx: Context<DeleteInfoUser>) -> Result<()> {
        // No necesitas modificar nada, Anchor se encarga de cerrar y enviar lamports al user
        Ok(())
    }
    pub fn update_infouser(
        ctx: Context<UpdateInfoUser>,
        nombre: Option<String>,
        tiempo_juego: Option<String>,
        informacion_general: Option<String>,
        juegos_favoritos: Option<String>,
        calificacion: Option<u8>,
    ) -> Result<()> {
        let infouser = &mut ctx.accounts.infouser;

        if let Some(n) = nombre {
            infouser.nombre = n;
        }
        if let Some(t) = tiempo_juego {
            infouser.tiempo_juego = t;
        }
        if let Some(i) = informacion_general {
            infouser.informacion_general = i;
        }
        if let Some(j) = juegos_favoritos {
            infouser.juegos_favoritos = j;
        }
        if let Some(c) = calificacion {
            infouser.calificacion = c;
        }
        Ok(())
    }

}
#[account]
pub struct Database {
    pub name: String,          // Nombre de la base de datos
    pub usuarios: Vec<Pubkey>, // Vector con las cuentas de los usuarios
}
#[account]
pub struct InfoUser {
    pub nombre: String,
    pub tiempo_juego: String,
    pub informacion_general: String,
    pub juegos_favoritos: String,
    pub calificacion: u8,
}
#[derive(Accounts)]
pub struct InitializeDatabase<'info> {
    #[account(init, payer = user, space = 8 + 64 + 32 * 100)]
    // espacio estimado (discutimos abajo)
    pub database: Account<'info, Database>,
    #[account(mut)]
    pub user: Signer<'info>, // Usuario que paga la creación
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct InitializeInfoUser<'info> {
    #[account(init, payer = user, space = 8 + 64*4 + 1)]
    // 8 bytes + 4 strings (64 bytes c/u aprox) + 1 byte para calificacion
    pub infouser: Account<'info, InfoUser>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateInfoUser<'info> {
    #[account(mut)]
    pub infouser: Account<'info, InfoUser>, // cuenta mutable para update
    pub user: Signer<'info>, // firma autorizando la acción
}

#[derive(Accounts)]
pub struct DeleteInfoUser<'info> {
    #[account(mut, close = user)]
    pub infouser: Account<'info, InfoUser>, // la cuenta que cerramos
    #[account(mut)]
    pub user: Signer<'info>, // recibe los lamports
}
