import { Account, Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction, TransactionInstruction } from '@solana/web3.js';
import BN from 'bn.js';
import { LOTTERY_ACCOUNT_DATA_LAYOUT } from './layout';

const connection = new Connection("http://localhost:8899", 'singleGossip');

export const initLottery = async (
    privateKeyByteArray,
    ticketPrice,
    lotteryProgramIdString) => {
    const privateKeyDecoded = privateKeyByteArray.split(',').map(s => parseInt(s));
    const initializerAccount = new Account(privateKeyDecoded);
    console.log(`initializer pubKey: ${initializerAccount.publicKey.toBase58()}`);
    const lotteryProgramId = new PublicKey(lotteryProgramIdString);

    const lotteryAccount = new Account();
    const createLotteryAccountIx = SystemProgram.createAccount({
        fromPubkey: initializerAccount.publicKey,
        newAccountPubkey: lotteryAccount.publicKey,
        space: LOTTERY_ACCOUNT_DATA_LAYOUT.span,
        lamports: await connection.getMinimumBalanceForRentExemption(LOTTERY_ACCOUNT_DATA_LAYOUT.span, 'singleGossip') + ticketPrice * 10000000000,
        programId: lotteryProgramId,
    });

    const ixData = Buffer.concat([Buffer.from([0]), initializerAccount.publicKey.toBuffer()]);
    const initLotteryIx = new TransactionInstruction({
        programId: lotteryProgramId,
        keys: [
            { pubkey: lotteryAccount.publicKey, isSigner: false, isWritable: true },
            { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
        ],
        data: ixData
    });
    
    const tx = new Transaction()
        .add(createLotteryAccountIx, initLotteryIx);
    const signature = await connection.sendTransaction(tx, [initializerAccount, lotteryAccount], {skipPreflight: false, preflightCommitment: 'singleGossip'});
    console.log(`Tx signature: ${signature}`);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const encodedLotteryState = (await connection.getAccountInfo(lotteryAccount.publicKey, 'singleGossip')).data;
    const decodedLotteryState = LOTTERY_ACCOUNT_DATA_LAYOUT.decode(encodedLotteryState);
    return {
        lotteryAccountPubkey: lotteryAccount.publicKey.toBase58(),
        isInitialized: !!decodedLotteryState.isInitialized,
        initializerAccountPubkey: new PublicKey(decodedLotteryState.initializerPubkey).toBase58(),
        ticketPrice: new BN(decodedLotteryState.ticketPrice, 10, "le").toNumber(),
        winnerAccountPubkey: new PublicKey(decodedLotteryState.winnerAccountPubkey).toBase58(),
        //entrants :S
    };
}

export const enterLottery = async () => {};
export const receiveLotteryWinnings = async () => {};