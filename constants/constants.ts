import { FaDollarSign, FaGift } from "react-icons/fa";
import { FaRegChartBar } from "react-icons/fa6";
import { FaBridgeCircleCheck } from "react-icons/fa6";
import { FaUnlockAlt } from "react-icons/fa";
import { GiAmplitude } from "react-icons/gi";
import { GoAlertFill } from "react-icons/go";
import MainnetLogo from "@/public/imgs/mainnet.svg";
import PolygonLogo from "@/public/imgs/polygon.svg";
import OptimismLogo from "@/public/imgs/optimism.svg";
import AvalancheLogo from "@/public/imgs/avalancheLogo.svg";
import ArbitrumLogo from "@/public/imgs/arbitrum.svg";
import GnosisLogo from "@/public/imgs/gnosis.svg";
import BaseLogo from "@/public/imgs/base.svg";
import zkevmLogo from "@/public/imgs/zkevm.svg";
import sepoliaLogo from "@/public/imgs/sepolia.svg";
import fraxtalLogo from "@/public/imgs/fraxtal.svg";
import modeLogo from "@/public/imgs/mode.svg";
import sonicLogo from "@/public/imgs/sonic.svg";
import hyperEVMLogo from "@/public/imgs/hyperevm.svg";
import plasmaLogo from "@/public/imgs/plasma.svg";
import xlayerLogo from "@/public/imgs/xlayer.svg";
import monadLogo from "@/public/imgs/monad.svg";
import { TbSettingsDollar } from "react-icons/tb";
import { GaugeNetworkId, NetworkInfo } from "@/types/types";
import { TokenInfo } from "@/types/interfaces";
import { IoLayers } from "react-icons/io5";
import { IoSwapHorizontal } from "react-icons/io5";


export const VAULT_ADDRESS = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";

export const SPARK_USDS_PSM_WRAPPER_ADDRESS = "0xd0A61F2963622e992e6534bde4D52fd0a89F39E0";

export const tokenDecimals: Record<string, number> = {
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": 6, // mainnet
  "0x2791bca1f2de4661ed88a30c99a7a9449aa84174": 6, // polygon
  "0xaf88d065e77c8cc2239327c5edb3a432268e5831": 6, // arbitrum
  "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83": 6, // gnosis
  "0xa8ce8aee21bc2a48a5ef670afcc9274c7bbbc035": 6, // zkevm
  "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e": 6, // avalanche
  "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": 6, // base
  "0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca": 6, // base USDbC
  "0x0b2c639c533813f4aa9d7837caf62653d097ff85": 6, // OP USDC
};

export const GOVERNANCE_ADDRESS = "0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b";
export const V3_VAULT_ADDRESS = "0xbA1333333333a1BA1108E8412f11850A5C319bA9";
export const PRESET_FEES = [0.1, 0.3, 1.0];

// StakeDAO specific token addresses
export const SDBAL_TOKEN_ADDRESS = "0xF24d8651578a55b0C119B9910759a351A3458895";

// SONIC specific addresses that are not mapped in our address book
export const SONIC_VAULT_EXPLORER = "0x9672Af0b41e97855E9fff995a058C6F46a09d5B3";
export const SONIC_VAULT = "0xbA1333333333a1BA1108E8412f11850A5C319bA9";
export const SONIC_BUFFER_ROUTER = "0x532dA919D3EB5606b5867A6f505969c57F3A721b";
export const SONIC_PERMIT2 = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

// The Graph subgraph URLs for Balancer v3
export const SUBGRAPH_URLS: Record<string, string> = {
  arbitrum: `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/Ad1cgTzScNmiDPSCeGYxgMU3YdRPrQXGkCZgpmPauauk`,
  avalanche: `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/deployments/id/QmSj437ejL2f1pMP2r5E2m5GjhqJa3rmbvFD5kyscmq7u2`,
  base: `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/9b7UBHq8DXxrfGsYhAzF3jZn5mNRgZb5Ag18UL9GJ3cV`,
  mainnet: `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/4rixbLvpuBCwXTJSwyAzQgsLR8KprnyMfyCuXT8Fj5cd`,
  gnosis: `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/DDoABVc9xCRQwuXRq2QLZ6YLkjoFet74vnfncQDgJVo2`,
  optimism: `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/DwreTHTzN3kV6szWr7Ldt6VwnGjtmKTKcYT9aDk37MEs`,
  plasma: `https://api.goldsky.com/api/public/project_cmcigparivg3z01yhbv14ddl8/subgraphs/balancer-v3-plasma/latest/gn`,
};

export const PAYLOAD_OPTIONS = [
  {
    href: "/payload-builder/create-payment",
    key: "create-payment",
    label: "Create DAO Payment Request",
    button_label: "Create Payment",
    description: "Build a token payment payload from a set whitelisted tokens and DAO wallets.",
    icon: FaDollarSign,
    repos: ["balancer/multisig-ops"],
    branchNamePlaceholder: "feature/create-payment",
    prNamePlaceholder: "Create Payment for Service XYZ",
    prTypePath: "BIPs/YYYY-WXX/",
  },
  {
    href: "/payload-builder/add-reward-to-gauge",
    key: "add-reward-to-gauge",
    label: "Add Secondary Reward Tokens to Gauge",
    button_label: "Add Reward Tokens",
    description: "Add a new reward token with a distributor to a staking gauge.",
    icon: FaGift,
    repos: ["balancer/multisig-ops"],
    branchNamePlaceholder: "feature/add-reward-to-gauge",
    prNamePlaceholder: "Add Reward to Gauge XYZ",
    prTypePath: "OmniAutoOps/",
  },
  {
    href: "/payload-builder/set-reward-distributor-to-gauge",
    key: "set-reward-distributor-to-gauge",
    label: "Configure Token Rewards Distributor to a Gauge",
    button_label: "Set Reward Distributor",
    description:
      "Configure a new reward distributor for an existing reward token on a staking gauge.",
    icon: FaGift,
    repos: ["balancer/multisig-ops"],
    branchNamePlaceholder: "feature/set-reward-distributor-to-gauge",
    prNamePlaceholder: "Set Reward Distributor to Gauge XYZ",
    prTypePath: "OmniAutoOps/",
  },
  {
    href: "/payload-builder/cctp-bridge",
    key: "cctp-bridge",
    label: "Bridge USDC via CCTP",
    button_label: "Create Bridge Tx",
    description: "Bridge USDC stable coins between DAO Multisigs with the official CCTP bridge",
    icon: FaBridgeCircleCheck,
    repos: ["balancer/multisig-ops"],
    branchNamePlaceholder: "feature/cctp-bridge-setup",
    prNamePlaceholder: "Set Up CCTP Bridge for Network XYZ",
    prTypePath: "OmniAutoOps/",
  },
  {
    href: "/payload-builder/fee-setter",
    key: "fee-setter",
    label: "Configure Swap Fees on a V2 Pool",
    button_label: "Configure Swap Fees",
    description:
      "Configure the swap fee setting on a pool that have swap fee settings delegated to the DAO.",
    icon: TbSettingsDollar,
    repos: ["balancer/multisig-ops"],
    branchNamePlaceholder: "feature/set-swapfee",
    prNamePlaceholder: "Set Swap Fee on Pool XYZ",
    prTypePath: "OmniAutoOps/",
  },
  {
    href: "/payload-builder/fee-setter-v3",
    key: "fee-setter-v3",
    label: "Configure Swap Fees on a V3 Pool",
    button_label: "Configure Swap Fees on v3",
    description:
      "Configure the swap fee setting on a pool deployed on Balancer v3, both for EOAs and under DAO management",
    icon: TbSettingsDollar,
    repos: ["balancer/multisig-ops"],
    branchNamePlaceholder: "feature/set-swapfee-v3",
    prNamePlaceholder: "Set Swap Fee on Pool XYZ",
    prTypePath: "OmniAutoOps/",
  },
  {
    href: "/payload-builder/protocol-fee-setter-v3",
    key: "protocol-fee-setter-v3",
    label: "Configure Protocol Fees on a V3 Pool",
    button_label: "Configure Protocol Fees",
    description:
      "Configure protocol swap and yield fee settings on a pool deployed on Balancer v3 via the ProtocolFeeController",
    icon: TbSettingsDollar,
    repos: ["balancer/multisig-ops"],
    branchNamePlaceholder: "feature/set-protocol-fee-v3",
    prNamePlaceholder: "Set Protocol Fee on Pool XYZ",
    prTypePath: "OmniAutoOps/",
  },
  {
    href: "/payload-builder/injector-configurator",
    key: "injector-configurator",
    label: "Configure Rewards Injectors",
    button_label: "Configure rewards",
    description: "Configure a rewards injector with a new token emission schedule.",
    icon: TbSettingsDollar,
    repos: ["balancer/multisig-ops"],
    branchNamePlaceholder: "feature/set-injector",
    prNamePlaceholder: "Program rewards injector XYZ",
    prTypePath: "OmniAutoOps/",
  },
  {
    href: "/payload-builder/initialize-buffer",
    key: "initialize-buffer",
    label: "Initialize Liquidity Buffer",
    button_label: "Initialize Buffer",
    description: "Initialize and seed a new liquidity buffer for a wrapped token.",
    icon: FaRegChartBar,
    repos: [],
    branchNamePlaceholder: "",
    prNamePlaceholder: "",
    prTypePath: "",
  },
  {
    href: "/payload-builder/manage-buffer",
    key: "manage-buffer",
    label: "Manage Liquidity Buffer",
    button_label: "Manage Buffer",
    description: "Add and remove liquidity from a liquidity buffer.",
    icon: FaRegChartBar,
    repos: [],
    branchNamePlaceholder: "",
    prNamePlaceholder: "",
    prTypePath: "",
  },
  {
    href: "/payload-builder/permissions",
    key: "permissions",
    label: "Configure Multi-sig Permissions",
    button_label: "Configure Permissions",
    description:
      "Configure what permissions a given multi-sig wallet is granted via the DAO so it can execute permissioned functions within the Balancer protocol",
    icon: FaUnlockAlt,
    repos: ["balancer/multisig-ops"],
    branchNamePlaceholder: "feature/add-permissions",
    prNamePlaceholder: "Add permissions to multi-sig",
    prTypePath: "BIPs/YYYY-WXX/",
  },
  {
    href: "/hooks/stable-surge",
    key: "hook-stable-surge",
    label: "Configure StableSurge hook",
    button_label: "Configure StableSurge",
    description:
      "Configure StableSurge hook on a pool deployed on Balancer v3, both for EOAs and under DAO management",
    icon: TbSettingsDollar,
    repos: ["balancer/multisig-ops"],
    branchNamePlaceholder: "feature/stablesurge-config",
    prNamePlaceholder: "Configure StableSurge on Pool XYZ",
    prTypePath: "OmniAutoOps/",
  },
  {
    href: "/hooks/mev-capture",
    key: "hook-mev-capture",
    label: "Configure MEV Capture hook",
    button_label: "Configure MEV Capture",
    description:
      "Configure MEV Capture hook on a pool deployed on Balancer v3, both for EOAs and under DAO management",
    icon: TbSettingsDollar,
    repos: ["balancer/multisig-ops"],
    branchNamePlaceholder: "feature/mevcapture-config",
    prNamePlaceholder: "Configure MEV Capture on Pool XYZ",
    prTypePath: "OmniAutoOps/",
  },
  {
    href: "/payload-builder/amp-factor-update-v2",
    key: "amp-factor-update-v2",
    label: "Configure Amp Updates on v2 pools",
    button_label: "Configure Amp Update",
    description:
      "Configure Amp factor changes for Stableswap v2 pools that are under DAO management",
    icon: GiAmplitude,
    repos: ["balancer/multisig-ops"],
    branchNamePlaceholder: "feature/amp-factor-update",
    prNamePlaceholder: "Configure Amp Update on Pool XYZ",
    prTypePath: "OmniAutoOps/",
  },
  {
    href: "/payload-builder/amp-factor-update-v3",
    key: "amp-factor-update-v3",
    label: "Configure Amp Updates on v3 pools",
    button_label: "Configure Amp Update",
    description:
      "Configure Amp factor changes for Stableswap v3 pools that are under DAO management",
    icon: GiAmplitude,
    repos: ["balancer/multisig-ops"],
    branchNamePlaceholder: "feature/amp-factor-update",
    prNamePlaceholder: "Configure Amp Update on Pool XYZ",
    prTypePath: "OmniAutoOps/",
  },
  {
    href: "/payload-builder/emergency",
    key: "emergency",
    label: "Emergency Actions",
    description: "Create emergency payloads to pause pools or enable recovery mode",
    button_label: "Create Emergency Payload",
    icon: GoAlertFill,
    repos: ["balancer/multisig-ops"],
    branchNamePlaceholder: "feature/emergency-payload",
    prNamePlaceholder: "Create emergency payload for pool XYZ",
    prTypePath: "MaxiOps/Emergency-Multisigs/",
  },
  {
    href: "/payload-builder/composer",
    key: "payload-composer",
    label: "Payload Composer",
    button_label: "",
    description: "",
    icon: IoLayers,
    repos: ["balancer/multisig-ops"],
    branchNamePlaceholder: "feature/combined-operations",
    prNamePlaceholder: "Combined Operations",
    prTypePath: "OmniAutoOps/",
  },
  {
    href: "/payload-builder/autorange",
    key: "reclamm",
    label: "Configure AutoRange pool parameters",
    description: "Create AutoRange specific payloads to configure AutoRange parameters of v3 pools",
    button_label: "Configure AutoRange",
    icon: FaRegChartBar,
    repos: ["balancer/multisig-ops"],
    branchNamePlaceholder: "feature/autorange-config",
    prNamePlaceholder: "Configure AutoRange parameters for pool XYZ",
    prTypePath: "OmniAutoOps/",
  },
  {
    href: "/payload-builder/spark-psm",
    key: "spark-psm",
    label: "Swap USDC/sUSDS via Spark PSM",
    description: "Deposit USDC to receive sUSDS or withdraw sUSDS to USDC via Spark PSM on Ethereum",
    button_label: "Use Spark PSM",
    icon: IoSwapHorizontal,
    repos: ["balancer/multisig-ops"],
    branchNamePlaceholder: "feature/spark-psm",
    prNamePlaceholder: "Spark PSM USDC/sUSDS Swap",
    prTypePath: "OmniAutoOps/",
  },
];

export const NETWORK_OPTIONS = [
  {
    label: "Ethereum",
    apiID: "MAINNET",
    chainId: "1",
    maxiSafe: "0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e",
    omniSig: "0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e",
    entrypoint: "0xf5dECDB1f3d1ee384908Fbe16D2F0348AE43a9eA",
  },
  {
    label: "Arbitrum",
    apiID: "ARBITRUM",
    chainId: "42161",
    maxiSafe: "0xc38c5f97B34E175FFd35407fc91a937300E33860",
    omniSig: "0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e",
    entrypoint: "0x97207B095e4D5C9a6e4cfbfcd2C3358E03B90c4A",
  },
  {
    label: "Polygon",
    apiID: "POLYGON",
    chainId: "137",
    maxiSafe: "0xc38c5f97B34E175FFd35407fc91a937300E33860",
    omniSig: "0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e",
    entrypoint: "0xAB093cd16e765b5B23D34030aaFaF026558e0A19",
  },
  {
    label: "Polygon ZKEVM",
    apiID: "ZKEVM",
    chainId: "1101",
    maxiSafe: "0xB59Ab49CA8d064E645Bf2c546d9FE6d1d4147a09",
    omniSig: "0xB59Ab49CA8d064E645Bf2c546d9FE6d1d4147a09", //Overwrite from LM!
    entrypoint: "0xb9aD3466cdd42015cc05d4804DC68D562b6a2065",
  },
  {
    label: "Optimism",
    apiID: "OPTIMISM",
    chainId: "10",
    maxiSafe: "0x09Df1626110803C7b3b07085Ef1E053494155089",
    omniSig: "0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e",
    entrypoint: "0xed86ff0c507D3AF5F35d3523B77C17415FCfFaCb",
  },
  {
    label: "Avalanche",
    apiID: "AVALANCHE",
    chainId: "43114",
    maxiSafe: "0x326A7778DB9B741Cb2acA0DE07b9402C7685dAc6",
    omniSig: "0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e",
    entrypoint: "0x4E7bBd911cf1EFa442BC1b2e9Ea01ffE785412EC",
  },
  {
    label: "Base",
    apiID: "BASE",
    chainId: "8453",
    maxiSafe: "0x65226673F3D202E0f897C862590d7e1A992B2048",
    omniSig: "0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e",
    entrypoint: "0x9129E834e15eA19b6069e8f08a8EcFc13686B8dC",
  },
  {
    label: "Gnosis",
    apiID: "GNOSIS",
    chainId: "100",
    maxiSafe: "0x14969B55a675d13a1700F71A37511bc22D90155a",
    omniSig: "0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e",
    entrypoint: "0x8F42aDBbA1B16EaAE3BB5754915E0D06059aDd75",
  },
  {
    label: "Fraxtal",
    apiID: "FRAXTAL",
    chainId: "252",
    maxiSafe: "0x7BBAc709a9535464690A435ca7361256496f13Ce",
    omniSig: "0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e",
    entrypoint: "0xb9F8AB3ED3F3aCBa64Bc6cd2DcA74B7F38fD7B88",
  },
  {
    label: "Mode",
    apiID: "MODE",
    chainId: "34443",
    maxiSafe: "",
    omniSig: "0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e",
    entrypoint: "",
  },
  {
    label: "Sonic",
    apiID: "SONIC",
    chainId: "146",
    maxiSafe: "0x97079F7E04B535FE7cD3f972Ce558412dFb33946",
    omniSig: "0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e",
    entrypoint: "",
  },
  {
    label: "HyperEVM",
    apiID: "HYPEREVM",
    chainId: "999",
    maxiSafe: "0x97079F7E04B535FE7cD3f972Ce558412dFb33946",
    omniSig: "0x97079F7E04B535FE7cD3f972Ce558412dFb33946",
    entrypoint: "",
  },
  {
    label: "Plasma",
    apiID: "PLASMA",
    chainId: "9745",
    maxiSafe: "0x97079F7E04B535FE7cD3f972Ce558412dFb33946",
    omniSig: "0x97079F7E04B535FE7cD3f972Ce558412dFb33946",
    entrypoint: "",
  },
  {
    label: "Monad",
    apiID: "MONAD",
    chainId: "143",
    maxiSafe: "0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e",
    omniSig: "0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e",
    entrypoint: "0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5",
  },
  {
    label: "X Layer",
    apiID: "XLAYER",
    chainId: "196",
    maxiSafe: "0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e",
    omniSig: "0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e",
    entrypoint: "0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5",
  },
];

export const networks: Record<string, NetworkInfo> = {
  mainnet: {
    logo: MainnetLogo.src,
    rpc: "https://lb.drpc.live/ethereum/",
    explorer: "https://etherscan.io/",
    chainId: "1",
  },
  polygon: {
    logo: PolygonLogo.src,
    rpc: "https://lb.drpc.live/polygon/",
    explorer: "https://polygonscan.com/",
    chainId: "137",
  },
  optimism: {
    logo: OptimismLogo.src,
    rpc: "https://lb.drpc.live/optimism/",
    explorer: "https://optimistic.etherscan.io/",
    chainId: "10",
  },
  avalanche: {
    logo: AvalancheLogo.src,
    rpc: "https://lb.drpc.live/avalanche/",
    explorer: "https://snowscan.xyz/",
    chainId: "43114",
  },
  arbitrum: {
    logo: ArbitrumLogo.src,
    rpc: "https://lb.drpc.live/arbitrum/",
    explorer: "https://arbiscan.io/",
    chainId: "42161",
  },
  gnosis: {
    logo: GnosisLogo.src,
    rpc: "https://lb.drpc.live/gnosis/",
    explorer: "https://gnosisscan.io/",
    chainId: "100",
  },
  base: {
    logo: BaseLogo.src,
    rpc: "https://lb.drpc.live/base/",
    explorer: "https://basescan.org/",
    chainId: "8453",
  },
  zkevm: {
    logo: zkevmLogo.src,
    rpc: "https://lb.drpc.live/polygon-zkevm/",
    explorer: "https://www.oklink.com/polygon-zkevm/",
    chainId: "1101",
  },
  avalanche_c: {
    logo: AvalancheLogo.src,
    rpc: "https://lb.drpc.live/avalanche/",
    explorer: "https://snowscan.xyz/",
    chainId: "43114",
  },
  ethereum: {
    logo: MainnetLogo.src,
    rpc: "https://lb.drpc.live/ethereum/",
    explorer: "https://etherscan.io/",
    chainId: "1",
  },
  sepolia: {
    logo: sepoliaLogo.src,
    rpc: "https://lb.drpc.live/sepolia/",
    explorer: "https://sepolia.etherscan.io/",
    chainId: "11155111",
  },
  fraxtal: {
    logo: fraxtalLogo.src,
    rpc: "https://lb.drpc.live/fraxtal/",
    explorer: "https://fraxscan.com",
    chainId: "252",
  },
  mode: {
    logo: modeLogo.src,
    rpc: "https://lb.drpc.live/mode/",
    explorer: "https://explorer.mode.network/",
    chainId: "34443",
  },
  sonic: {
    logo: sonicLogo.src,
    rpc: "https://lb.drpc.live/sonic/",
    explorer: "https://sonicscan.org/",
    chainId: "146",
  },
  hyperevm: {
    logo: hyperEVMLogo.src,
    rpc: "https://lb.drpc.live/hyperliquid/",
    explorer: "https://hyperevmscan.io/",
    chainId: "999",
  },
  plasma: {
    logo: plasmaLogo.src,
    rpc: "https://lb.drpc.live/plasma/",
    explorer: "https://plasmascan.to/",
    chainId: "9745",
  },
  monad: {
    logo: monadLogo.src,
    rpc: "https://lb.drpc.live/monad-mainnet/",
    explorer: "https://monadscan.com/",
    chainId: "143",
  },
  xlayer: {
    logo: xlayerLogo.src,
    rpc: "https://lb.drpc.live/xlayer/",
    explorer: "https://www.okx.com/web3/explorer/xlayer/",
    chainId: "196",
  },
};

// Injector blacklist - addresses to exclude from injector listings per network
export const INJECTOR_BLACKLIST: Record<string, string[]> = {
  avalanche: [
    "0xfa7b21B30325DBbd4A71ee2B2EDE74A7d8A2c0E4", // Blacklisted injector address
  ],
  mainnet: [
    "0xF7d32a6D1FFA5DEe909728fF2fEFf4C31C85b052", // test injector with bad config
  ],
  // Add more networks and addresses as needed
};

export const WHITELISTED_PAYMENT_TOKENS: { [network: string]: TokenInfo[] } = {
  mainnet: [
    {
      symbol: "USDC",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
    },
    {
      symbol: "BAL",
      address: "0xba100000625a3754423978a60c9317c58a424e3D",
      decimals: 18,
    },
    {
      symbol: "WETH",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      decimals: 18,
    },
    {
      symbol: "sUSDS",
      address: "0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD",
      decimals: 18,
    },
  ],
  arbitrum: [
    {
      symbol: "USDC",
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      decimals: 6,
    },
    {
      symbol: "BAL",
      address: "0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8",
      decimals: 18,
    },
    {
      symbol: "ARB",
      address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
      decimals: 18,
    },
    // Add more Goerli tokens as needed
  ],
  avalanche: [
    {
      symbol: "USDC",
      address: "0x099D7767eC64Ac33C076f1e3Eb3DC24D08FA86A5",
      decimals: 6,
    },
    {
      symbol: "BAL",
      address: "0xe15bcb9e0ea69e6ab9fa080c4c4a5632896298c3",
      decimals: 18,
    },
    {
      symbol: "WAVAX",
      address: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
      decimals: 18,
    },
    // Add more Goerli tokens as needed
  ],
  polygon: [
    {
      symbol: "USDC",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      decimals: 6,
    },
    {
      symbol: "BAL",
      address: "0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3",
      decimals: 18,
    },
    {
      symbol: "WMATIC",
      address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      decimals: 18,
    },
    // Add more Goerli tokens as needed
  ],
};

// Constants for V2 Pool Creator
export const FactoryAddressWeighted = {
  MAINNET: "0x897888115Ada5773E02aA29F775430BFB5F34c51",
  POLYGON: "0xFc8a407Bba312ac761D8BFe04CE1201904842B76",
  ARBITRUM: "0xc7E5ED1054A24Ef31D827E6F86caA58B3Bc168d7",
  GNOSIS: "0x6CaD2ea22BFA7F4C14Aae92E47F510Cd5C509bc7",
  ZKEVM: "0x03F3Fb107e74F2EAC9358862E91ad3c692712054",
  AVALANCHE: "0x230a59F4d9ADc147480f03B0D3fFfeCd56c3289a",
  BASE: "0x4C32a8a8fDa4E24139B51b456B42290f51d6A1c4",
  OPTIMISM: "0x230a59F4d9ADc147480f03B0D3fFfeCd56c3289a",
  FRAXTAL: "0x9dA18982a33FD0c7051B19F0d7C76F2d5E7e017c",
  MODE: "0xc3ccacE87f6d3A81724075ADcb5ddd85a8A1bB68",
  SEPOLIA: "0x7920BFa1b2041911b354747CA7A6cDD2dfC50Cfd",
  HYPEREVM: "", // placeholder, V2 is not deployed on HyperEVM
  PLASMA: "", // placeholder, needs deployment address
  MONAD: "", // placeholder, needs deployment address
  XLAYER: "", // placeholder, needs deployment address
};
export const FactoryAddressComposable = {
  MAINNET: "0x5B42eC6D40f7B7965BE5308c70e2603c0281C1E9",
  POLYGON: "0xEAedc32a51c510d35ebC11088fD5fF2b47aACF2E",
  ARBITRUM: "0x4bdCc2fb18AEb9e2d281b0278D946445070EAda7",
  GNOSIS: "0x47B489bf5836f83ABD928C316F8e39bC0587B020",
  ZKEVM: "0xf23b4DB826DbA14c0e857029dfF076b1c0264843",
  AVALANCHE: "0xb9F8AB3ED3F3aCBa64Bc6cd2DcA74B7F38fD7B88",
  BASE: "0x956CCab09898C0AF2aCa5e6C229c3aD4E93d9288",
  OPTIMISM: "0x4bdCc2fb18AEb9e2d281b0278D946445070EAda7",
  FRAXTAL: "0x4bdCc2fb18AEb9e2d281b0278D946445070EAda7",
  MODE: "0x5DbAd78818D4c8958EfF2d5b95b28385A22113Cd",
  SEPOLIA: "0x05503B3aDE04aCA81c8D6F88eCB73Ba156982D2B",
  HYPEREVM: "", // placeholder, V2 is not deployed on HyperEVM
  PLASMA: "", // placeholder, needs deployment address
  MONAD: "", // placeholder, needs deployment address
  XLAYER: "", // placeholder, needs deployment address
};

// Gauge Factory
export const MAINNET_GAUGE_FACTORY = "0xf1665E19bc105BE4EDD3739F88315cC699cc5b65";

// Commonly used veBAL gauge caps
export const GAUGE_WEIGHT_CAPS = {
  TWO_PERCENT: "20000000000000000", // 2% cap
  FIVE_PERCENT: "50000000000000000", // 5% cap
  TEN_PERCENT: "100000000000000000", // 10% cap
  UNCAPPED: "1000000000000000000", // No cap
} as const;

// Mapping of network IDs to display names
export const GAUGE_NETWORK_MAP: Record<GaugeNetworkId, string> = {
  mainnet: "Ethereum",
  arbitrum: "Arbitrum",
  polygon: "Polygon",
  zkevm: "Polygon ZKEVM",
  optimism: "Optimism",
  avalanche: "Avalanche",
  base: "Base",
  gnosis: "Gnosis",
  fraxtal: "Fraxtal",
  mode: "Mode",
  plasma: "Plasma",
};

// Validation params for payload builders
export const STABLE_SURGE_PARAMS = {
  MAX_SURGE_FEE: {
    MIN: 0,
    MAX: 100,
  },
  SURGE_THRESHOLD: {
    MIN: 0,
    MAX: 100,
  },
};

export const MEV_CAPTURE_PARAMS = {
  THRESHOLD: {
    MIN: 0.001,
    MAX: 1.0,
  },
  MULTIPLIER: {
    MIN: 2,
    MAX: 1000,
  },
};

export const SWAP_FEE_PARAMS = {
  // For Weighted and Stable pools
  STANDARD: {
    MIN: 0.0001, // 0.0001%
    MAX: 10, // 10%
  },
  // For all other pool types
  OTHER: {
    MIN: 0, // 0%
    MAX: 100, // 100%
  },
};
