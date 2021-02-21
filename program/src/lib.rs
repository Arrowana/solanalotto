pub mod instruction;
pub mod error;
pub mod processor;
pub mod state;

solana_program::declare_id!("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

#[cfg(not(feature = "no-entrypoint"))]
pub mod entrypoint;