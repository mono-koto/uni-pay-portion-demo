// Assume we're using a forked network (e.g. anvil --fork-url ... )
export const RPC_URL = "http://localhost:8545";

// We'll use hardhat test wallet 0
export const PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// Addresses we'll need
export const UNIVERSAL_ROUTER_ADDRESS =
  "0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B";
export const PERMIT2_ADDRESS = "0x000000000022d473030f116ddee9f6b43ac78ba3";
export const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
export const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // USDC

// We'll need to the pool fee for our path. This is 0.05%.
export const UNIV3_WETH_USDC_POOL_FEE = BigInt(500);

// Let's say we're swapping 1 WETH for USDC
export const AMOUNT_IN = BigInt(1e18);

// Let's take 1% of every transaction before swap and send it to an address
export const FEE_BIPS = BigInt(123); // 1.23%
export const FEE_RECIPIENT = "0x8A37ab849Dd795c0CA1979b7fcA24F90Be95d618";

// See https://github.com/Uniswap/universal-router/blob/main/contracts/libraries/Commands.sol
export const SWAP_EXACT_INPUT_COMMAND = 0x00;
export const PERMIT2_TRANSFER_FROM_COMMAND = 0x02;
export const SWEEP_COMMAND = 0x04;
export const PAY_PORTION_COMMAND = 0x06;

// This is a special value that tells the router to use the contract's total balance
// of a given token.
// https://github.com/Uniswap/universal-router/blob/1cde151b29f101cb06c0db4a2afededa864307b3/contracts/libraries/Constants.sol#L9-L11
export const CONTRACT_BALANCE_SPECIAL_VALUE =
  BigInt(0x8000000000000000000000000000000000000000000000000000000000000000);

// For a real use case this should be an accurate minimum
// You can get this from Uniswap's quoter, a TWAP, another oracle, etc.
export const MINIMUM_OUT = 0;
