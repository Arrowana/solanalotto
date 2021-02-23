use solana_program::{instruction::*, program_pack::Pack, pubkey::Pubkey, system_instruction, sysvar::rent};
use solana_program_test::*;
use solana_sdk::{
    account::Account,
    signature::{Keypair, Signer},
    transaction::{Transaction},
};
use solanalotto::{processor::{Processor}, state::Lottery};
use assert_matches::assert_matches;

#[tokio::test]
async fn test_lottery_initialization() {
    let program_id = solanalotto::id();
    let mut pt = ProgramTest::new(
        "solanalotto",
        program_id,
        processor!(Processor::process),
    );
    
    // Dial down the BPF compute budget to detect if the program gets bloated in the future
    pt.set_bpf_compute_max_units(50_000);

    let lottery_account_keypair = Keypair::new();
    let lottery_account_pubkey = lottery_account_keypair.pubkey();

    let (mut banks_client, payer, recent_blockhash) = pt.start().await;
    let rent = banks_client.get_rent().await.unwrap();
    let lottery_account_rent = rent.minimum_balance(Lottery::LEN);
    let ticket_price = 10;

    let mut instruction_data = vec![0];
    instruction_data.extend_from_slice(&payer.pubkey().to_bytes());

    let mut transaction = Transaction::new_with_payer(
        &[
            system_instruction::create_account(&payer.pubkey(), &lottery_account_pubkey, lottery_account_rent + ticket_price, Lottery::LEN as u64, &program_id),  // Account is owned by lottery program and gets rent + ticket_price
            Instruction {
                program_id,
                accounts: vec![AccountMeta::new(lottery_account_pubkey, false), AccountMeta::new_readonly(rent::ID, false)],
                data: instruction_data,
            }
        ],
        Some(&payer.pubkey()),
    );
    transaction.sign(&[&payer, &lottery_account_keypair], recent_blockhash);

    assert_matches!(banks_client.process_transaction(transaction).await, Ok(()));

    let lottery_account = banks_client.get_account(lottery_account_pubkey).await.unwrap().unwrap();
    let lottery_info = Lottery::unpack_unchecked(&lottery_account.data).unwrap();

    let mut expected_entrants = [Pubkey::default(); 5];
    expected_entrants[0] = payer.pubkey();
    assert_eq!(lottery_info.is_initialized, true);
    assert_eq!(lottery_info.initializer_pubkey, payer.pubkey());
    assert_eq!(lottery_info.ticket_price, ticket_price);
    assert_eq!(lottery_info.entrants, expected_entrants);

    assert_eq!(lottery_account.lamports, lottery_account_rent + ticket_price);
}

#[tokio::test]
async fn test_enter_lottery() {
    // Create lottery, then get ticket
    // TODO: Share code with above init test
    let program_id = solanalotto::id();
    let mut pt = ProgramTest::new(
        "solanalotto",
        program_id,
        processor!(Processor::process),
    );

    let lottery_account_keypair = Keypair::new();
    let lottery_account_pubkey = lottery_account_keypair.pubkey();

    let second_user_keypair = Keypair::new();
    pt.add_account(second_user_keypair.pubkey(), Account {lamports: 1000000000, ..Account::default()});

    let third_user_keypair = Keypair::new();
    pt.add_account(third_user_keypair.pubkey(), Account::default());

    let (mut banks_client, payer, recent_blockhash) = pt.start().await;
    let rent = banks_client.get_rent().await.unwrap();
    let lottery_account_rent = rent.minimum_balance(Lottery::LEN);
    let ticket_price = 10;

    let mut instruction_data = vec![0];
    instruction_data.extend_from_slice(&payer.pubkey().to_bytes());

    let mut transaction = Transaction::new_with_payer(
        &[
            system_instruction::create_account(&payer.pubkey(), &lottery_account_pubkey, lottery_account_rent + ticket_price, Lottery::LEN as u64, &program_id),  // Account is owned by lottery program and gets rent + ticket_price
            Instruction {
                program_id,
                accounts: vec![AccountMeta::new(lottery_account_pubkey, false), AccountMeta::new_readonly(rent::ID, false)],
                data: instruction_data,
            }
        ],
        Some(&payer.pubkey()),
    );
    transaction.sign(&[&payer, &lottery_account_keypair], recent_blockhash);

    assert_matches!(banks_client.process_transaction(transaction).await, Ok(()));

    // END of copy pasta

    let mut transaction = Transaction::new_with_payer(
        &[Instruction {
                program_id,
                accounts: vec![AccountMeta::new_readonly(second_user_keypair.pubkey(), true), AccountMeta::new(lottery_account_pubkey, false)],
                data: vec![1],
        }],
        Some(&second_user_keypair.pubkey()),
    );
    let recent_blockhash = banks_client.get_recent_blockhash().await.unwrap();
    transaction.sign(&[&second_user_keypair], recent_blockhash);
    
    assert_matches!(banks_client.process_transaction(transaction).await, Ok(()));

    let lottery_account = banks_client.get_account(lottery_account_pubkey).await.unwrap().unwrap();
    let lottery_info = Lottery::unpack_unchecked(&lottery_account.data).unwrap();

    let mut expected_entrants = [Pubkey::default(); 5];
    expected_entrants[0] = payer.pubkey();
    expected_entrants[1] = second_user_keypair.pubkey();
    assert_eq!(lottery_info.is_initialized, true);
    assert_eq!(lottery_info.initializer_pubkey, payer.pubkey());
    assert_eq!(lottery_info.ticket_price, ticket_price);
    assert_eq!(lottery_info.entrants, expected_entrants);

    assert_eq!(lottery_account.lamports, lottery_account_rent + 2 * ticket_price);

    // Third user does not have ticket price
    let mut transaction = Transaction::new_with_payer(
        &[Instruction {
                program_id,
                accounts: vec![AccountMeta::new_readonly(second_user_keypair.pubkey(), true), AccountMeta::new(lottery_account_pubkey, false)],
                data: vec![1],
        }],
        Some(&second_user_keypair.pubkey()),
    );
    let recent_blockhash = banks_client.get_recent_blockhash().await.unwrap();
    transaction.sign(&[&second_user_keypair], recent_blockhash);
    
    banks_client.process_transaction(transaction).await.unwrap();
    //assert_matches!(banks_client.process_transaction(transaction).await, Ok(()));
}

#[tokio::test]
async fn test_lottery_concludes() {
    // Last user enters and lottery ends transfering lamports to winner
}

#[tokio::test]
async fn test_lottery_cancel() {
    // Test a lottery can only be cancelled when there are not entrants
}