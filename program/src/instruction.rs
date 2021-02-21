use crate::error::LotteryError::InvalidInstruction;
use solana_program::{pubkey::Pubkey, program_error::ProgramError};

pub enum LotteryInstruction {

    /// Accounts expected:
    ///
    /// 0. `[signer]` The account of the person initializing the lottery
    /// 1. `[writable]` The lottery account, it will hold all necessary info about the lottery and also all the funds
    /// 2. `[]` The rent sysvar
    InitLottery {
        initializer_pubkey: Pubkey
    },
    Enter
}

impl LotteryInstruction {
    /// Unpacks a byte buffer into a [LotteryInstruction](enum.LotteryInstruction.html).
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;

        Ok(match tag {
            0 => Self::InitLottery {
                initializer_pubkey: Pubkey::new(rest),
            },
            1 => Self::Enter,
            _ => return Err(InvalidInstruction.into()),
        })
    }
}