import { Account, Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction, LAMPORTS_PER_SOL, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import BN from 'bn.js';
import { LOTTERY_ACCOUNT_DATA_LAYOUT } from './layout';

let connection = new Connection("http://localhost:8899", 'singleGossip');

export const changeEndpoint = (endpoint) => {
    connection = new Connection(endpoint, 'singleGossip');
};

export const getAccountInfo = async (publicKey) => {
    return await connection.getAccountInfo(publicKey, 'singleGossip');
};

export const initLottery = async (
    wallet,
    ticketPrice,
    lotteryProgramIdString) => {
    const initializerAccount = wallet;
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
    tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    tx.feePayer = wallet.publicKey;
    tx.sign(lotteryAccount);
    const signedTransaction = await wallet.signTransaction(tx);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {skipPreflight: false, preflightCommitment: 'singleGossip'});
    console.log(`Tx signature: ${signature}`);

    await connection.confirmTransaction(signature);

    const lotteryAccountInfo = await connection.getAccountInfo(lotteryAccount.publicKey, 'singleGossip');
    return lotteryAccountInfoToLotteryInfo(lotteryAccount.publicKey, lotteryAccountInfo);
}

export const enterLottery = async (
    wallet,
    lotteryAccountPubkeyString,
    lotteryProgramIdString
) => {
    const payerAccountPubkey = wallet.publicKey;
    const lotteryAccountPubkey = new PublicKey(lotteryAccountPubkeyString);
    const lotteryProgramId = new PublicKey(lotteryProgramIdString);

    const enterLotteryIx = new TransactionInstruction({
        programId: lotteryProgramId,
        keys: [
            { pubkey: payerAccountPubkey, isSigner: true, isWritable: false },
            { pubkey: lotteryAccountPubkey, isSigner: false, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
        ],
        data: Buffer.from([1])
    });

    const tx = new Transaction()
        .add(enterLotteryIx);
    tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    tx.feePayer = wallet.publicKey;
    const signedTransaction = await wallet.signTransaction(tx);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {skipPreflight: false, preflightCommitment: 'singleGossip'});
    console.log(`Tx signature: ${signature}`);
    await connection.confirmTransaction(signature);

    const lotteryAccountInfo = await connection.getAccountInfo(lotteryAccountPubkey, 'singleGossip');
    return lotteryAccountInfoToLotteryInfo(lotteryAccountPubkey, lotteryAccountInfo);
};

export const receiveLotteryWinnings = async (
    wallet,
    lotteryAccountPubkeyString,
    lotteryProgramIdString
) => {
    const winnerAccountPublicKey = wallet.publicKey;
    const lotteryAccountPubkey = new PublicKey(lotteryAccountPubkeyString);
    const lotteryProgramId = new PublicKey(lotteryProgramIdString);

    const receiveLotteryIx = new TransactionInstruction({
        programId: lotteryProgramId,
        keys: [
            { pubkey: winnerAccountPublicKey, isSigner: true, isWritable: false },
            { pubkey: lotteryAccountPubkey, isSigner: false, isWritable: true },
        ],
        data: Buffer.from([2])
    });

    const tx = new Transaction()
        .add(receiveLotteryIx);
    tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    tx.feePayer = wallet.publicKey;
    const signedTransaction = await wallet.signTransaction(tx);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {skipPreflight: false, preflightCommitment: 'singleGossip'});
    console.log(`Tx signature: ${signature}`);
    await connection.confirmTransaction(signature);
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

export const getLotteriesForProgramId = async (lotteryProgramIdString) => {
    const lotteryProgramId = new PublicKey(lotteryProgramIdString);
    const programAccounts = await connection.getProgramAccounts(lotteryProgramId, 'singleGossip');
    return programAccounts.map(({pubkey, account}) => lotteryAccountInfoToLotteryInfo(pubkey, account));
};