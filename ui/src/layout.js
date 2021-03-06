import * as BufferLayout from 'buffer-layout';

const publicKey = (property = "publicKey") => {
    return BufferLayout.blob(32, property);
};

const uint64 = (property = "uint64") => {
    return BufferLayout.blob(8, property);
};
const ENTRANT_COUNT = 5;

export const LOTTERY_ACCOUNT_DATA_LAYOUT = BufferLayout.struct([
    BufferLayout.u8("isInitialized"),
    publicKey("initializerPubkey"),
    uint64("ticketPrice"),
    publicKey("winnerAccountPubkey"),
    BufferLayout.seq(publicKey(), ENTRANT_COUNT, "entrants")
]);