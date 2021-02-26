use solana_program::{
    program_pack::{IsInitialized, Pack, Sealed},
    program_error::ProgramError,
    pubkey::Pubkey,
};

use arrayref::{array_mut_ref, array_ref, array_refs, mut_array_refs};

#[derive(Debug)]
pub struct Lottery {
    pub is_initialized: bool,
    pub initializer_pubkey: Pubkey,  // Let's get that here for the eventual cancel, or why not the first entrant then?
    pub ticket_price: u64,
    pub winner: Pubkey,
    pub entrants: [Pubkey; 5], // Let's start with static number of entrants but this could be dynamic given initializer choice, or more sophisticated to be unlimited
}

impl Sealed for Lottery {}

impl IsInitialized for Lottery {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

pub const ENTRANT_COUNT:usize = 5;  // We can make this dynamic but that would complexify a fair bit

impl Pack for Lottery {
    const LEN: usize = 1 + 32 + 8 + 32 + 32 * ENTRANT_COUNT;
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let src = array_ref![src, 0, 233];
        let (
            is_initialized,
            initializer_pubkey,
            ticket_price_slice,
            winner_pubkey_slice,
            entrants_slice
        ) = array_refs![src, 1, 32, 8, 32, 32 * ENTRANT_COUNT];
        let is_initialized = match is_initialized {
            [0] => false,
            [1] => true,
            _ => return Err(ProgramError::InvalidAccountData),
        };

        let mut entrants = [Pubkey::default(); ENTRANT_COUNT];
        for i in 0..ENTRANT_COUNT {
            entrants[i] = Pubkey::new(&entrants_slice[i*32..(i+1)*32]);
        }

        Ok(Lottery {
            is_initialized,
            initializer_pubkey: Pubkey::new_from_array(*initializer_pubkey),
            ticket_price: u64::from_le_bytes(*ticket_price_slice),
            winner: Pubkey::new_from_array(*winner_pubkey_slice),
            entrants
        })
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        let dst = array_mut_ref![dst, 0, Lottery::LEN];
        let (
            is_initialized_dst,
            initializer_pubkey_dst,
            ticket_price_dst,
            winner_pubkey_dst,
            entrants_dst,
        ) = mut_array_refs![dst, 1, 32, 8, 32, 32 * ENTRANT_COUNT];

        let Lottery {
            is_initialized,
            initializer_pubkey,
            ticket_price,
            winner,
            entrants
        } = self;

        is_initialized_dst[0] = *is_initialized as u8;
        initializer_pubkey_dst.copy_from_slice(initializer_pubkey.as_ref());
        *ticket_price_dst = ticket_price.to_le_bytes();
        winner_pubkey_dst.copy_from_slice(winner.as_ref());

        let mut i = 0;
        entrants_dst.copy_from_slice(&[0u8; 160]);
        for entrant in entrants.iter() { // TODO: Find better way to perform this business
            entrants_dst[i..i+32].copy_from_slice(entrant.as_ref());
            i += 32;
        }
    }
}