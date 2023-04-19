import { ethers } from "ethers";
import {
  UniversalRouter__factory,
  ERC20__factory,
  WETH__factory,
  Permit2__factory,
} from "../types";
import * as Constants from "./constants";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(Constants.RPC_URL);
  const signer = new ethers.Wallet(Constants.PRIVATE_KEY, provider);
  const weth = WETH__factory.connect(Constants.WETH_ADDRESS, signer);
  const usdc = ERC20__factory.connect(Constants.USDC_ADDRESS, signer);
  const permit2 = Permit2__factory.connect(Constants.PERMIT2_ADDRESS, signer);

  // Test user has WETH
  await weth.deposit({ value: Constants.AMOUNT_IN });

  // Test user approves WETH with Permit2
  await weth.approve(Constants.PERMIT2_ADDRESS, ethers.constants.MaxUint256);

  // Test user tells Permit2 to approve the Universal Router to spend WETH
  await permit2.approve(
    Constants.WETH_ADDRESS,
    Constants.UNIVERSAL_ROUTER_ADDRESS,
    Constants.AMOUNT_IN,
    9_999_999_999
  );

  // Universal Router call setup + execution

  const abiCoder = ethers.utils.defaultAbiCoder;

  /// Transfer WETH from test user to the router
  const permit2TransferFromPayload = abiCoder.encode(
    ["address", "address", "uint160"],
    [
      Constants.WETH_ADDRESS,
      Constants.UNIVERSAL_ROUTER_ADDRESS,
      Constants.AMOUNT_IN,
    ]
  );

  /// Pay a percentage of the current router balance to fee recipient
  const payPortionPayload = abiCoder.encode(
    ["address", "address", "uint256"],
    [Constants.WETH_ADDRESS, Constants.FEE_RECIPIENT, Constants.FEE_BIPS]
  );

  /// Swap WETH for USDC
  const swapExactInputPayload = abiCoder.encode(
    ["address", "uint256", "uint256", "bytes", "bool"],
    [
      Constants.UNIVERSAL_ROUTER_ADDRESS,
      Constants.CONTRACT_BALANCE_SPECIAL_VALUE,
      Constants.MINIMUM_OUT,
      ethers.utils.solidityPack(
        ["address", "uint24", "address"],
        [
          Constants.WETH_ADDRESS,
          Constants.UNIV3_WETH_USDC_POOL_FEE,
          Constants.USDC_ADDRESS,
        ]
      ),
      false,
    ]
  );

  /// Sweep all USDC from the router to the test user
  const sweepPayload = abiCoder.encode(
    ["address", "address", "uint256"],
    [Constants.USDC_ADDRESS, signer.address, Constants.MINIMUM_OUT]
  );

  const universalRouter = UniversalRouter__factory.connect(
    Constants.UNIVERSAL_ROUTER_ADDRESS,
    signer
  );

  // Execute the commands
  const tx = await universalRouter["execute(bytes,bytes[])"](
    ethers.utils.arrayify(
      Uint8Array.from([
        Constants.PERMIT2_TRANSFER_FROM_COMMAND,
        Constants.PAY_PORTION_COMMAND,
        Constants.SWAP_EXACT_INPUT_COMMAND,
        Constants.SWEEP_COMMAND,
      ])
    ),
    [
      permit2TransferFromPayload,
      payPortionPayload,
      swapExactInputPayload,
      sweepPayload,
    ]
  );
  await tx.wait();

  console.log(
    "Signer USDC:",
    (await usdc.balanceOf(signer.address)).toString()
  );
  console.log(
    "Fee Recipient WETH:",
    (await weth.balanceOf(Constants.FEE_RECIPIENT)).toString()
  );
}

main();
