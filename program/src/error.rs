use thiserror::Error;

use solana_program::program_error::ProgramError;

#[derive(Error, Debug, Copy, Clone)]
pub enum LotteryError {
    /// Invalid instruction
    #[error("Invalid Instruction")]
    InvalidInstruction,
    /// Not Rent Exempt
    #[error("Not Rent Exempt")]
    NotRentExempt,
    /// Ticket Amount Missing
    #[error("Ticket amount missing")]
    TicketAmountMissing,
    /// Expected Amount Mismatch
    #[error("Expected Amount Mismatch")]
    ExpectedAmountMismatch,
    /// Amount Overflow
    #[error("Amount Overflow")]
    AmountOverflow,
    /// Lottery Finished
    #[error("Lottery Finished")]
    LotteryFinished,
}

impl From<LotteryError> for ProgramError {
    fn from(e: LotteryError) -> Self {
        ProgramError::Custom(e as u32)
    }
}