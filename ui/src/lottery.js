import { Account, Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction, TransactionInstruction, LAMPORTS_PER_SOL } from '@solana/web3.js';
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
        lamports: await connection.getMinimumBalanceForRentExemption(LOTTERY_ACCOUNT_DATA_LAYOUT.span, 'singleGossip') + ticketPrice * LAMPORTS_PER_SOL,
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

    const lotteryAccountInfo = await connection.getAccountInfo(lotteryAccount.publicKey, 'singleGossip');
    return lotteryAccountInfoToLotteryInfo(lotteryAccount.publicKey, lotteryAccountInfo);
}

export const enterLottery = async (
    privateKeyByteArray,
    lotteryAccountPubkeyString,
    lotteryProgramIdString
) => {
    const privateKeyDecoded = privateKeyByteArray.split(',').map(s => parseInt(s));
    const payerAccount = new Account(privateKeyDecoded);
    const lotteryAccountPubkey = new PublicKey(lotteryAccountPubkeyString);
    const lotteryProgramId = new PublicKey(lotteryProgramIdString);

    const enterLotteryIx = new TransactionInstruction({
        programId: lotteryProgramId,
        keys: [
            { pubkey: payerAccount.publicKey, isSigner: true, isWritable: false },
            { pubkey: lotteryAccountPubkey, isSigner: false, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
        ],
        data: Buffer.from([1])
    });

    const tx = new Transaction()
        .add(enterLotteryIx);
    const signature = await connection.sendTransaction(tx, [payerAccount], {skipPreflight: false, preflightCommitment: 'singleGossip'});
    console.log(`Tx signature: ${signature}`);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const lotteryAccountInfo = await connection.getAccountInfo(lotteryAccountPubkey, 'singleGossip');
    return lotteryAccountInfoToLotteryInfo(lotteryAccountPubkey, lotteryAccountInfo);
};

const unitializedPubkey = '11111111111111111111111111111111';

export const lotteryAccountInfoToLotteryInfo = (lotteryAccountPubkey, lotteryAccountInfo) => {
    const decodedLotteryState = LOTTERY_ACCOUNT_DATA_LAYOUT.decode(lotteryAccountInfo.data);
    let winner = new PublicKey(decodedLotteryState.winnerAccountPubkey).toBase58();
    let entrants = decodedLotteryState.entrants
        .map(entrant =>  new PublicKey(entrant).toBase58())
        .filter(entrant => entrant !== unitializedPubkey);

    return {
        lotteryAccountPubkey: lotteryAccountPubkey.toBase58(),
        isInitialized: !!decodedLotteryState.isInitialized,
        initializerAccountPubkey: new PublicKey(decodedLotteryState.initializerPubkey).toBase58(),
        ticketPrice: new BN(decodedLotteryState.ticketPrice, 10, "le").toNumber(),
        winnerAccountPubkey: winner != unitializedPubkey ? winner : null,
        entrants: entrants,
        max_entrant_count: 5
    };
};

export const receiveLotteryWinnings = async () => {};

export const getLotteriesForProgramId = async (lotteryProgramIdString) => {
    const lotteryProgramId = new PublicKey(lotteryProgramIdString);
    const programAccounts = await connection.getProgramAccounts(lotteryProgramId, 'singleGossip');
    return programAccounts.map(({pubkey, account}) => lotteryAccountInfoToLotteryInfo(pubkey, account));
};