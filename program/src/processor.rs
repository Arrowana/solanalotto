use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    program_error::ProgramError,
    msg,
    pubkey::Pubkey,
    program_pack::{Pack, IsInitialized},
    sysvar::{rent::Rent, Sysvar},
    program::{invoke, invoke_signed},
    system_program,
    system_instruction
};
use crate::{instruction::LotteryInstruction, error::LotteryError, state::{Lottery, ENTRANT_COUNT}};

pub struct Processor;
impl Processor {
    pub fn process(program_id: &Pubkey, accounts: &[AccountInfo], instruction_data: &[u8]) -> ProgramResult {
        let instruction = LotteryInstruction::unpack(instruction_data)?;

        match instruction {
            LotteryInstruction::InitLottery { initializer_pubkey } => {
                msg!("Instruction: InitLottery");
                Self::process_init_lottery(accounts, program_id, &initializer_pubkey)
            },
            LotteryInstruction::Enter => {
                msg!("Instruction: Enter");
                Self::process_enter(accounts, program_id)
            },
            LotteryInstruction::Receive => {
                msg!("Instruction: Receive");
                Self::process_receive(accounts, program_id)
            }
        }
    }

    fn process_init_lottery(
        accounts: &[AccountInfo],
        program_id: &Pubkey,
        initializer_pubkey: &Pubkey
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();

        let lottery_account = next_account_info(account_info_iter)?;
        let rent = &Rent::from_account_info(next_account_info(account_info_iter)?)?;

        let account_rent_exempt_minimum_balance = rent.minimum_balance(lottery_account.data_len());
        if !(lottery_account.lamports() >= account_rent_exempt_minimum_balance) {
            return Err(LotteryError::NotRentExempt.into());
        }

        if lottery_account.lamports() <= account_rent_exempt_minimum_balance {
            return Err(LotteryError::TicketAmountMissing.into());
        }
        
        let mut lottery_info = Lottery::unpack_unchecked(&lottery_account.data.borrow())?;
        if lottery_info.is_initialized() {
            return Err(ProgramError::AccountAlreadyInitialized);
        }

        lottery_info.is_initialized = true;
        lottery_info.initializer_pubkey = *initializer_pubkey;
        lottery_info.ticket_price = lottery_account.lamports() - account_rent_exempt_minimum_balance;
        lottery_info.winner = Pubkey::default();
        lottery_info.entrants[0] = *initializer_pubkey;
        // Default remaining entrants
        for entrant in lottery_info.entrants[1..].iter_mut() {
            *entrant = Pubkey::default(); // Is this default the best way to express not valid?
        }

        Lottery::pack(lottery_info, &mut lottery_account.data.borrow_mut())?;

        Ok(())
    }

    fn process_enter(
        accounts: &[AccountInfo],
        program_id: &Pubkey,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();

        let payer_account = next_account_info(account_info_iter)?; // Shortcut for now as we want to get that done
        let lottery_account = next_account_info(account_info_iter)?;
        let system_program_account = next_account_info(account_info_iter)?;

        if !payer_account.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        if lottery_account.owner != program_id {
            return Err(ProgramError::IncorrectProgramId);
        }

        let mut lottery_info = Lottery::unpack_unchecked(&lottery_account.data.borrow())?;
        if !lottery_info.is_initialized() {
            return Err(ProgramError::InvalidAccountData); // Something isn't right here
        }

        if lottery_info.winner != Pubkey::default() {
            return Err(LotteryError::LotteryFinished.into());
        }

        // Transfer of ticket price
        invoke(
            &system_instruction::transfer(
                &payer_account.key,
                lottery_account.key,
                lottery_info.ticket_price,
            ),
            &[
                payer_account.clone(),
                lottery_account.clone(),
                system_program_account.clone(),
            ],
        )?;

        // Write entry in entrants
        // TODO: Do not allow payer to enter more than once
        let mut entrants_count = 1;
        for entrant in lottery_info.entrants.iter_mut() {
            if *entrant == Pubkey::default() {
                *entrant = *payer_account.key;
                break
            }
            entrants_count += 1;
        }

        if entrants_count == ENTRANT_COUNT {
            lottery_info.winner = lottery_info.entrants[2];  // TODO: Make this some random
        }

        Lottery::pack(lottery_info, &mut lottery_account.data.borrow_mut())?;

        Ok(())
    }

    fn process_receive(
        accounts: &[AccountInfo],
        program_id: &Pubkey,
    ) -> ProgramResult {

        Ok(())
    }
}