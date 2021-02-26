import { Account, Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction, TransactionInstruction } from '@solana/web3.js';
import BN from 'bn.js';
import { LOTTERY_ACCOUNT_DATA_LAYOUT } from './layout';

const connection = new Connection("http://localhost:8899", 'singleGossip');

export const initLottery = async (
    privateKeyByteArray,
    initializerSystemAccountPubkeyString,
    ticketPrice,
    lotteryProgramIdString) => {
    const privateKeyDecoded = privateKeyByteArray.split(',').map(s => parseInt(s));
    const initializerSystemAccountPubkey = new PublicKey(initializerSystemAccountPubkeyString);
    const initializerAccount = new Account(privateKeyDecoded);
    const lotteryProgramId = new PublicKey(lotteryProgramIdString);

    const lotteryAccount = new Account();
    const createLotteryAccountIx = SystemProgram.createAccount({
        fromPubkey: initializerAccount.publicKey,
        newAccountPubkey: lotteryAccount.publicKey,
        space: AccountLayout.span,
        lamports: await connection.getMinimumBalanceForRentExemption(AccountLayout.span, 'singleGossip'),
        programId: LOTTERY_PROGRAM_PUBKEY,
    });

    const initLotteryIx = new TransactionInstruction({
        programId: lotteryProgramId,
        keys: [
            { pubkey: initializerAccount.publicKey, isSigner: true, isWritable: false },
            { pubkey: lotteryAccount.publicKey, isSigner: false, isWritable: true },
            { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
        ],
        data: Buffer.from(Uint8Array.of(0, ...new BN(ticketPrice).toArray("le", 8)))
    })

    const tx = new Transaction()
        .add(createLotteryAccountIx, initLotteryIx);
    await connection.sendTransaction(tx, [lotteryAccount], {skipPreflight: false, preflightCommitment: 'singleGossip'});

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const encodedLotteryState = (await connection.getAccountInfo(lotteryAccount.publicKey, 'singleGossip')).data;
    const decodedLotteryState = LOTTERY_ACCOUNT_DATA_LAYOUT.decode(encodedLotteryState);
    return {
        lotteryAccountPubkey: escrowAccount.publicKey.toBase58(),
        isInitialized: !!decodedLotteryState.isInitialized,
        initializerAccountPubkey: new PublicKey(decodedLotteryState.initializerPubkey).toBase58(),
        ticketPrice: new BN(decodedLotteryState.ticketPrice, 10, "le").toNumber(),
        winnerAccountPubkey: new PublicKey(decodedLotteryState.winnerAccountPubkey).toBase58(),
        //entrants :S
    };
}

export const enterLottery = async () => {};
export const receiveLotteryWinnings = async () => {};