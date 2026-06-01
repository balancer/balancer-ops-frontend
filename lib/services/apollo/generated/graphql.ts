/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AmountHumanReadable: { input: string; output: string; }
  BigDecimal: { input: string; output: string; }
  BigInt: { input: string; output: string; }
  Bytes: { input: string; output: string; }
  Date: { input: any; output: any; }
  GqlBigNumber: { input: string; output: string; }
  JSON: { input: any; output: any; }
};

export type CreateLbpInput = {
  metadata: LbpMetadataInput;
  poolContract: LbPoolInput;
};

/** The review data for the ERC4626 token */
export type Erc4626ReviewData = {
  __typename: 'Erc4626ReviewData';
  /** If it is an ERC4626 token, this defines whether we can use wrap/unwrap through the buffer in swap paths for this token. */
  canUseBufferForSwaps?: Maybe<Scalars['Boolean']['output']>;
  /** The filename of the review of the ERC4626 */
  reviewFile: Scalars['String']['output'];
  /** A summary of the ERC4626 review, usually just says safe or unsafe */
  summary: Scalars['String']['output'];
  /** If it is an ERC4626 token, this defines whether we allow underlying tokens to be used for add/remove operations. */
  useUnderlyingForAddRemove?: Maybe<Scalars['Boolean']['output']>;
  /** If it is an ERC4626 token, this defines whether we allow the wrapped tokens to be used for add/remove operations. */
  useWrappedForAddRemove?: Maybe<Scalars['Boolean']['output']>;
  /** Warnings associated with the ERC4626 */
  warnings: Array<Scalars['String']['output']>;
};

/** ExitFee hook specific params. Percentage format is 0.01 -> 0.01%. */
export type ExitFeeHookParams = {
  __typename: 'ExitFeeHookParams';
  exitFeePercentage?: Maybe<Scalars['String']['output']>;
};

/** FeeTaking hook specific params. Percentage format is 0.01 -> 0.01% */
export type FeeTakingHookParams = {
  __typename: 'FeeTakingHookParams';
  addLiquidityFeePercentage?: Maybe<Scalars['String']['output']>;
  removeLiquidityFeePercentage?: Maybe<Scalars['String']['output']>;
  swapFeePercentage?: Maybe<Scalars['String']['output']>;
};

export type GqlAggregatorPoolFilter = {
  chainIn?: InputMaybe<Array<GqlChain>>;
  idIn?: InputMaybe<Array<Scalars['String']['input']>>;
  includeHooks?: InputMaybe<Array<GqlHookType>>;
  minTvl?: InputMaybe<Scalars['Float']['input']>;
  poolTypeIn?: InputMaybe<Array<GqlPoolType>>;
  protocolVersionIn?: InputMaybe<Array<Scalars['Int']['input']>>;
  tokensIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum GqlChain {
  Arbitrum = 'ARBITRUM',
  Avalanche = 'AVALANCHE',
  Base = 'BASE',
  Fantom = 'FANTOM',
  Fraxtal = 'FRAXTAL',
  Gnosis = 'GNOSIS',
  Hyperevm = 'HYPEREVM',
  Mainnet = 'MAINNET',
  Mode = 'MODE',
  Monad = 'MONAD',
  Optimism = 'OPTIMISM',
  Plasma = 'PLASMA',
  Polygon = 'POLYGON',
  Sepolia = 'SEPOLIA',
  Sonic = 'SONIC',
  Xlayer = 'XLAYER',
  Zkevm = 'ZKEVM'
}

export type GqlHistoricalTokenPrice = {
  __typename: 'GqlHistoricalTokenPrice';
  address: Scalars['String']['output'];
  chain: GqlChain;
  prices: Array<GqlHistoricalTokenPriceEntry>;
};

export type GqlHistoricalTokenPriceEntry = {
  __typename: 'GqlHistoricalTokenPriceEntry';
  price: Scalars['Float']['output'];
  timestamp: Scalars['String']['output'];
  updatedAt: Scalars['Int']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

/** Hook data */
export type GqlHook = {
  __typename: 'GqlHook';
  address: Scalars['String']['output'];
  config?: Maybe<HookConfig>;
  /** @deprecated No longer supported */
  dynamicData?: Maybe<GqlHookData>;
  /** @deprecated No longer supported */
  enableHookAdjustedAmounts: Scalars['Boolean']['output'];
  /** @deprecated unused */
  name: Scalars['String']['output'];
  /** Hook type specific params */
  params?: Maybe<HookParams>;
  /** The review for this hook if applicable. */
  reviewData?: Maybe<GqlHookReviewData>;
  /** @deprecated No longer supported */
  shouldCallAfterAddLiquidity: Scalars['Boolean']['output'];
  /** @deprecated No longer supported */
  shouldCallAfterInitialize: Scalars['Boolean']['output'];
  /** @deprecated No longer supported */
  shouldCallAfterRemoveLiquidity: Scalars['Boolean']['output'];
  /** @deprecated No longer supported */
  shouldCallAfterSwap: Scalars['Boolean']['output'];
  /** @deprecated No longer supported */
  shouldCallBeforeAddLiquidity: Scalars['Boolean']['output'];
  /** @deprecated No longer supported */
  shouldCallBeforeInitialize: Scalars['Boolean']['output'];
  /** @deprecated No longer supported */
  shouldCallBeforeRemoveLiquidity: Scalars['Boolean']['output'];
  /** @deprecated No longer supported */
  shouldCallBeforeSwap: Scalars['Boolean']['output'];
  /** @deprecated No longer supported */
  shouldCallComputeDynamicSwapFee: Scalars['Boolean']['output'];
  type: GqlHookType;
};

export type GqlHookData = {
  __typename: 'GqlHookData';
  addLiquidityFeePercentage?: Maybe<Scalars['String']['output']>;
  maxSurgeFeePercentage?: Maybe<Scalars['String']['output']>;
  removeLiquidityFeePercentage?: Maybe<Scalars['String']['output']>;
  surgeThresholdPercentage?: Maybe<Scalars['String']['output']>;
  swapFeePercentage?: Maybe<Scalars['String']['output']>;
};

/** Represents the review data for the hook */
export type GqlHookReviewData = {
  __typename: 'GqlHookReviewData';
  /** The filename of the review of the hook */
  reviewFile: Scalars['String']['output'];
  /** A summary of the hook review, usually just says safe or unsafe */
  summary: Scalars['String']['output'];
  /** Warnings associated with the hook */
  warnings: Array<Scalars['String']['output']>;
};

export enum GqlHookType {
  Akron = 'AKRON',
  DirectionalFee = 'DIRECTIONAL_FEE',
  ExitFee = 'EXIT_FEE',
  FeeTaking = 'FEE_TAKING',
  FixedLbp = 'FIXED_LBP',
  Lbp = 'LBP',
  Lottery = 'LOTTERY',
  MevTax = 'MEV_TAX',
  NftliquidityPosition = 'NFTLIQUIDITY_POSITION',
  Reclamm = 'RECLAMM',
  StableSurge = 'STABLE_SURGE',
  Unknown = 'UNKNOWN',
  VebalDiscount = 'VEBAL_DISCOUNT'
}

export type GqlLbpTopTrade = {
  __typename: 'GqlLBPTopTrade';
  address: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type GqlLoopsData = {
  __typename: 'GqlLoopsData';
  /** Actual TotalSupply of LoopS. */
  actualSupply: Scalars['String']['output'];
  /** The total APR for LoopS */
  apr: Scalars['Float']['output'];
  /** The amount of stS provided to Aave. */
  collateralAmount: Scalars['String']['output'];
  /** The amount of stS provided to Aave in S. */
  collateralAmountInEth: Scalars['String']['output'];
  /** The total S debt amount of the position */
  debtAmount: Scalars['String']['output'];
  /** The health factor of the Aave position */
  healthFactor: Scalars['String']['output'];
  /** The amount of leverage the current position has. */
  leverage: Scalars['Float']['output'];
  /** Net Asset Value. The amount of collateral minus the amount of debt. */
  nav: Scalars['String']['output'];
  /** The current rate of LoopS against S. */
  rate: Scalars['String']['output'];
  /** The current amount of stS supplied to the Aave market */
  stSAaveMarketSupply: Scalars['String']['output'];
  /** The current cap on the stS market on Aave */
  stSAaveMarketSupplyCap: Scalars['String']['output'];
  /** Net Asset Value in USD. */
  tvl: Scalars['String']['output'];
};

/** All info on the nested pool if the token is a BPT. It will only support 1 level of nesting. */
export type GqlNestedPool = {
  __typename: 'GqlNestedPool';
  /** Address of the pool. */
  address: Scalars['Bytes']['output'];
  /** Price rate of this pool or the Balancer Pool Token (BPT). */
  bptPriceRate: Scalars['BigDecimal']['output'];
  /** Timestamp of when the pool was created. */
  createTime: Scalars['Int']['output'];
  /** Address of the factory contract that created the pool, if applicable. */
  factory?: Maybe<Scalars['Bytes']['output']>;
  /** Hook assigned to a pool */
  hook?: Maybe<GqlHook>;
  /** Unique identifier of the pool. */
  id: Scalars['ID']['output'];
  /** Liquidity management settings for v3 pools. */
  liquidityManagement?: Maybe<LiquidityManagement>;
  /** Name of the pool. */
  name: Scalars['String']['output'];
  /** Total liquidity of the parent pool in the nested pool in USD. */
  nestedLiquidity: Scalars['BigDecimal']['output'];
  /** Percentage of the parents pool shares inside the nested pool. */
  nestedPercentage: Scalars['BigDecimal']['output'];
  /** Number of shares of the parent pool in the nested pool. */
  nestedShares: Scalars['BigDecimal']['output'];
  /**
   * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
   * @deprecated Use swapFeeManager instead
   */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
  pauseManager?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to set the pool creator fee percentage */
  poolCreator?: Maybe<Scalars['Bytes']['output']>;
  /** Fee charged for swapping tokens in the pool as %. 0.01 -> 0.01% */
  swapFee: Scalars['BigDecimal']['output'];
  /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
  swapFeeManager?: Maybe<Scalars['Bytes']['output']>;
  /** Symbol of the pool. */
  symbol: Scalars['String']['output'];
  /** List of all tokens in the pool. */
  tokens: Array<GqlPoolTokenDetail>;
  /** Total liquidity in the pool in USD. */
  totalLiquidity: Scalars['BigDecimal']['output'];
  /** Total number of shares in the pool. */
  totalShares: Scalars['BigDecimal']['output'];
  /** Type of the pool. */
  type: GqlPoolType;
  /** Version of the pool. */
  version: Scalars['Int']['output'];
};

/** Represents an event that occurs when liquidity is added or removed from a pool. */
export type GqlPoolAddRemoveEventV3 = GqlPoolEvent & {
  __typename: 'GqlPoolAddRemoveEventV3';
  /** The block number of the event. */
  blockNumber: Scalars['Int']['output'];
  /** The block timestamp of the event. */
  blockTimestamp: Scalars['Int']['output'];
  /** The chain on which the event occurred. */
  chain: GqlChain;
  /** The unique identifier of the event. */
  id: Scalars['ID']['output'];
  /** The log index of the event. */
  logIndex: Scalars['Int']['output'];
  /** The pool ID associated with the event. */
  poolId: Scalars['String']['output'];
  /** The sender of the event. */
  sender: Scalars['String']['output'];
  /** The timestamp of the event. */
  timestamp: Scalars['Int']['output'];
  /** The tokens involved in the event. Ordered by poolToken index. */
  tokens: Array<GqlPoolEventAmount>;
  /** The transaction hash of the event. */
  tx: Scalars['String']['output'];
  /** The type of the event. */
  type: GqlPoolEventType;
  /** The user address associated with the event. */
  userAddress: Scalars['String']['output'];
  /** The value of the event in USD. */
  valueUSD: Scalars['Float']['output'];
};

export type GqlPoolAggregator = {
  __typename: 'GqlPoolAggregator';
  /** The contract address of the pool. */
  address: Scalars['Bytes']['output'];
  /** Data specific to gyro/fx pools */
  alpha?: Maybe<Scalars['String']['output']>;
  /** Data specific to stable pools */
  amp?: Maybe<Scalars['BigInt']['output']>;
  /** Data specific to gyro/fx pools */
  beta?: Maybe<Scalars['String']['output']>;
  /** Data specific to gyro pools */
  c?: Maybe<Scalars['String']['output']>;
  /** ReClamm: The centeredness margin of the pool */
  centerednessMargin?: Maybe<Scalars['BigDecimal']['output']>;
  /** The chain on which the pool is deployed */
  chain: GqlChain;
  /** The timestamp the pool was created. */
  createTime: Scalars['Int']['output'];
  /** ReClamm: The current fourth root price ratio, an interpolation of the price ratio state */
  currentFourthRootPriceRatio?: Maybe<Scalars['BigDecimal']['output']>;
  /** Data specific to gyro pools */
  dSq?: Maybe<Scalars['String']['output']>;
  /** ReClamm: Represents how fast the pool can move the virtual balances per day */
  dailyPriceShiftBase?: Maybe<Scalars['BigDecimal']['output']>;
  /** The decimals of the BPT, usually 18 */
  decimals: Scalars['Int']['output'];
  /** Data specific to fx pools */
  delta?: Maybe<Scalars['String']['output']>;
  /** Dynamic data such as token balances, swap fees or volume */
  dynamicData: GqlPoolDynamicData;
  /** ReClamm: The fourth root price ratio at the end of an update */
  endFourthRootPriceRatio?: Maybe<Scalars['BigDecimal']['output']>;
  /** Data specific to fx pools */
  epsilon?: Maybe<Scalars['String']['output']>;
  /** The factory contract address from which the pool was created. */
  factory?: Maybe<Scalars['Bytes']['output']>;
  /** Hook assigned to a pool */
  hook?: Maybe<GqlHook>;
  /** The pool id. This is equal to the address for protocolVersion 3 pools */
  id: Scalars['ID']['output'];
  /** Data specific to gyro/fx pools */
  lambda?: Maybe<Scalars['String']['output']>;
  /** The timestamp of the last user interaction */
  lastTimestamp?: Maybe<Scalars['Int']['output']>;
  /** ReClamm: The last virtual balances of the pool */
  lastVirtualBalances?: Maybe<Array<Scalars['BigDecimal']['output']>>;
  /** Liquidity management settings for v3 pools. */
  liquidityManagement?: Maybe<LiquidityManagement>;
  /** The name of the pool as per contract */
  name: Scalars['String']['output'];
  /**
   * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
   * @deprecated Use swapFeeManager instead
   */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
  pauseManager?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to set the pool creator fee percentage */
  poolCreator?: Maybe<Scalars['Bytes']['output']>;
  /** Returns all pool tokens, including BPTs and nested pools if there are any. Only one nested level deep. */
  poolTokens: Array<GqlPoolTokenDetail>;
  /** ReClamm: The timestamp when the update ends */
  priceRatioUpdateEndTime?: Maybe<Scalars['Int']['output']>;
  /** ReClamm: The timestamp when the update begins */
  priceRatioUpdateStartTime?: Maybe<Scalars['Int']['output']>;
  /** The protocol version on which the pool is deployed, 1, 2 or 3 */
  protocolVersion: Scalars['Int']['output'];
  /** QuantAmmWeighted specific fields */
  quantAmmWeightedParams?: Maybe<QuantAmmWeightedParams>;
  /** Data specific to gyro pools */
  root3Alpha?: Maybe<Scalars['String']['output']>;
  /** Data specific to gyro pools */
  s?: Maybe<Scalars['String']['output']>;
  /** Data specific to gyro pools */
  sqrtAlpha?: Maybe<Scalars['String']['output']>;
  /** Data specific to gyro pools */
  sqrtBeta?: Maybe<Scalars['String']['output']>;
  /** ReClamm: The fourth root price ratio at the start of an update */
  startFourthRootPriceRatio?: Maybe<Scalars['BigDecimal']['output']>;
  /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
  swapFeeManager?: Maybe<Scalars['Bytes']['output']>;
  /** The token symbol of the pool as per contract */
  symbol: Scalars['String']['output'];
  /** Data specific to gyro pools */
  tauAlphaX?: Maybe<Scalars['String']['output']>;
  /** Data specific to gyro pools */
  tauAlphaY?: Maybe<Scalars['String']['output']>;
  /** Data specific to gyro pools */
  tauBetaX?: Maybe<Scalars['String']['output']>;
  /** Data specific to gyro pools */
  tauBetaY?: Maybe<Scalars['String']['output']>;
  /** The pool type, such as weighted, stable, etc. */
  type: GqlPoolType;
  /** Data specific to gyro pools */
  u?: Maybe<Scalars['String']['output']>;
  /** Data specific to gyro pools */
  v?: Maybe<Scalars['String']['output']>;
  /** The version of the pool type. */
  version: Scalars['Int']['output'];
  /** Data specific to gyro pools */
  w?: Maybe<Scalars['String']['output']>;
  /** Data specific to gyro pools */
  z?: Maybe<Scalars['String']['output']>;
};

/** All APRs for a pool */
export type GqlPoolAprItem = {
  __typename: 'GqlPoolAprItem';
  /** The APR value in % -> 0.2 = 20% */
  apr: Scalars['Float']['output'];
  /** The id of the APR item */
  id: Scalars['ID']['output'];
  /** The reward token address, if the APR originates from token emissions */
  rewardTokenAddress?: Maybe<Scalars['String']['output']>;
  /** The reward token symbol, if the APR originates from token emissions */
  rewardTokenSymbol?: Maybe<Scalars['String']['output']>;
  /**
   * The title of the APR item, a human readable form
   * @deprecated No replacement, should be built client side
   */
  title: Scalars['String']['output'];
  /** Specific type of this APR */
  type: GqlPoolAprItemType;
};

/** Enum representing the different types of the APR in a pool. */
export enum GqlPoolAprItemType {
  /** APR that pools earns when BPT is staked on AURA. */
  Aura = 'AURA',
  /** Dynamic swap fee APR based on data from the last 24h */
  DynamicSwapFee_24H = 'DYNAMIC_SWAP_FEE_24H',
  /** Rewards distributed by fuul.xyz */
  Fuul = 'FUUL',
  /** Represents the yield from an IB (Interest-Bearing) asset APR in a pool. */
  IbYield = 'IB_YIELD',
  /** APR in a pool that can be earned through locking, i.e. veBAL */
  Locking = 'LOCKING',
  /** Reward APR in a pool from maBEETS emissions allocated by gauge votes. Emitted in BEETS. */
  MabeetsEmissions = 'MABEETS_EMISSIONS',
  /** Rewards distributed by merkl.xyz */
  Merkl = 'MERKL',
  /** Represents if the APR items comes from a nested pool. */
  Nested = 'NESTED',
  /** APR calculated for QUANT-AMM pools based on performance measurements over a month */
  QuantAmmUplift = 'QUANT_AMM_UPLIFT',
  /** Staking reward APR in a pool from a reward token. */
  Staking = 'STAKING',
  /** APR boost that can be earned, i.e. via veBAL or maBEETS. */
  StakingBoost = 'STAKING_BOOST',
  /**
   * Cow AMM specific APR
   * @deprecated Use SURPLUS_24H instead
   */
  Surplus = 'SURPLUS',
  /** Surplus APR based on data from the last 7d */
  Surplus_7D = 'SURPLUS_7D',
  /** Surplus APR based on data from the last 24h */
  Surplus_24H = 'SURPLUS_24H',
  /** Surplus APR based on data from the last 30d */
  Surplus_30D = 'SURPLUS_30D',
  /**
   * Represents the swap fee APR in a pool.
   * @deprecated Use SWAP_FEE_24H instead
   */
  SwapFee = 'SWAP_FEE',
  /** Swap fee APR based on data from the last 7d */
  SwapFee_7D = 'SWAP_FEE_7D',
  /** Swap fee APR based on data from the last 24h */
  SwapFee_24H = 'SWAP_FEE_24H',
  /** Swap fee APR based on data from the last 30d */
  SwapFee_30D = 'SWAP_FEE_30D',
  /** Reward APR in a pool from veBAL emissions allocated by gauge votes. Emitted in BAL. */
  VebalEmissions = 'VEBAL_EMISSIONS',
  /** APR that can be earned thourgh voting, i.e. gauge votes */
  Voting = 'VOTING'
}

/** The base type as returned by poolGetPool (specific pool query) */
export type GqlPoolBase = {
  /** The contract address of the pool. */
  address: Scalars['Bytes']['output'];
  /** List of categories assigned by the team based on external factors */
  categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
  /** The chain on which the pool is deployed */
  chain: GqlChain;
  /** The timestamp the pool was created. */
  createTime: Scalars['Int']['output'];
  /** The decimals of the BPT, usually 18 */
  decimals: Scalars['Int']['output'];
  /** Dynamic data such as token balances, swap fees or volume */
  dynamicData: GqlPoolDynamicData;
  /** The factory contract address from which the pool was created. */
  factory?: Maybe<Scalars['Bytes']['output']>;
  /** Whether at least one token in this pool is considered an ERC4626 token and the buffer is allowed. */
  hasAnyAllowedBuffer: Scalars['Boolean']['output'];
  /** Whether at least one token in this pool is considered an ERC4626 token. */
  hasErc4626: Scalars['Boolean']['output'];
  /** Whether at least one token in a nested pool is considered an ERC4626 token. */
  hasNestedErc4626: Scalars['Boolean']['output'];
  /** Hook assigned to a pool */
  hook?: Maybe<GqlHook>;
  /** The pool id. This is equal to the address for protocolVersion 3 pools */
  id: Scalars['ID']['output'];
  /** Liquidity management settings for v3 pools. */
  liquidityManagement?: Maybe<LiquidityManagement>;
  /** The name of the pool as per contract */
  name: Scalars['String']['output'];
  /**
   * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
   * @deprecated Use swapFeeManager instead
   */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
  pauseManager?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to set the pool creator fee percentage */
  poolCreator?: Maybe<Scalars['Bytes']['output']>;
  /** Returns pool tokens, including BPTs and nested pools and their pool tokens if there are any. Only one nested level deep. */
  poolTokens: Array<GqlPoolTokenDetail>;
  /** The protocol version on which the pool is deployed, 1, 2 or 3 */
  protocolVersion: Scalars['Int']['output'];
  /** Staking options of this pool which emit additional rewards */
  staking?: Maybe<GqlPoolStaking>;
  /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
  swapFeeManager?: Maybe<Scalars['Bytes']['output']>;
  /** The token symbol of the pool as per contract */
  symbol: Scalars['String']['output'];
  /** List of tags assigned by the team based on external factors */
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The pool type, such as weighted, stable, etc. */
  type: GqlPoolType;
  /** If a user address was provided in the query, the user balance is populated here */
  userBalance?: Maybe<GqlPoolUserBalance>;
  /**
   * The vault version on which the pool is deployed, 2 or 3
   * @deprecated use protocolVersion instead
   */
  vaultVersion: Scalars['Int']['output'];
  /** The version of the pool type. */
  version: Scalars['Int']['output'];
};

export type GqlPoolComposableStable = GqlPoolBase & {
  __typename: 'GqlPoolComposableStable';
  address: Scalars['Bytes']['output'];
  amp: Scalars['BigInt']['output'];
  bptPriceRate: Scalars['BigDecimal']['output'];
  categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']['output']>;
  hasAnyAllowedBuffer: Scalars['Boolean']['output'];
  hasErc4626: Scalars['Boolean']['output'];
  hasNestedErc4626: Scalars['Boolean']['output'];
  hook?: Maybe<GqlHook>;
  id: Scalars['ID']['output'];
  liquidityManagement?: Maybe<LiquidityManagement>;
  name: Scalars['String']['output'];
  /**
   * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
   * @deprecated Use swapFeeManager instead
   */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
  pauseManager?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to set the pool creator fee percentage */
  poolCreator?: Maybe<Scalars['Bytes']['output']>;
  poolTokens: Array<GqlPoolTokenDetail>;
  protocolVersion: Scalars['Int']['output'];
  staking?: Maybe<GqlPoolStaking>;
  /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
  swapFeeManager?: Maybe<Scalars['Bytes']['output']>;
  symbol: Scalars['String']['output'];
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  /** @deprecated use protocolVersion instead */
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
};

export type GqlPoolDynamicData = {
  __typename: 'GqlPoolDynamicData';
  /** Protocol and pool creator fees combined */
  aggregateSwapFee: Scalars['BigDecimal']['output'];
  /** Protocol and pool creator fees combined */
  aggregateYieldFee: Scalars['BigDecimal']['output'];
  aprItems: Array<GqlPoolAprItem>;
  fees24h: Scalars['BigDecimal']['output'];
  /** @deprecated No longer supported */
  fees24hAth: Scalars['BigDecimal']['output'];
  /** @deprecated No longer supported */
  fees24hAthTimestamp: Scalars['Int']['output'];
  /** @deprecated No longer supported */
  fees24hAtl: Scalars['BigDecimal']['output'];
  /** @deprecated No longer supported */
  fees24hAtlTimestamp: Scalars['Int']['output'];
  fees48h: Scalars['BigDecimal']['output'];
  holdersCount: Scalars['BigInt']['output'];
  /** True for bricked pools */
  isInRecoveryMode: Scalars['Boolean']['output'];
  isPaused: Scalars['Boolean']['output'];
  lifetimeSwapFees: Scalars['BigDecimal']['output'];
  lifetimeVolume: Scalars['BigDecimal']['output'];
  poolId: Scalars['ID']['output'];
  protocolFees24h: Scalars['BigDecimal']['output'];
  protocolFees48h: Scalars['BigDecimal']['output'];
  protocolYieldCapture24h: Scalars['BigDecimal']['output'];
  protocolYieldCapture48h: Scalars['BigDecimal']['output'];
  /** @deprecated No longer supported */
  sharePriceAth: Scalars['BigDecimal']['output'];
  /** @deprecated No longer supported */
  sharePriceAthTimestamp: Scalars['Int']['output'];
  /** @deprecated No longer supported */
  sharePriceAtl: Scalars['BigDecimal']['output'];
  /** @deprecated No longer supported */
  sharePriceAtlTimestamp: Scalars['Int']['output'];
  /** CowAmm specific, equivalent of swap fees */
  surplus24h: Scalars['BigDecimal']['output'];
  /** CowAmm specific, equivalent of swap fees */
  surplus48h: Scalars['BigDecimal']['output'];
  /** Disabled for bricked pools */
  swapEnabled: Scalars['Boolean']['output'];
  swapFee: Scalars['BigDecimal']['output'];
  /** @deprecated No longer supported */
  swapsCount: Scalars['BigInt']['output'];
  totalLiquidity: Scalars['BigDecimal']['output'];
  totalLiquidity24hAgo: Scalars['BigDecimal']['output'];
  /** @deprecated No longer supported */
  totalLiquidityAth: Scalars['BigDecimal']['output'];
  /** @deprecated No longer supported */
  totalLiquidityAthTimestamp: Scalars['Int']['output'];
  /** @deprecated No longer supported */
  totalLiquidityAtl: Scalars['BigDecimal']['output'];
  /** @deprecated No longer supported */
  totalLiquidityAtlTimestamp: Scalars['Int']['output'];
  totalShares: Scalars['BigDecimal']['output'];
  totalShares24hAgo: Scalars['BigDecimal']['output'];
  totalSupply: Scalars['BigDecimal']['output'];
  volume24h: Scalars['BigDecimal']['output'];
  /** @deprecated No longer supported */
  volume24hAth: Scalars['BigDecimal']['output'];
  /** @deprecated No longer supported */
  volume24hAthTimestamp: Scalars['Int']['output'];
  /** @deprecated No longer supported */
  volume24hAtl: Scalars['BigDecimal']['output'];
  /** @deprecated No longer supported */
  volume24hAtlTimestamp: Scalars['Int']['output'];
  volume48h: Scalars['BigDecimal']['output'];
  yieldCapture24h: Scalars['BigDecimal']['output'];
  yieldCapture48h: Scalars['BigDecimal']['output'];
};

export type GqlPoolElement = GqlPoolBase & {
  __typename: 'GqlPoolElement';
  address: Scalars['Bytes']['output'];
  baseToken: Scalars['Bytes']['output'];
  categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']['output']>;
  hasAnyAllowedBuffer: Scalars['Boolean']['output'];
  hasErc4626: Scalars['Boolean']['output'];
  hasNestedErc4626: Scalars['Boolean']['output'];
  hook?: Maybe<GqlHook>;
  id: Scalars['ID']['output'];
  liquidityManagement?: Maybe<LiquidityManagement>;
  name: Scalars['String']['output'];
  /**
   * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
   * @deprecated Use swapFeeManager instead
   */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
  pauseManager?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to set the pool creator fee percentage */
  poolCreator?: Maybe<Scalars['Bytes']['output']>;
  poolTokens: Array<GqlPoolTokenDetail>;
  principalToken: Scalars['Bytes']['output'];
  protocolVersion: Scalars['Int']['output'];
  staking?: Maybe<GqlPoolStaking>;
  /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
  swapFeeManager?: Maybe<Scalars['Bytes']['output']>;
  symbol: Scalars['String']['output'];
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  type: GqlPoolType;
  unitSeconds: Scalars['BigInt']['output'];
  userBalance?: Maybe<GqlPoolUserBalance>;
  /** @deprecated use protocolVersion instead */
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
};

/** Represents an event that occurs in a pool. */
export type GqlPoolEvent = {
  /** The block number of the event. */
  blockNumber: Scalars['Int']['output'];
  /** The block timestamp of the event. */
  blockTimestamp: Scalars['Int']['output'];
  /** The chain on which the event occurred. */
  chain: GqlChain;
  /** The unique identifier of the event. */
  id: Scalars['ID']['output'];
  /** The log index of the event. */
  logIndex: Scalars['Int']['output'];
  /** The pool ID associated with the event. */
  poolId: Scalars['String']['output'];
  /** The sender of the event. */
  sender: Scalars['String']['output'];
  /** The timestamp of the event. */
  timestamp: Scalars['Int']['output'];
  /** The transaction hash of the event. */
  tx: Scalars['String']['output'];
  /** The type of the event. */
  type: GqlPoolEventType;
  /** The user address associated with the event. */
  userAddress: Scalars['String']['output'];
  /** The USD value of this event. */
  valueUSD: Scalars['Float']['output'];
};

export type GqlPoolEventAmount = {
  __typename: 'GqlPoolEventAmount';
  address: Scalars['String']['output'];
  amount: Scalars['String']['output'];
  valueUSD: Scalars['Float']['output'];
};

export enum GqlPoolEventType {
  Add = 'ADD',
  Remove = 'REMOVE',
  Swap = 'SWAP'
}

export type GqlPoolEventsFilter = {
  chainIn?: InputMaybe<Array<InputMaybe<GqlChain>>>;
  poolId?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<GqlPoolEventType>;
  userAddress?: InputMaybe<Scalars['String']['input']>;
};

export type GqlPoolFeaturedPool = {
  __typename: 'GqlPoolFeaturedPool';
  description: Scalars['String']['output'];
  pool: GqlPoolBase;
  poolId: Scalars['ID']['output'];
  primary: Scalars['Boolean']['output'];
};

export type GqlPoolFilter = {
  chainIn?: InputMaybe<Array<GqlChain>>;
  chainNotIn?: InputMaybe<Array<GqlChain>>;
  createTime?: InputMaybe<GqlPoolTimePeriod>;
  idIn?: InputMaybe<Array<Scalars['String']['input']>>;
  idNotIn?: InputMaybe<Array<Scalars['String']['input']>>;
  minTvl?: InputMaybe<Scalars['Float']['input']>;
  poolTypeIn?: InputMaybe<Array<GqlPoolType>>;
  poolTypeNotIn?: InputMaybe<Array<GqlPoolType>>;
  protocolVersionIn?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Only returns pools where the rateprovider or ERC4626 are reviewed. Default: false */
  reviewedOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * For list of tags see: https://github.com/balancer/metadata/blob/main/pools/index.json
   * Use uppercase
   */
  tagIn?: InputMaybe<Array<Scalars['String']['input']>>;
  /**
   * For list of tags see: https://github.com/balancer/metadata/blob/main/pools/index.json
   * Use uppercase
   */
  tagNotIn?: InputMaybe<Array<Scalars['String']['input']>>;
  tokensIn?: InputMaybe<Array<Scalars['String']['input']>>;
  tokensNotIn?: InputMaybe<Array<Scalars['String']['input']>>;
  userAddress?: InputMaybe<Scalars['String']['input']>;
};

export enum GqlPoolFilterCategory {
  BlackListed = 'BLACK_LISTED',
  Incentivized = 'INCENTIVIZED',
  Lrt = 'LRT',
  Points = 'POINTS',
  PointsEigenlayer = 'POINTS_EIGENLAYER',
  PointsGyro = 'POINTS_GYRO',
  PointsKelp = 'POINTS_KELP',
  PointsRenzo = 'POINTS_RENZO',
  PointsSwell = 'POINTS_SWELL',
  Superfest = 'SUPERFEST'
}

export type GqlPoolFixedPriceLbp = GqlPoolBase & {
  __typename: 'GqlPoolFixedPriceLBP';
  address: Scalars['Bytes']['output'];
  categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  discord?: Maybe<Scalars['String']['output']>;
  dynamicData: GqlPoolDynamicData;
  endTime: Scalars['Int']['output'];
  factory?: Maybe<Scalars['Bytes']['output']>;
  farcaster?: Maybe<Scalars['String']['output']>;
  hasAnyAllowedBuffer: Scalars['Boolean']['output'];
  hasErc4626: Scalars['Boolean']['output'];
  hasNestedErc4626: Scalars['Boolean']['output'];
  hook?: Maybe<GqlHook>;
  id: Scalars['ID']['output'];
  isProjectTokenSwapInBlocked: Scalars['Boolean']['output'];
  lbpName?: Maybe<Scalars['String']['output']>;
  lbpOwner: Scalars['String']['output'];
  liquidityManagement?: Maybe<LiquidityManagement>;
  name: Scalars['String']['output'];
  /**
   * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
   * @deprecated Use swapFeeManager instead
   */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
  pauseManager?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to set the pool creator fee percentage */
  poolCreator?: Maybe<Scalars['Bytes']['output']>;
  poolTokens: Array<GqlPoolTokenDetail>;
  projectToken: Scalars['String']['output'];
  projectTokenIndex: Scalars['Int']['output'];
  projectTokenRate: Scalars['BigDecimal']['output'];
  protocolVersion: Scalars['Int']['output'];
  reserveToken: Scalars['String']['output'];
  reserveTokenIndex: Scalars['Int']['output'];
  /** All tokens of the pool. If it is a nested pool, the nested pool is expanded with its own tokens again. */
  staking?: Maybe<GqlPoolStaking>;
  startTime: Scalars['Int']['output'];
  /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
  swapFeeManager?: Maybe<Scalars['Bytes']['output']>;
  symbol: Scalars['String']['output'];
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  telegram?: Maybe<Scalars['String']['output']>;
  topTrades?: Maybe<Array<GqlLbpTopTrade>>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  /** @deprecated use protocolVersion instead */
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
  website?: Maybe<Scalars['String']['output']>;
  x?: Maybe<Scalars['String']['output']>;
};

export type GqlPoolFx = GqlPoolBase & {
  __typename: 'GqlPoolFx';
  address: Scalars['Bytes']['output'];
  alpha: Scalars['String']['output'];
  beta: Scalars['String']['output'];
  categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  delta: Scalars['String']['output'];
  dynamicData: GqlPoolDynamicData;
  epsilon: Scalars['String']['output'];
  factory?: Maybe<Scalars['Bytes']['output']>;
  hasAnyAllowedBuffer: Scalars['Boolean']['output'];
  hasErc4626: Scalars['Boolean']['output'];
  hasNestedErc4626: Scalars['Boolean']['output'];
  hook?: Maybe<GqlHook>;
  id: Scalars['ID']['output'];
  lambda: Scalars['String']['output'];
  liquidityManagement?: Maybe<LiquidityManagement>;
  name: Scalars['String']['output'];
  /**
   * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
   * @deprecated Use swapFeeManager instead
   */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
  pauseManager?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to set the pool creator fee percentage */
  poolCreator?: Maybe<Scalars['Bytes']['output']>;
  poolTokens: Array<GqlPoolTokenDetail>;
  protocolVersion: Scalars['Int']['output'];
  staking?: Maybe<GqlPoolStaking>;
  /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
  swapFeeManager?: Maybe<Scalars['Bytes']['output']>;
  symbol: Scalars['String']['output'];
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  /** @deprecated use protocolVersion instead */
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
};

export type GqlPoolGyro = GqlPoolBase & {
  __typename: 'GqlPoolGyro';
  address: Scalars['Bytes']['output'];
  alpha: Scalars['String']['output'];
  beta: Scalars['String']['output'];
  c: Scalars['String']['output'];
  categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  dSq: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']['output']>;
  hasAnyAllowedBuffer: Scalars['Boolean']['output'];
  hasErc4626: Scalars['Boolean']['output'];
  hasNestedErc4626: Scalars['Boolean']['output'];
  hook?: Maybe<GqlHook>;
  id: Scalars['ID']['output'];
  lambda: Scalars['String']['output'];
  liquidityManagement?: Maybe<LiquidityManagement>;
  name: Scalars['String']['output'];
  /**
   * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
   * @deprecated Use swapFeeManager instead
   */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
  pauseManager?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to set the pool creator fee percentage */
  poolCreator?: Maybe<Scalars['Bytes']['output']>;
  poolTokens: Array<GqlPoolTokenDetail>;
  protocolVersion: Scalars['Int']['output'];
  root3Alpha: Scalars['String']['output'];
  s: Scalars['String']['output'];
  sqrtAlpha: Scalars['String']['output'];
  sqrtBeta: Scalars['String']['output'];
  staking?: Maybe<GqlPoolStaking>;
  /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
  swapFeeManager?: Maybe<Scalars['Bytes']['output']>;
  symbol: Scalars['String']['output'];
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  tauAlphaX: Scalars['String']['output'];
  tauAlphaY: Scalars['String']['output'];
  tauBetaX: Scalars['String']['output'];
  tauBetaY: Scalars['String']['output'];
  type: GqlPoolType;
  u: Scalars['String']['output'];
  userBalance?: Maybe<GqlPoolUserBalance>;
  v: Scalars['String']['output'];
  /** @deprecated use protocolVersion instead */
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
  w: Scalars['String']['output'];
  z: Scalars['String']['output'];
};

export type GqlPoolLiquidityBootstrapping = GqlPoolBase & {
  __typename: 'GqlPoolLiquidityBootstrapping';
  address: Scalars['Bytes']['output'];
  categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']['output']>;
  hasAnyAllowedBuffer: Scalars['Boolean']['output'];
  hasErc4626: Scalars['Boolean']['output'];
  hasNestedErc4626: Scalars['Boolean']['output'];
  hook?: Maybe<GqlHook>;
  id: Scalars['ID']['output'];
  liquidityManagement?: Maybe<LiquidityManagement>;
  name: Scalars['String']['output'];
  /**
   * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
   * @deprecated Use swapFeeManager instead
   */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
  pauseManager?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to set the pool creator fee percentage */
  poolCreator?: Maybe<Scalars['Bytes']['output']>;
  poolTokens: Array<GqlPoolTokenDetail>;
  protocolVersion: Scalars['Int']['output'];
  staking?: Maybe<GqlPoolStaking>;
  /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
  swapFeeManager?: Maybe<Scalars['Bytes']['output']>;
  symbol: Scalars['String']['output'];
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  /** @deprecated use protocolVersion instead */
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
};

export type GqlPoolLiquidityBootstrappingV3 = GqlPoolBase & {
  __typename: 'GqlPoolLiquidityBootstrappingV3';
  address: Scalars['Bytes']['output'];
  categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  discord?: Maybe<Scalars['String']['output']>;
  dynamicData: GqlPoolDynamicData;
  endTime: Scalars['Int']['output'];
  factory?: Maybe<Scalars['Bytes']['output']>;
  farcaster?: Maybe<Scalars['String']['output']>;
  hasAnyAllowedBuffer: Scalars['Boolean']['output'];
  hasErc4626: Scalars['Boolean']['output'];
  hasNestedErc4626: Scalars['Boolean']['output'];
  hook?: Maybe<GqlHook>;
  id: Scalars['ID']['output'];
  isProjectTokenSwapInBlocked: Scalars['Boolean']['output'];
  isSeedless: Scalars['Boolean']['output'];
  lbpName?: Maybe<Scalars['String']['output']>;
  lbpOwner: Scalars['String']['output'];
  liquidityManagement?: Maybe<LiquidityManagement>;
  name: Scalars['String']['output'];
  /**
   * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
   * @deprecated Use swapFeeManager instead
   */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
  pauseManager?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to set the pool creator fee percentage */
  poolCreator?: Maybe<Scalars['Bytes']['output']>;
  poolTokens: Array<GqlPoolTokenDetail>;
  projectToken: Scalars['String']['output'];
  projectTokenEndWeight: Scalars['Float']['output'];
  projectTokenIndex: Scalars['Int']['output'];
  projectTokenStartWeight: Scalars['Float']['output'];
  protocolVersion: Scalars['Int']['output'];
  reserveToken: Scalars['String']['output'];
  reserveTokenEndWeight: Scalars['Float']['output'];
  reserveTokenIndex: Scalars['Int']['output'];
  reserveTokenStartWeight: Scalars['Float']['output'];
  reserveTokenVirtualBalance: Scalars['Float']['output'];
  /** All tokens of the pool. If it is a nested pool, the nested pool is expanded with its own tokens again. */
  staking?: Maybe<GqlPoolStaking>;
  startTime: Scalars['Int']['output'];
  /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
  swapFeeManager?: Maybe<Scalars['Bytes']['output']>;
  symbol: Scalars['String']['output'];
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  telegram?: Maybe<Scalars['String']['output']>;
  topTrades?: Maybe<Array<GqlLbpTopTrade>>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  /** @deprecated use protocolVersion instead */
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
  website?: Maybe<Scalars['String']['output']>;
  x?: Maybe<Scalars['String']['output']>;
};

export type GqlPoolMetaStable = GqlPoolBase & {
  __typename: 'GqlPoolMetaStable';
  address: Scalars['Bytes']['output'];
  amp: Scalars['BigInt']['output'];
  categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']['output']>;
  hasAnyAllowedBuffer: Scalars['Boolean']['output'];
  hasErc4626: Scalars['Boolean']['output'];
  hasNestedErc4626: Scalars['Boolean']['output'];
  hook?: Maybe<GqlHook>;
  id: Scalars['ID']['output'];
  liquidityManagement?: Maybe<LiquidityManagement>;
  name: Scalars['String']['output'];
  /**
   * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
   * @deprecated Use swapFeeManager instead
   */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
  pauseManager?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to set the pool creator fee percentage */
  poolCreator?: Maybe<Scalars['Bytes']['output']>;
  poolTokens: Array<GqlPoolTokenDetail>;
  protocolVersion: Scalars['Int']['output'];
  staking?: Maybe<GqlPoolStaking>;
  /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
  swapFeeManager?: Maybe<Scalars['Bytes']['output']>;
  symbol: Scalars['String']['output'];
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  /** @deprecated use protocolVersion instead */
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
};

/** The pool schema returned for poolGetPools (pool list query) */
export type GqlPoolMinimal = {
  __typename: 'GqlPoolMinimal';
  /** The contract address of the pool. */
  address: Scalars['Bytes']['output'];
  /** List of categories assigned by the team based on external factors */
  categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
  /** The chain on which the pool is deployed */
  chain: GqlChain;
  /** The timestamp the pool was created. */
  createTime: Scalars['Int']['output'];
  /** The decimals of the BPT, usually 18 */
  decimals: Scalars['Int']['output'];
  /** Dynamic data such as token balances, swap fees or volume */
  dynamicData: GqlPoolDynamicData;
  /** The factory contract address from which the pool was created. */
  factory?: Maybe<Scalars['Bytes']['output']>;
  /** Whether at least one token in this pool is considered an ERC4626 token and the buffer is allowed. */
  hasAnyAllowedBuffer: Scalars['Boolean']['output'];
  /** Whether at least one token in this pool is considered an ERC4626 token. */
  hasErc4626: Scalars['Boolean']['output'];
  /** Whether at least one token in a nested pool is considered an ERC4626 token. */
  hasNestedErc4626: Scalars['Boolean']['output'];
  /** Hook assigned to a pool */
  hook?: Maybe<GqlHook>;
  /** The pool id. This is equal to the address for protocolVersion 3 pools */
  id: Scalars['ID']['output'];
  /** Pool is receiving rewards when liquidity tokens are staked */
  incentivized: Scalars['Boolean']['output'];
  /** LBP specific params for v3 pools only. */
  lbpParams?: Maybe<LiquidityBootstrappingPoolV3Params>;
  /** Liquidity management settings for v3 pools. */
  liquidityManagement?: Maybe<LiquidityManagement>;
  /** The name of the pool as per contract */
  name: Scalars['String']['output'];
  /**
   * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
   * @deprecated Use swapFeeManager instead
   */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
  pauseManager?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to set the pool creator fee percentage */
  poolCreator?: Maybe<Scalars['Bytes']['output']>;
  /** Returns all pool tokens, including BPTs and nested pools if there are any. Only one nested level deep. */
  poolTokens: Array<GqlPoolTokenDetail>;
  /** The protocol version on which the pool is deployed, 1, 2 or 3 */
  protocolVersion: Scalars['Int']['output'];
  /** Staking options of this pool which emit additional rewards */
  staking?: Maybe<GqlPoolStaking>;
  /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
  swapFeeManager?: Maybe<Scalars['Bytes']['output']>;
  /** The token symbol of the pool as per contract */
  symbol: Scalars['String']['output'];
  /** List of tags assigned by the team based on external factors */
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The pool type, such as weighted, stable, etc. */
  type: GqlPoolType;
  /** If a user address was provided in the query, the user balance is populated here */
  userBalance?: Maybe<GqlPoolUserBalance>;
  /**
   * The vault version on which the pool is deployed, 2 or 3
   * @deprecated use protocolVersion instead
   */
  vaultVersion: Scalars['Int']['output'];
  /** The version of the pool type. */
  version: Scalars['Int']['output'];
};

/** Result of the poolReloadPools mutation */
export type GqlPoolMutationResult = {
  __typename: 'GqlPoolMutationResult';
  /** The chain that was reloaded. */
  chain: GqlChain;
  /** The error message */
  error?: Maybe<Scalars['String']['output']>;
  /** Whether it was successful or not. */
  success: Scalars['Boolean']['output'];
  /** The type of pools that were reloaded. */
  type: Scalars['String']['output'];
};

export enum GqlPoolOrderBy {
  Apr = 'apr',
  Fees24h = 'fees24h',
  TotalLiquidity = 'totalLiquidity',
  TotalShares = 'totalShares',
  UserbalanceUsd = 'userbalanceUsd',
  Volume24h = 'volume24h'
}

export enum GqlPoolOrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type GqlPoolQuantAmmWeighted = GqlPoolBase & {
  __typename: 'GqlPoolQuantAmmWeighted';
  address: Scalars['Bytes']['output'];
  categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']['output']>;
  hasAnyAllowedBuffer: Scalars['Boolean']['output'];
  hasErc4626: Scalars['Boolean']['output'];
  hasNestedErc4626: Scalars['Boolean']['output'];
  hook?: Maybe<GqlHook>;
  id: Scalars['ID']['output'];
  liquidityManagement?: Maybe<LiquidityManagement>;
  name: Scalars['String']['output'];
  /**
   * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
   * @deprecated Use swapFeeManager instead
   */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
  pauseManager?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to set the pool creator fee percentage */
  poolCreator?: Maybe<Scalars['Bytes']['output']>;
  poolTokens: Array<GqlPoolTokenDetail>;
  protocolVersion: Scalars['Int']['output'];
  quantAmmWeightedParams?: Maybe<QuantAmmWeightedParams>;
  staking?: Maybe<GqlPoolStaking>;
  /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
  swapFeeManager?: Maybe<Scalars['Bytes']['output']>;
  symbol: Scalars['String']['output'];
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  /** @deprecated use protocolVersion instead */
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
  weightSnapshots?: Maybe<Array<QuantAmmWeightSnapshot>>;
};

export type GqlPoolReClamm = GqlPoolBase & {
  __typename: 'GqlPoolReClamm';
  address: Scalars['Bytes']['output'];
  categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
  /** The centeredness margin of the pool */
  centerednessMargin: Scalars['BigDecimal']['output'];
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  /** The current fourth root price ratio, an interpolation of the price ratio state */
  currentFourthRootPriceRatio: Scalars['BigDecimal']['output'];
  /** Represents how fast the pool can move the virtual balances per day */
  dailyPriceShiftBase: Scalars['BigDecimal']['output'];
  decimals: Scalars['Int']['output'];
  dynamicData: GqlPoolDynamicData;
  /** The fourth root price ratio at the end of an update */
  endFourthRootPriceRatio: Scalars['BigDecimal']['output'];
  factory?: Maybe<Scalars['Bytes']['output']>;
  hasAnyAllowedBuffer: Scalars['Boolean']['output'];
  hasErc4626: Scalars['Boolean']['output'];
  hasNestedErc4626: Scalars['Boolean']['output'];
  hook?: Maybe<GqlHook>;
  id: Scalars['ID']['output'];
  /** The timestamp of the last user interaction */
  lastTimestamp: Scalars['Int']['output'];
  /** The last virtual balances of the pool */
  lastVirtualBalances: Array<Scalars['BigDecimal']['output']>;
  liquidityManagement?: Maybe<LiquidityManagement>;
  name: Scalars['String']['output'];
  /**
   * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
   * @deprecated Use swapFeeManager instead
   */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
  pauseManager?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to set the pool creator fee percentage */
  poolCreator?: Maybe<Scalars['Bytes']['output']>;
  poolTokens: Array<GqlPoolTokenDetail>;
  /** The timestamp when the update ends */
  priceRatioUpdateEndTime: Scalars['Int']['output'];
  /** The timestamp when the update begins */
  priceRatioUpdateStartTime: Scalars['Int']['output'];
  protocolVersion: Scalars['Int']['output'];
  staking?: Maybe<GqlPoolStaking>;
  /** The fourth root price ratio at the start of an update */
  startFourthRootPriceRatio: Scalars['BigDecimal']['output'];
  /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
  swapFeeManager?: Maybe<Scalars['Bytes']['output']>;
  symbol: Scalars['String']['output'];
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  /** @deprecated use protocolVersion instead */
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
};

export type GqlPoolSnapshot = {
  __typename: 'GqlPoolSnapshot';
  amounts: Array<Scalars['String']['output']>;
  chain: GqlChain;
  fees24h: Scalars['String']['output'];
  /** @deprecated No longer supported */
  holdersCount: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  poolId: Scalars['String']['output'];
  sharePrice: Scalars['String']['output'];
  surplus24h: Scalars['String']['output'];
  swapsCount: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
  totalLiquidity: Scalars['String']['output'];
  totalShares: Scalars['String']['output'];
  /** @deprecated No longer supported */
  totalSurplus: Scalars['String']['output'];
  /** @deprecated No longer supported */
  totalSwapFee: Scalars['String']['output'];
  /** @deprecated No longer supported */
  totalSwapVolume: Scalars['String']['output'];
  volume24h: Scalars['String']['output'];
};

export enum GqlPoolSnapshotDataRange {
  AllTime = 'ALL_TIME',
  NinetyDays = 'NINETY_DAYS',
  OneHundredEightyDays = 'ONE_HUNDRED_EIGHTY_DAYS',
  OneYear = 'ONE_YEAR',
  ThirtyDays = 'THIRTY_DAYS'
}

export type GqlPoolStable = GqlPoolBase & {
  __typename: 'GqlPoolStable';
  address: Scalars['Bytes']['output'];
  amp: Scalars['BigInt']['output'];
  bptPriceRate: Scalars['BigDecimal']['output'];
  categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']['output']>;
  hasAnyAllowedBuffer: Scalars['Boolean']['output'];
  hasErc4626: Scalars['Boolean']['output'];
  hasNestedErc4626: Scalars['Boolean']['output'];
  hook?: Maybe<GqlHook>;
  id: Scalars['ID']['output'];
  liquidityManagement?: Maybe<LiquidityManagement>;
  name: Scalars['String']['output'];
  /**
   * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
   * @deprecated Use swapFeeManager instead
   */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
  pauseManager?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to set the pool creator fee percentage */
  poolCreator?: Maybe<Scalars['Bytes']['output']>;
  poolTokens: Array<GqlPoolTokenDetail>;
  protocolVersion: Scalars['Int']['output'];
  staking?: Maybe<GqlPoolStaking>;
  /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
  swapFeeManager?: Maybe<Scalars['Bytes']['output']>;
  symbol: Scalars['String']['output'];
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  /** @deprecated use protocolVersion instead */
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
};

export type GqlPoolStaking = {
  __typename: 'GqlPoolStaking';
  address: Scalars['String']['output'];
  aura?: Maybe<GqlPoolStakingAura>;
  chain: GqlChain;
  farm?: Maybe<GqlPoolStakingMasterChefFarm>;
  gauge?: Maybe<GqlPoolStakingGauge>;
  id: Scalars['ID']['output'];
  reliquary?: Maybe<GqlPoolStakingReliquaryFarm>;
  type: GqlPoolStakingType;
  vebal?: Maybe<GqlPoolStakingVebal>;
};

export type GqlPoolStakingAura = {
  __typename: 'GqlPoolStakingAura';
  apr: Scalars['Float']['output'];
  auraPoolAddress: Scalars['String']['output'];
  auraPoolId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isShutdown: Scalars['Boolean']['output'];
};

export type GqlPoolStakingFarmRewarder = {
  __typename: 'GqlPoolStakingFarmRewarder';
  address: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  rewardPerSecond: Scalars['String']['output'];
  tokenAddress: Scalars['String']['output'];
};

export type GqlPoolStakingGauge = {
  __typename: 'GqlPoolStakingGauge';
  gaugeAddress: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  otherGauges?: Maybe<Array<GqlPoolStakingOtherGauge>>;
  rewards: Array<GqlPoolStakingGaugeReward>;
  status: GqlPoolStakingGaugeStatus;
  version: Scalars['Int']['output'];
  workingSupply: Scalars['String']['output'];
};

export type GqlPoolStakingGaugeReward = {
  __typename: 'GqlPoolStakingGaugeReward';
  id: Scalars['ID']['output'];
  rewardPerSecond: Scalars['String']['output'];
  tokenAddress: Scalars['String']['output'];
};

export enum GqlPoolStakingGaugeStatus {
  Active = 'ACTIVE',
  Killed = 'KILLED',
  Preferred = 'PREFERRED'
}

export type GqlPoolStakingMasterChefFarm = {
  __typename: 'GqlPoolStakingMasterChefFarm';
  beetsPerBlock: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  rewarders?: Maybe<Array<GqlPoolStakingFarmRewarder>>;
};

export type GqlPoolStakingOtherGauge = {
  __typename: 'GqlPoolStakingOtherGauge';
  gaugeAddress: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  rewards: Array<GqlPoolStakingGaugeReward>;
  status: GqlPoolStakingGaugeStatus;
  version: Scalars['Int']['output'];
};

export type GqlPoolStakingReliquaryFarm = {
  __typename: 'GqlPoolStakingReliquaryFarm';
  beetsPerSecond: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  levels?: Maybe<Array<GqlPoolStakingReliquaryFarmLevel>>;
  totalBalance: Scalars['String']['output'];
  totalWeightedBalance: Scalars['String']['output'];
};

export type GqlPoolStakingReliquaryFarmLevel = {
  __typename: 'GqlPoolStakingReliquaryFarmLevel';
  allocationPoints: Scalars['Int']['output'];
  apr: Scalars['BigDecimal']['output'];
  balance: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  level: Scalars['Int']['output'];
  requiredMaturity: Scalars['Int']['output'];
};

export enum GqlPoolStakingType {
  Aura = 'AURA',
  FreshBeets = 'FRESH_BEETS',
  Gauge = 'GAUGE',
  MasterChef = 'MASTER_CHEF',
  Reliquary = 'RELIQUARY',
  Vebal = 'VEBAL'
}

export type GqlPoolStakingVebal = {
  __typename: 'GqlPoolStakingVebal';
  id: Scalars['ID']['output'];
  vebalAddress: Scalars['String']['output'];
};

/** Represents an event that occurs when a swap is made in a pool using the CowAmm protocol. */
export type GqlPoolSwapEventCowAmm = GqlPoolEvent & {
  __typename: 'GqlPoolSwapEventCowAmm';
  /** The block number of the event. */
  blockNumber: Scalars['Int']['output'];
  /** The block timestamp of the event. */
  blockTimestamp: Scalars['Int']['output'];
  /** The chain on which the event occurred. */
  chain: GqlChain;
  /** The fee that this swap generated. */
  fee: GqlPoolEventAmount;
  /** The unique identifier of the event. */
  id: Scalars['ID']['output'];
  /** The log index of the event. */
  logIndex: Scalars['Int']['output'];
  /** The pool ID associated with the event. */
  poolId: Scalars['String']['output'];
  /** The sender of the event. */
  sender: Scalars['String']['output'];
  /** The surplus generated by the swap. */
  surplus: GqlPoolEventAmount;
  /** The timestamp of the event. */
  timestamp: Scalars['Int']['output'];
  /** The token that was swapped in the event. */
  tokenIn: GqlPoolEventAmount;
  /** The token that was swapped out in the event. */
  tokenOut: GqlPoolEventAmount;
  /** The transaction hash of the event. */
  tx: Scalars['String']['output'];
  /** The type of the event. */
  type: GqlPoolEventType;
  /** The user address associated with the event. */
  userAddress: Scalars['String']['output'];
  /** The value of the event in USD. */
  valueUSD: Scalars['Float']['output'];
};

/** Represents an event that occurs when a swap is made in a pool. */
export type GqlPoolSwapEventV3 = GqlPoolEvent & {
  __typename: 'GqlPoolSwapEventV3';
  /** The block number of the event. */
  blockNumber: Scalars['Int']['output'];
  /** The block timestamp of the event. */
  blockTimestamp: Scalars['Int']['output'];
  /** The chain on which the event occurred. */
  chain: GqlChain;
  /** The fee that this swap generated. */
  fee: GqlPoolEventAmount;
  /** The unique identifier of the event. */
  id: Scalars['ID']['output'];
  /** The log index of the event. */
  logIndex: Scalars['Int']['output'];
  /** The pool ID associated with the event. */
  poolId: Scalars['String']['output'];
  /** The sender of the event. */
  sender: Scalars['String']['output'];
  /** The timestamp of the event. */
  timestamp: Scalars['Int']['output'];
  /** The token that was swapped in the event. */
  tokenIn: GqlPoolEventAmount;
  /** The token that was swapped out in the event. */
  tokenOut: GqlPoolEventAmount;
  /** The transaction hash of the event. */
  tx: Scalars['String']['output'];
  /** The type of the event. */
  type: GqlPoolEventType;
  /** The user address associated with the event. */
  userAddress: Scalars['String']['output'];
  /** The value of the event in USD. */
  valueUSD: Scalars['Float']['output'];
};

export type GqlPoolTimePeriod = {
  gt?: InputMaybe<Scalars['Int']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * All info on the pool token. It will also include the nested pool if the token is a BPT. It will only support 1 level of nesting.
 * A second (unsupported) level of nesting is shown by having hasNestedPool = true but nestedPool = null.
 */
export type GqlPoolTokenDetail = {
  __typename: 'GqlPoolTokenDetail';
  /** Address of the pool token. */
  address: Scalars['String']['output'];
  /** Balance of the pool token inside the pool. */
  balance: Scalars['BigDecimal']['output'];
  /** USD Balance of the pool token. */
  balanceUSD: Scalars['BigDecimal']['output'];
  /** If it is an ERC4626 token, this defines whether we can use wrap/unwrap through the buffer in swap paths for this token. */
  canUseBufferForSwaps?: Maybe<Scalars['Boolean']['output']>;
  chain?: Maybe<GqlChain>;
  chainId?: Maybe<Scalars['Int']['output']>;
  /** Coingecko ID */
  coingeckoId?: Maybe<Scalars['String']['output']>;
  /** Decimals of the pool token. */
  decimals: Scalars['Int']['output'];
  /** The ERC4626 review data for the token */
  erc4626ReviewData?: Maybe<Erc4626ReviewData>;
  /** Indicates whether this token is a BPT and therefor has a nested pool. */
  hasNestedPool: Scalars['Boolean']['output'];
  /** Id of the token. A combination of pool id and token address. */
  id: Scalars['ID']['output'];
  /** Index of the pool token in the pool as returned by the vault. */
  index: Scalars['Int']['output'];
  /** Whether the token is in the allow list. */
  isAllowed: Scalars['Boolean']['output'];
  /**
   * If it is an ERC4626 token, this defines whether we allow it to use the buffer for pool operations.
   * @deprecated Use useUnderlyingForAddRemove and useWrappedForAddRemove instead
   */
  isBufferAllowed: Scalars['Boolean']['output'];
  /** Whether the token is considered an ERC4626 token. */
  isErc4626: Scalars['Boolean']['output'];
  /** Whether the token is exempted from taking a protocol yield fee. */
  isExemptFromProtocolYieldFee: Scalars['Boolean']['output'];
  /** Token logo */
  logoURI?: Maybe<Scalars['String']['output']>;
  /** If it is an ERC4626 token, this  defines how much can be deposited into the ERC4626 vault. */
  maxDeposit?: Maybe<Scalars['String']['output']>;
  /** If it is an ERC4626 token, this  defines how much can be withdrawn from the ERC4626 vault. */
  maxWithdraw?: Maybe<Scalars['String']['output']>;
  /** Name of the pool token. */
  name: Scalars['String']['output'];
  /** Additional data for the nested pool if the token is a BPT. Null otherwise. */
  nestedPool?: Maybe<GqlNestedPool>;
  /** If it is an appreciating token, it shows the current price rate. 1 otherwise. */
  priceRate: Scalars['BigDecimal']['output'];
  /** The address of the price rate provider. */
  priceRateProvider?: Maybe<Scalars['String']['output']>;
  /** Additional data for the price rate provider, such as reviews or warnings. */
  priceRateProviderData?: Maybe<GqlPriceRateProviderData>;
  /**
   * The priority of the token, can be used for sorting.
   * @deprecated Unused
   */
  priority?: Maybe<Scalars['Int']['output']>;
  /** Conversion factor used to adjust for token decimals for uniform precision in calculations. V3 only. */
  scalingFactor?: Maybe<Scalars['BigDecimal']['output']>;
  /** Symbol of the pool token. */
  symbol: Scalars['String']['output'];
  /**
   * Is the token tradable
   * @deprecated Unused
   */
  tradable?: Maybe<Scalars['Boolean']['output']>;
  /** If it is an ERC4626, this will be the underlying token if present in the API. */
  underlyingToken?: Maybe<GqlToken>;
  /** If it is an ERC4626 token, this defines whether we allow underlying tokens to be used for add/remove operations. */
  useUnderlyingForAddRemove?: Maybe<Scalars['Boolean']['output']>;
  /** If it is an ERC4626 token, this defines whether we allow the wrapped tokens to be used for add/remove operations. */
  useWrappedForAddRemove?: Maybe<Scalars['Boolean']['output']>;
  /** The weight of the token in the pool if it is a weighted pool, null otherwise */
  weight?: Maybe<Scalars['BigDecimal']['output']>;
};

/** Supported pool types */
export enum GqlPoolType {
  ComposableStable = 'COMPOSABLE_STABLE',
  CowAmm = 'COW_AMM',
  Element = 'ELEMENT',
  FixedLbp = 'FIXED_LBP',
  Fx = 'FX',
  Gyro = 'GYRO',
  Gyro3 = 'GYRO3',
  Gyroe = 'GYROE',
  Investment = 'INVESTMENT',
  LiquidityBootstrapping = 'LIQUIDITY_BOOTSTRAPPING',
  MetaStable = 'META_STABLE',
  PhantomStable = 'PHANTOM_STABLE',
  QuantAmmWeighted = 'QUANT_AMM_WEIGHTED',
  Reclamm = 'RECLAMM',
  Stable = 'STABLE',
  Unknown = 'UNKNOWN',
  Weighted = 'WEIGHTED'
}

export type GqlPoolUnion = GqlPoolComposableStable | GqlPoolElement | GqlPoolFixedPriceLbp | GqlPoolFx | GqlPoolGyro | GqlPoolLiquidityBootstrapping | GqlPoolLiquidityBootstrappingV3 | GqlPoolMetaStable | GqlPoolQuantAmmWeighted | GqlPoolReClamm | GqlPoolStable | GqlPoolWeighted;

/** If a user address was provided in the query, the user balance is populated here */
export type GqlPoolUserBalance = {
  __typename: 'GqlPoolUserBalance';
  /** The staked BPT balances of the user. */
  stakedBalances: Array<GqlUserStakedBalance>;
  /** Total balance (wallet + staked) as float */
  totalBalance: Scalars['AmountHumanReadable']['output'];
  /** Total balance (wallet + staked) in USD as float */
  totalBalanceUsd: Scalars['Float']['output'];
  /** The wallet balance (BPT in wallet) as float. */
  walletBalance: Scalars['AmountHumanReadable']['output'];
  /** The wallet balance (BPT in wallet) in USD as float. */
  walletBalanceUsd: Scalars['Float']['output'];
};

export type GqlPoolWeighted = GqlPoolBase & {
  __typename: 'GqlPoolWeighted';
  address: Scalars['Bytes']['output'];
  categories?: Maybe<Array<Maybe<GqlPoolFilterCategory>>>;
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']['output']>;
  hasAnyAllowedBuffer: Scalars['Boolean']['output'];
  hasErc4626: Scalars['Boolean']['output'];
  hasNestedErc4626: Scalars['Boolean']['output'];
  hook?: Maybe<GqlHook>;
  id: Scalars['ID']['output'];
  liquidityManagement?: Maybe<LiquidityManagement>;
  name: Scalars['String']['output'];
  /**
   * The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP.
   * @deprecated Use swapFeeManager instead
   */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to pause/unpause the pool (or 0 to delegate to governance) */
  pauseManager?: Maybe<Scalars['Bytes']['output']>;
  /** Account empowered to set the pool creator fee percentage */
  poolCreator?: Maybe<Scalars['Bytes']['output']>;
  poolTokens: Array<GqlPoolTokenDetail>;
  protocolVersion: Scalars['Int']['output'];
  staking?: Maybe<GqlPoolStaking>;
  /** Account empowered to set static swap fees for a pool (when 0 on V2 swap fees are immutable, on V3 delegate to governance) */
  swapFeeManager?: Maybe<Scalars['Bytes']['output']>;
  symbol: Scalars['String']['output'];
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  /** @deprecated use protocolVersion instead */
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
};

/** Returns the price impact of the path. If there is an error in the price impact calculation, priceImpact will be undefined but the error string is populated. */
export type GqlPriceImpact = {
  __typename: 'GqlPriceImpact';
  /** If priceImpact cant be calculated and is returned as undefined, the error string will be populated. */
  error?: Maybe<Scalars['String']['output']>;
  /** Price impact in percent 0.01 -> 0.01%; undefined if an error happened. */
  priceImpact?: Maybe<Scalars['AmountHumanReadable']['output']>;
};

/** Represents the data of a price rate provider */
export type GqlPriceRateProviderData = {
  __typename: 'GqlPriceRateProviderData';
  /** The address of the price rate provider */
  address: Scalars['String']['output'];
  /** The factory used to create the price rate provider, if applicable */
  factory?: Maybe<Scalars['String']['output']>;
  /** The name of the price rate provider */
  name?: Maybe<Scalars['String']['output']>;
  /** The filename of the review of the price rate provider */
  reviewFile?: Maybe<Scalars['String']['output']>;
  /** Indicates if the price rate provider has been reviewed */
  reviewed: Scalars['Boolean']['output'];
  /** A summary of the price rate provider, usually just says safe or unsafe */
  summary?: Maybe<Scalars['String']['output']>;
  /** Upgradeable components of the price rate provider */
  upgradeableComponents?: Maybe<Array<Maybe<GqlPriceRateProviderUpgradeableComponent>>>;
  /** Warnings associated with the price rate provider */
  warnings?: Maybe<Array<Scalars['String']['output']>>;
};

/** Represents an upgradeable component of a price rate provider */
export type GqlPriceRateProviderUpgradeableComponent = {
  __typename: 'GqlPriceRateProviderUpgradeableComponent';
  /** The entry point / proxy of the upgradeable component */
  entryPoint: Scalars['String']['output'];
  /** Indicates if the implementation of the component has been reviewed */
  implementationReviewed: Scalars['String']['output'];
};

export type GqlProtocolMetricsAggregated = {
  __typename: 'GqlProtocolMetricsAggregated';
  chains: Array<GqlProtocolMetricsChain>;
  numLiquidityProviders: Scalars['BigInt']['output'];
  poolCount: Scalars['BigInt']['output'];
  surplus24h: Scalars['BigDecimal']['output'];
  swapFee24h: Scalars['BigDecimal']['output'];
  swapVolume24h: Scalars['BigDecimal']['output'];
  totalLiquidity: Scalars['BigDecimal']['output'];
  /** @deprecated No replacement */
  totalSwapFee: Scalars['BigDecimal']['output'];
  /** @deprecated No replacement */
  totalSwapVolume: Scalars['BigDecimal']['output'];
  yieldCapture24h: Scalars['BigDecimal']['output'];
};

export type GqlProtocolMetricsChain = {
  __typename: 'GqlProtocolMetricsChain';
  chainId: Scalars['String']['output'];
  numLiquidityProviders: Scalars['BigInt']['output'];
  poolCount: Scalars['BigInt']['output'];
  surplus24h: Scalars['BigDecimal']['output'];
  swapFee24h: Scalars['BigDecimal']['output'];
  swapVolume24h: Scalars['BigDecimal']['output'];
  totalLiquidity: Scalars['BigDecimal']['output'];
  /** @deprecated No replacement */
  totalSwapFee: Scalars['BigDecimal']['output'];
  /** @deprecated No replacement */
  totalSwapVolume: Scalars['BigDecimal']['output'];
  yieldCapture24h: Scalars['BigDecimal']['output'];
};

export type GqlRelicSnapshot = {
  __typename: 'GqlRelicSnapshot';
  balance: Scalars['String']['output'];
  entryTimestamp: Scalars['Int']['output'];
  farmId: Scalars['String']['output'];
  level: Scalars['Int']['output'];
  relicId: Scalars['Int']['output'];
};

export type GqlReliquaryFarmLevelSnapshot = {
  __typename: 'GqlReliquaryFarmLevelSnapshot';
  balance: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  level: Scalars['String']['output'];
};

export type GqlReliquaryFarmSnapshot = {
  __typename: 'GqlReliquaryFarmSnapshot';
  dailyDeposited: Scalars['String']['output'];
  dailyWithdrawn: Scalars['String']['output'];
  farmId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  levelBalances: Array<GqlReliquaryFarmLevelSnapshot>;
  relicCount: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
  totalBalance: Scalars['String']['output'];
  totalLiquidity: Scalars['String']['output'];
  userCount: Scalars['String']['output'];
};

export type GqlSorCallData = {
  __typename: 'GqlSorCallData';
  /** The call data that needs to be sent to the RPC */
  callData: Scalars['String']['output'];
  /** Maximum amount to be sent for exact out orders */
  maxAmountInRaw?: Maybe<Scalars['String']['output']>;
  /** Minimum amount received for exact in orders */
  minAmountOutRaw?: Maybe<Scalars['String']['output']>;
  /** The target contract to send the call data to */
  to: Scalars['String']['output'];
  /** Value in ETH that needs to be sent for native swaps */
  value: Scalars['BigDecimal']['output'];
};

/** The swap paths for a swap */
export type GqlSorGetSwapPaths = {
  __typename: 'GqlSorGetSwapPaths';
  /**
   * Transaction data that can be posted to an RPC to execute the swap.
   * @deprecated Use Balancer SDK to build swap callData from SOR response
   */
  callData?: Maybe<GqlSorCallData>;
  /** The price of tokenOut in tokenIn. */
  effectivePrice: Scalars['AmountHumanReadable']['output'];
  /** The price of tokenIn in tokenOut. */
  effectivePriceReversed: Scalars['AmountHumanReadable']['output'];
  /** The found paths as needed as input for the b-sdk to execute the swap */
  paths: Array<GqlSorPath>;
  /** Price impact of the path */
  priceImpact: GqlPriceImpact;
  /** The version of the protocol these paths are from */
  protocolVersion: Scalars['Int']['output'];
  /** The return amount in human form. Return amount is either tokenOutAmount (if swapType is exactIn) or tokenInAmount (if swapType is exactOut) */
  returnAmount: Scalars['AmountHumanReadable']['output'];
  /** The return amount in a raw form */
  returnAmountRaw: Scalars['BigDecimal']['output'];
  /** The swap routes including pool information. Used to display by the UI */
  routes: Array<GqlSorSwapRoute>;
  /** The swap amount in human form. Swap amount is either tokenInAmount (if swapType is exactIn) or tokenOutAmount (if swapType is exactOut) */
  swapAmount: Scalars['AmountHumanReadable']['output'];
  /** The swap amount in a raw form */
  swapAmountRaw: Scalars['BigDecimal']['output'];
  /** The swapType that was provided, exact_in vs exact_out (givenIn vs givenOut) */
  swapType: GqlSorSwapType;
  /** Swaps as needed for the vault swap input to execute the swap */
  swaps: Array<GqlSorSwap>;
  /** All token addresses (or assets) as needed for the vault swap input to execute the swap */
  tokenAddresses: Array<Scalars['String']['output']>;
  /** The token address of the tokenIn provided */
  tokenIn: Scalars['String']['output'];
  /** The amount of tokenIn in human form */
  tokenInAmount: Scalars['AmountHumanReadable']['output'];
  /** The token address of the tokenOut provided */
  tokenOut: Scalars['String']['output'];
  /** The amount of tokenOut in human form */
  tokenOutAmount: Scalars['AmountHumanReadable']['output'];
  /**
   * The version of the vault these paths are from
   * @deprecated Use protocolVersion instead
   */
  vaultVersion: Scalars['Int']['output'];
};

/** A path of a swap. A swap can have multiple paths. Used as input to execute the swap via b-sdk */
export type GqlSorPath = {
  __typename: 'GqlSorPath';
  /** Input amount of this path in scaled form */
  inputAmountRaw: Scalars['String']['output'];
  /** A sorted list of booleans that indicate if the respective pool is a buffer */
  isBuffer: Array<Scalars['Boolean']['output']>;
  /** Output amount of this path in scaled form */
  outputAmountRaw: Scalars['String']['output'];
  /** A sorted list of pool ids that are used in this path */
  pools: Array<Scalars['String']['output']>;
  /** The version of the protocol these paths are from */
  protocolVersion: Scalars['Int']['output'];
  /** A sorted list of tokens that are ussed in this path */
  tokens: Array<Token>;
  /**
   * Vault version of this path.
   * @deprecated Use protocolVersion instead
   */
  vaultVersion: Scalars['Int']['output'];
};

/** A single swap step as used for input to the vault to execute a swap */
export type GqlSorSwap = {
  __typename: 'GqlSorSwap';
  /** Amount to be swapped in this step. 0 for chained swap. */
  amount: Scalars['String']['output'];
  /** Index of the asset used in the tokenAddress array. */
  assetInIndex: Scalars['Int']['output'];
  /** Index of the asset used in the tokenAddress array. */
  assetOutIndex: Scalars['Int']['output'];
  /** Pool id used in this swap step */
  poolId: Scalars['String']['output'];
  /** UserData used in this swap, generally uses defaults. */
  userData: Scalars['String']['output'];
};

/** The swap routes including pool information. Used to display by the UI */
export type GqlSorSwapRoute = {
  __typename: 'GqlSorSwapRoute';
  /** The hops this route takes */
  hops: Array<GqlSorSwapRouteHop>;
  /** Share of this route of the total swap */
  share: Scalars['Float']['output'];
  /** Address of the tokenIn */
  tokenIn: Scalars['String']['output'];
  /** Amount of the tokenIn in human form */
  tokenInAmount: Scalars['AmountHumanReadable']['output'];
  /** Address of the tokenOut */
  tokenOut: Scalars['String']['output'];
  /** Amount of the tokenOut in human form */
  tokenOutAmount: Scalars['AmountHumanReadable']['output'];
};

/** A hop of a route. A route can have many hops meaning it traverses more than one pool. */
export type GqlSorSwapRouteHop = {
  __typename: 'GqlSorSwapRouteHop';
  /**
   * The pool entity of this hop.
   * @deprecated No longer supported
   */
  pool: GqlPoolMinimal;
  /** The pool id of this hop. */
  poolId: Scalars['String']['output'];
  /** Address of the tokenIn */
  tokenIn: Scalars['String']['output'];
  /** Amount of the tokenIn in human form */
  tokenInAmount: Scalars['AmountHumanReadable']['output'];
  /** Address of the tokenOut */
  tokenOut: Scalars['String']['output'];
  /** Amount of the tokenOut in human form */
  tokenOutAmount: Scalars['AmountHumanReadable']['output'];
};

export enum GqlSorSwapType {
  ExactIn = 'EXACT_IN',
  ExactOut = 'EXACT_OUT'
}

export type GqlStakedSonicData = {
  __typename: 'GqlStakedSonicData';
  /** A list of all the delegated validators. */
  delegatedValidators: Array<GqlStakedSonicDelegatedValidator>;
  /** Current exchange rate for stS -> S */
  exchangeRate: Scalars['String']['output'];
  /** The total protocol fee collected in the last 24 hours. */
  protocolFee24h: Scalars['String']['output'];
  /** The total rewards claimed in the last 24 hours. */
  rewardsClaimed24h: Scalars['String']['output'];
  /** The current rebasing APR for stS. */
  stakingApr: Scalars['String']['output'];
  /** Total amount of S in custody of stS. Delegated S plus pool S. */
  totalAssets: Scalars['AmountHumanReadable']['output'];
  /** Total amount of S elegated to validators. */
  totalAssetsDelegated: Scalars['AmountHumanReadable']['output'];
  /** Total amount of S in the pool to be delegated. */
  totalAssetsPool: Scalars['AmountHumanReadable']['output'];
};

export type GqlStakedSonicDelegatedValidator = {
  __typename: 'GqlStakedSonicDelegatedValidator';
  /** The amount of S that has been delegated to this validator. */
  assetsDelegated: Scalars['AmountHumanReadable']['output'];
  /** The id of the validator. */
  validatorId: Scalars['String']['output'];
};

export type GqlStakedSonicSnapshot = {
  __typename: 'GqlStakedSonicSnapshot';
  /** Current exchange rate for stS -> S */
  exchangeRate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The total protocol fee collected during that day. */
  protocolFee24h: Scalars['String']['output'];
  /** The total rewards claimed during that day. */
  rewardsClaimed24h: Scalars['String']['output'];
  /** The timestamp of the snapshot. Timestamp is end of day midnight. */
  timestamp: Scalars['Int']['output'];
  /** Total amount of S in custody of stS. Delegated S plus pool S. */
  totalAssets: Scalars['AmountHumanReadable']['output'];
  /** Total amount of S delegated to validators. */
  totalAssetsDelegated: Scalars['AmountHumanReadable']['output'];
  /** Total amount of S in the pool. */
  totalAssetsPool: Scalars['AmountHumanReadable']['output'];
};

export enum GqlStakedSonicSnapshotDataRange {
  AllTime = 'ALL_TIME',
  NinetyDays = 'NINETY_DAYS',
  OneHundredEightyDays = 'ONE_HUNDRED_EIGHTY_DAYS',
  OneYear = 'ONE_YEAR',
  ThirtyDays = 'THIRTY_DAYS'
}

/** Inputs for the call data to create the swap transaction. If this input is given, call data is added to the response. */
export type GqlSwapCallDataInput = {
  /** How long the swap should be valid, provide a timestamp. "999999999999999999" for infinite. Default: infinite */
  deadline?: InputMaybe<Scalars['Int']['input']>;
  /** Who receives the output amount. */
  receiver: Scalars['String']['input'];
  /** Who sends the input amount. */
  sender: Scalars['String']['input'];
  /** The max slippage in percent 0.01 -> 0.01% */
  slippagePercentage: Scalars['String']['input'];
};

/** Represents a token in the system */
export type GqlToken = {
  __typename: 'GqlToken';
  /** The address of the token */
  address: Scalars['String']['output'];
  /** The chain of the token */
  chain: GqlChain;
  /** The chain ID of the token */
  chainId: Scalars['Int']['output'];
  /** The coingecko ID for this token, if present */
  coingeckoId?: Maybe<Scalars['String']['output']>;
  /** The number of decimal places for the token */
  decimals: Scalars['Int']['output'];
  /** The description of the token */
  description?: Maybe<Scalars['String']['output']>;
  /** The Discord URL of the token */
  discordUrl?: Maybe<Scalars['String']['output']>;
  /** The ERC4626 review data for the token */
  erc4626ReviewData?: Maybe<Erc4626ReviewData>;
  /** If it is an ERC4626 token, this defines whether we allow it to use the buffer for pool operations. */
  isBufferAllowed: Scalars['Boolean']['output'];
  /** Whether the token is considered an ERC4626 token. */
  isErc4626: Scalars['Boolean']['output'];
  /** The logo URI of the token */
  logoURI?: Maybe<Scalars['String']['output']>;
  /** If it is an ERC4626 token, this  defines how much can be deposited into the ERC4626 vault. */
  maxDeposit?: Maybe<Scalars['String']['output']>;
  /** The name of the token */
  name: Scalars['String']['output'];
  /** The rate provider data for the token */
  priceRateProviderData?: Maybe<GqlPriceRateProviderData>;
  /** The priority of the token, can be used for sorting. */
  priority: Scalars['Int']['output'];
  /**
   * The rate provider data for the token
   * @deprecated Use priceRateProviderData instead
   */
  rateProviderData?: Maybe<GqlPriceRateProviderData>;
  /** The symbol of the token */
  symbol: Scalars['String']['output'];
  /** The Telegram URL of the token */
  telegramUrl?: Maybe<Scalars['String']['output']>;
  /** Indicates if the token is tradable */
  tradable: Scalars['Boolean']['output'];
  /** The Twitter username of the token */
  twitterUsername?: Maybe<Scalars['String']['output']>;
  types?: Maybe<Array<GqlTokenType>>;
  /** The ERC4626 underlying token address, if applicable. */
  underlyingTokenAddress?: Maybe<Scalars['String']['output']>;
  /** The website URL of the token */
  websiteUrl?: Maybe<Scalars['String']['output']>;
};

export type GqlTokenAmountHumanReadable = {
  address: Scalars['String']['input'];
  amount: Scalars['AmountHumanReadable']['input'];
};

export enum GqlTokenChartDataRange {
  All = 'ALL',
  NinetyDay = 'NINETY_DAY',
  OneHundredEightyDay = 'ONE_HUNDRED_EIGHTY_DAY',
  OneYear = 'ONE_YEAR',
  SevenDay = 'SEVEN_DAY',
  ThirtyDay = 'THIRTY_DAY'
}

/** Represents additional data for a token */
export type GqlTokenDynamicData = {
  __typename: 'GqlTokenDynamicData';
  /** The all-time high price of the token */
  ath: Scalars['Float']['output'];
  /** The all-time low price of the token */
  atl: Scalars['Float']['output'];
  /** The fully diluted valuation of the token */
  fdv?: Maybe<Scalars['String']['output']>;
  /** The highest price in the last 24 hours */
  high24h: Scalars['Float']['output'];
  /** The unique identifier of the dynamic data */
  id: Scalars['String']['output'];
  /** The lowest price in the last 24 hours */
  low24h: Scalars['Float']['output'];
  /** The market capitalization of the token */
  marketCap?: Maybe<Scalars['String']['output']>;
  /** The current price of the token */
  price: Scalars['Float']['output'];
  /** The price change in the last 24 hours */
  priceChange24h: Scalars['Float']['output'];
  /** The percentage price change in the last 7 days */
  priceChangePercent7d?: Maybe<Scalars['Float']['output']>;
  /** The percentage price change in the last 14 days */
  priceChangePercent14d?: Maybe<Scalars['Float']['output']>;
  /** The percentage price change in the last 24 hours */
  priceChangePercent24h: Scalars['Float']['output'];
  /** The percentage price change in the last 30 days */
  priceChangePercent30d?: Maybe<Scalars['Float']['output']>;
  /** The address of the token */
  tokenAddress: Scalars['String']['output'];
  /** The timestamp when the data was last updated */
  updatedAt: Scalars['String']['output'];
};

/** Provide filters for tokens */
export type GqlTokenFilter = {
  /** Only return tokens with these addresses */
  tokensIn?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Filter by token type */
  typeIn?: InputMaybe<Array<GqlTokenType>>;
};

/** Result of the poolReloadPools mutation */
export type GqlTokenMutationResult = {
  __typename: 'GqlTokenMutationResult';
  /** The chain that was reloaded. */
  chain: GqlChain;
  /** The error message */
  error?: Maybe<Scalars['String']['output']>;
  /** Whether it was successful or not. */
  success: Scalars['Boolean']['output'];
};

export type GqlTokenPrice = {
  __typename: 'GqlTokenPrice';
  address: Scalars['String']['output'];
  chain: GqlChain;
  price: Scalars['Float']['output'];
  updatedAt: Scalars['Int']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type GqlTokenPriceChartDataItem = {
  __typename: 'GqlTokenPriceChartDataItem';
  id: Scalars['ID']['output'];
  price: Scalars['AmountHumanReadable']['output'];
  timestamp: Scalars['Int']['output'];
};

export enum GqlTokenType {
  BlockedV2 = 'BLOCKED_V2',
  BlockedV3 = 'BLOCKED_V3',
  Bpt = 'BPT',
  Erc4626 = 'ERC4626',
  PhantomBpt = 'PHANTOM_BPT',
  /** @deprecated Use BLOCKED instead */
  WhiteListed = 'WHITE_LISTED'
}

export type GqlUserStakedBalance = {
  __typename: 'GqlUserStakedBalance';
  /** The staked BPT balance as float. */
  balance: Scalars['AmountHumanReadable']['output'];
  /** The steaked BPT balance in USD as float. */
  balanceUsd: Scalars['Float']['output'];
  /** The id of the staking to match with GqlPoolStaking.id. */
  stakingId: Scalars['String']['output'];
  /** The staking type (Gauge, farm, aura, etc.) in which this balance is staked. */
  stakingType: GqlPoolStakingType;
};

export type GqlVeBalBalance = {
  __typename: 'GqlVeBalBalance';
  balance: Scalars['AmountHumanReadable']['output'];
  chain: GqlChain;
  locked: Scalars['AmountHumanReadable']['output'];
  lockedUsd: Scalars['AmountHumanReadable']['output'];
};

/** Represents a snapshot of a VeBal lock at a specific point in time. */
export type GqlVeBalLockSnapshot = {
  __typename: 'GqlVeBalLockSnapshot';
  /** The locked balance at that time. */
  balance: Scalars['AmountHumanReadable']['output'];
  bias: Scalars['String']['output'];
  slope: Scalars['String']['output'];
  /** The timestamp of the snapshot, snapshots are taking at lock events. */
  timestamp: Scalars['Int']['output'];
};

export type GqlVeBalUserData = {
  __typename: 'GqlVeBalUserData';
  balance: Scalars['AmountHumanReadable']['output'];
  lockSnapshots: Array<GqlVeBalLockSnapshot>;
  locked: Scalars['AmountHumanReadable']['output'];
  lockedUsd: Scalars['AmountHumanReadable']['output'];
  rank?: Maybe<Scalars['Int']['output']>;
};

/** The Gauge that can be voted on through veBAL and that will ultimately receive the rewards. */
export type GqlVotingGauge = {
  __typename: 'GqlVotingGauge';
  /** The timestamp the gauge was added. */
  addedTimestamp?: Maybe<Scalars['Int']['output']>;
  /** The address of the root gauge on Ethereum mainnet. */
  address: Scalars['Bytes']['output'];
  /** The address of the child gauge on the specific chain. */
  childGaugeAddress?: Maybe<Scalars['Bytes']['output']>;
  /** Whether the gauge is killed or not. */
  isKilled: Scalars['Boolean']['output'];
  /** The relative weight the gauge received this epoch (not more than 1.0). */
  relativeWeight: Scalars['String']['output'];
  /** The relative weight cap. 1.0 for uncapped. */
  relativeWeightCap?: Maybe<Scalars['String']['output']>;
};

/** A token inside of a pool with a voting gauge. */
export type GqlVotingGaugeToken = {
  __typename: 'GqlVotingGaugeToken';
  /** The address of the token. */
  address: Scalars['String']['output'];
  /** The URL to the token logo. */
  logoURI: Scalars['String']['output'];
  /** The symbol of the token. */
  symbol: Scalars['String']['output'];
  /** Underlying token address */
  underlyingTokenAddress?: Maybe<Scalars['String']['output']>;
  /** If it is a weighted pool, the weigh of the token is shown here in %. 0.5 = 50%. */
  weight?: Maybe<Scalars['String']['output']>;
};

/** The pool that can be voted on through veBAL */
export type GqlVotingPool = {
  __typename: 'GqlVotingPool';
  /** The address of the pool. */
  address: Scalars['Bytes']['output'];
  /** The chain this pool is on. */
  chain: GqlChain;
  /** The gauge that is connected to the pool and that will receive the rewards. */
  gauge: GqlVotingGauge;
  /** Pool ID */
  id: Scalars['ID']['output'];
  /** Returns all pool tokens, including BPTs and nested pools if there are any. Only one nested level deep. */
  poolTokens: Array<GqlPoolTokenDetail>;
  protocolVersion: Scalars['Int']['output'];
  /** The symbol of the pool. */
  symbol: Scalars['String']['output'];
  /** List of tags assigned by the team based on external factors */
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** The tokens inside the pool. */
  tokens: Array<GqlVotingGaugeToken>;
  /** The type of the pool. */
  type: GqlPoolType;
};

export type HookConfig = {
  __typename: 'HookConfig';
  /** True when hook can change the amounts send to the vault. Necessary to deduct the fees. */
  enableHookAdjustedAmounts: Scalars['Boolean']['output'];
  shouldCallAfterAddLiquidity: Scalars['Boolean']['output'];
  shouldCallAfterInitialize: Scalars['Boolean']['output'];
  shouldCallAfterRemoveLiquidity: Scalars['Boolean']['output'];
  shouldCallAfterSwap: Scalars['Boolean']['output'];
  shouldCallBeforeAddLiquidity: Scalars['Boolean']['output'];
  shouldCallBeforeInitialize: Scalars['Boolean']['output'];
  shouldCallBeforeRemoveLiquidity: Scalars['Boolean']['output'];
  shouldCallBeforeSwap: Scalars['Boolean']['output'];
  shouldCallComputeDynamicSwapFee: Scalars['Boolean']['output'];
};

export type HookParams = ExitFeeHookParams | FeeTakingHookParams | MevTaxHookParams | StableSurgeHookParams;

export type LbpMetadataInput = {
  description: Scalars['String']['input'];
  discord?: InputMaybe<Scalars['String']['input']>;
  farcaster?: InputMaybe<Scalars['String']['input']>;
  lbpName: Scalars['String']['input'];
  telegram?: InputMaybe<Scalars['String']['input']>;
  tokenLogo: Scalars['String']['input'];
  website: Scalars['String']['input'];
  x?: InputMaybe<Scalars['String']['input']>;
};

export type LbpPriceChartData = {
  __typename: 'LBPPriceChartData';
  buyVolume: Scalars['Float']['output'];
  cumulativeFees: Scalars['Float']['output'];
  cumulativeVolume: Scalars['Float']['output'];
  fees: Scalars['Float']['output'];
  projectTokenBalance: Scalars['Float']['output'];
  projectTokenPrice: Scalars['Float']['output'];
  reservePrice: Scalars['Float']['output'];
  reserveTokenBalance: Scalars['Float']['output'];
  sellVolume: Scalars['Float']['output'];
  swapCount: Scalars['Int']['output'];
  timestamp: Scalars['Int']['output'];
  tvl: Scalars['Float']['output'];
  volume: Scalars['Float']['output'];
};

export type LbPoolInput = {
  address: Scalars['String']['input'];
  chain: GqlChain;
};

/** LBP specific params for v3 pools only. */
export type LiquidityBootstrappingPoolV3Params = {
  __typename: 'LiquidityBootstrappingPoolV3Params';
  endTime: Scalars['Int']['output'];
  startTime: Scalars['Int']['output'];
};

/** Liquidity management settings for v3 pools. */
export type LiquidityManagement = {
  __typename: 'LiquidityManagement';
  /** Indicates whether this pool has disabled add and removes of unbalanced/non-proportional liquidity. Meaning it will only support proportional add and remove liquidity. */
  disableUnbalancedLiquidity?: Maybe<Scalars['Boolean']['output']>;
  /** Whether this pool support additional, custom add liquditiy operations apart from proportional, unbalanced and single asset. */
  enableAddLiquidityCustom?: Maybe<Scalars['Boolean']['output']>;
  /** Indicates whether donation is enabled. Meaning you can send funds to the pool without receiving a BPT. */
  enableDonation?: Maybe<Scalars['Boolean']['output']>;
  /** Whether this pool support additional, custom remove liquditiy operations apart from proportional, unbalanced and single asset. */
  enableRemoveLiquidityCustom?: Maybe<Scalars['Boolean']['output']>;
};

/** MevTax hook specific params. Percentage format is 0.01 -> 0.01%. */
export type MevTaxHookParams = {
  __typename: 'MevTaxHookParams';
  maxMevSwapFeePercentage?: Maybe<Scalars['String']['output']>;
  mevTaxMultiplier?: Maybe<Scalars['String']['output']>;
  mevTaxThreshold?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename: 'Mutation';
  beetsPoolLoadReliquarySnapshotsForAllFarms: Scalars['String']['output'];
  createLBP: Scalars['Boolean']['output'];
  lbpReloadFixedLbps: Scalars['String']['output'];
  lbpReloadLbps: Scalars['String']['output'];
  poolLoadOnChainDataForAllPools: Array<GqlPoolMutationResult>;
  poolLoadSnapshotsForPools: Scalars['String']['output'];
  poolReloadAllPoolAprs: Scalars['String']['output'];
  poolReloadPools: Array<GqlPoolMutationResult>;
  poolReloadStakingForAllPools: Scalars['String']['output'];
  poolReloadSwaps: Scalars['String']['output'];
  poolSyncAllPoolsFromSubgraph: Array<Scalars['String']['output']>;
  poolSyncFxQuoteTokens: Array<GqlPoolMutationResult>;
  poolUpdateLiquidityValuesForAllPools: Scalars['String']['output'];
  protocolCacheMetrics: Scalars['String']['output'];
  tokenDeleteTokenType: Scalars['String']['output'];
  tokenReloadAllTokenTypes: Scalars['String']['output'];
  tokenReloadErc4626Tokens: Array<GqlTokenMutationResult>;
  tokenReloadTokenPrices?: Maybe<Scalars['Boolean']['output']>;
  tokenSyncLatestFxPrices: Scalars['String']['output'];
  tokenSyncTokenDefinitions: Scalars['String']['output'];
  userInitStakedBalances: Scalars['String']['output'];
  userInitWalletBalancesForAllPools: Scalars['String']['output'];
  userSyncChangedStakedBalances: Scalars['String']['output'];
  userSyncChangedWalletBalancesForAllPools: Scalars['String']['output'];
  veBalSyncAllUserBalances: Scalars['String']['output'];
  veBalSyncTotalSupply: Scalars['String']['output'];
};


export type MutationBeetsPoolLoadReliquarySnapshotsForAllFarmsArgs = {
  chain: GqlChain;
};


export type MutationCreateLbpArgs = {
  input: CreateLbpInput;
  type?: InputMaybe<GqlPoolType>;
};


export type MutationLbpReloadFixedLbpsArgs = {
  chains: Array<GqlChain>;
};


export type MutationLbpReloadLbpsArgs = {
  chains: Array<GqlChain>;
};


export type MutationPoolLoadOnChainDataForAllPoolsArgs = {
  chains: Array<GqlChain>;
};


export type MutationPoolLoadSnapshotsForPoolsArgs = {
  chain: GqlChain;
  poolId: Scalars['String']['input'];
};


export type MutationPoolReloadAllPoolAprsArgs = {
  chain: GqlChain;
};


export type MutationPoolReloadPoolsArgs = {
  chains: Array<GqlChain>;
};


export type MutationPoolReloadStakingForAllPoolsArgs = {
  chain: GqlChain;
  stakingTypes: Array<GqlPoolStakingType>;
};


export type MutationPoolReloadSwapsArgs = {
  chain: GqlChain;
  poolId: Scalars['String']['input'];
};


export type MutationPoolSyncAllPoolsFromSubgraphArgs = {
  chain: GqlChain;
};


export type MutationPoolSyncFxQuoteTokensArgs = {
  chains: Array<GqlChain>;
};


export type MutationPoolUpdateLiquidityValuesForAllPoolsArgs = {
  chain: GqlChain;
};


export type MutationProtocolCacheMetricsArgs = {
  chain: GqlChain;
};


export type MutationTokenDeleteTokenTypeArgs = {
  chain: GqlChain;
  tokenAddress: Scalars['String']['input'];
  type: GqlTokenType;
};


export type MutationTokenReloadAllTokenTypesArgs = {
  chain: GqlChain;
};


export type MutationTokenReloadErc4626TokensArgs = {
  chains: Array<GqlChain>;
};


export type MutationTokenReloadTokenPricesArgs = {
  chains: Array<GqlChain>;
};


export type MutationTokenSyncLatestFxPricesArgs = {
  chain: GqlChain;
};


export type MutationUserInitStakedBalancesArgs = {
  chain: GqlChain;
  stakingTypes: Array<GqlPoolStakingType>;
};


export type MutationUserInitWalletBalancesForAllPoolsArgs = {
  chain: GqlChain;
};


export type MutationUserSyncChangedStakedBalancesArgs = {
  chain: GqlChain;
};


export type MutationUserSyncChangedWalletBalancesForAllPoolsArgs = {
  chain: GqlChain;
};


export type MutationVeBalSyncAllUserBalancesArgs = {
  chain: GqlChain;
};


export type MutationVeBalSyncTotalSupplyArgs = {
  chain: GqlChain;
};

export type QuantAmmWeightedDetail = {
  __typename: 'QuantAMMWeightedDetail';
  category: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type QuantAmmWeightSnapshot = {
  __typename: 'QuantAmmWeightSnapshot';
  timestamp: Scalars['Int']['output'];
  weights?: Maybe<Array<Scalars['Float']['output']>>;
};

export type QuantAmmWeightedParams = {
  __typename: 'QuantAmmWeightedParams';
  absoluteWeightGuardRail: Scalars['String']['output'];
  details: Array<QuantAmmWeightedDetail>;
  epsilonMax: Scalars['String']['output'];
  lambda: Array<Scalars['String']['output']>;
  lastInterpolationTimePossible: Scalars['String']['output'];
  lastUpdateIntervalTime: Scalars['String']['output'];
  maxTradeSizeRatio: Scalars['String']['output'];
  oracleStalenessThreshold: Scalars['String']['output'];
  poolRegistry: Scalars['String']['output'];
  updateInterval: Scalars['String']['output'];
  weightBlockMultipliers: Array<Scalars['String']['output']>;
  weightsAtLastUpdateInterval: Array<Scalars['String']['output']>;
};

export type Query = {
  __typename: 'Query';
  /** Returns all pools for a given filter, specific for aggregators */
  aggregatorPools: Array<GqlPoolAggregator>;
  beetsPoolGetReliquaryFarmSnapshots: Array<GqlReliquaryFarmSnapshot>;
  fixedLbpPriceChart?: Maybe<Array<LbpPriceChartData>>;
  lbpPriceChart?: Maybe<Array<LbpPriceChartData>>;
  /** Get the LoopS data */
  loopsGetData: GqlLoopsData;
  /** Getting swap, add and remove events with paging */
  poolEvents: Array<GqlPoolEvent>;
  /**
   * Returns all pools for a given filter, specific for aggregators
   * @deprecated Use aggregatorPools instead
   */
  poolGetAggregatorPools: Array<GqlPoolAggregator>;
  /** Returns the list of featured pools for chains */
  poolGetFeaturedPools: Array<GqlPoolFeaturedPool>;
  /** Returns one pool. If a user address is provided, the user balances for the given pool will also be returned. */
  poolGetPool: GqlPoolBase;
  /** Returns all pools for a given filter */
  poolGetPools: Array<GqlPoolMinimal>;
  /** Returns the number of pools for a given filter. */
  poolGetPoolsCount: Scalars['Int']['output'];
  /** Gets all the snapshots for a given pool on a chain for a certain range */
  poolGetSnapshots: Array<GqlPoolSnapshot>;
  protocolMetricsAggregated: GqlProtocolMetricsAggregated;
  protocolMetricsChain: GqlProtocolMetricsChain;
  /** Get swap quote from the SOR v2 */
  sorGetSwapPaths: GqlSorGetSwapPaths;
  /** Get the staking data and status for stS */
  stsGetGqlStakedSonicData: GqlStakedSonicData;
  /** Get snapshots for sftmx staking for a specific range */
  stsGetStakedSonicSnapshots: Array<GqlStakedSonicSnapshot>;
  /** Returns all current prices for allowed tokens for a given chain or chains */
  tokenGetCurrentPrices: Array<GqlTokenPrice>;
  /** Returns the historical prices for a given set of tokens for a given chain and range */
  tokenGetHistoricalPrices: Array<GqlHistoricalTokenPrice>;
  /** Returns the price of a token priced in another token for a given range. */
  tokenGetRelativePriceChartData: Array<GqlTokenPriceChartDataItem>;
  /**
   * Returns dynamic data of a token such as price, market cap, etc.
   * @deprecated Removed without replacement
   */
  tokenGetTokenDynamicData?: Maybe<GqlTokenDynamicData>;
  /** Returns all allowed tokens for a given chain or chains */
  tokenGetTokens: Array<GqlToken>;
  /**
   * Returns dynamic data of a set of tokens such as price, market cap, etc.
   * @deprecated Removed without replacement
   */
  tokenGetTokensDynamicData: Array<GqlTokenDynamicData>;
  veBalGetTotalSupply: Scalars['AmountHumanReadable']['output'];
  veBalGetUser: GqlVeBalUserData;
  veBalGetUserBalance: Scalars['AmountHumanReadable']['output'];
  veBalGetUserBalances: Array<GqlVeBalBalance>;
  /** Returns all pools with veBAL gauges that can be voted on. */
  veBalGetVotingList: Array<GqlVotingPool>;
};


export type QueryAggregatorPoolsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GqlPoolOrderBy>;
  orderDirection?: InputMaybe<GqlPoolOrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<GqlAggregatorPoolFilter>;
};


export type QueryBeetsPoolGetReliquaryFarmSnapshotsArgs = {
  chain: GqlChain;
  id: Scalars['String']['input'];
  range: GqlPoolSnapshotDataRange;
};


export type QueryFixedLbpPriceChartArgs = {
  chain: GqlChain;
  dataPoints?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['String']['input'];
};


export type QueryLbpPriceChartArgs = {
  chain: GqlChain;
  dataPoints?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['String']['input'];
};


export type QueryPoolEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<GqlPoolEventsFilter>;
};


export type QueryPoolGetAggregatorPoolsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GqlPoolOrderBy>;
  orderDirection?: InputMaybe<GqlPoolOrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<GqlPoolFilter>;
};


export type QueryPoolGetFeaturedPoolsArgs = {
  chains: Array<GqlChain>;
};


export type QueryPoolGetPoolArgs = {
  chain: GqlChain;
  id: Scalars['String']['input'];
  userAddress?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPoolGetPoolsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GqlPoolOrderBy>;
  orderDirection?: InputMaybe<GqlPoolOrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  textSearch?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<GqlPoolFilter>;
};


export type QueryPoolGetPoolsCountArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GqlPoolOrderBy>;
  orderDirection?: InputMaybe<GqlPoolOrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  textSearch?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<GqlPoolFilter>;
};


export type QueryPoolGetSnapshotsArgs = {
  chain: GqlChain;
  id: Scalars['String']['input'];
  range: GqlPoolSnapshotDataRange;
};


export type QueryProtocolMetricsAggregatedArgs = {
  chains: Array<GqlChain>;
};


export type QueryProtocolMetricsChainArgs = {
  chain: GqlChain;
};


export type QuerySorGetSwapPathsArgs = {
  chain: GqlChain;
  considerPoolsWithHooks?: InputMaybe<Scalars['Boolean']['input']>;
  poolIds?: InputMaybe<Array<Scalars['String']['input']>>;
  swapAmount: Scalars['AmountHumanReadable']['input'];
  swapType: GqlSorSwapType;
  tokenIn: Scalars['String']['input'];
  tokenOut: Scalars['String']['input'];
  useProtocolVersion?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStsGetStakedSonicSnapshotsArgs = {
  range: GqlStakedSonicSnapshotDataRange;
};


export type QueryTokenGetCurrentPricesArgs = {
  chains: Array<GqlChain>;
};


export type QueryTokenGetHistoricalPricesArgs = {
  addresses: Array<Scalars['String']['input']>;
  chain: GqlChain;
  range: GqlTokenChartDataRange;
};


export type QueryTokenGetRelativePriceChartDataArgs = {
  chain: GqlChain;
  range: GqlTokenChartDataRange;
  tokenIn: Scalars['String']['input'];
  tokenOut: Scalars['String']['input'];
};


export type QueryTokenGetTokenDynamicDataArgs = {
  address: Scalars['String']['input'];
  chain: GqlChain;
};


export type QueryTokenGetTokensArgs = {
  chains: Array<GqlChain>;
  where?: InputMaybe<GqlTokenFilter>;
};


export type QueryTokenGetTokensDynamicDataArgs = {
  addresses: Array<Scalars['String']['input']>;
  chain: GqlChain;
};


export type QueryVeBalGetTotalSupplyArgs = {
  chain: GqlChain;
};


export type QueryVeBalGetUserArgs = {
  address: Scalars['String']['input'];
  chain: GqlChain;
};


export type QueryVeBalGetUserBalanceArgs = {
  address: Scalars['String']['input'];
  chain: GqlChain;
};


export type QueryVeBalGetUserBalancesArgs = {
  address: Scalars['String']['input'];
  chains: Array<GqlChain>;
};


export type QueryVeBalGetVotingListArgs = {
  includeKilled?: InputMaybe<Scalars['Boolean']['input']>;
};

/** StableSurge hook specific params. Percentage format is 0.01 -> 0.01%. */
export type StableSurgeHookParams = {
  __typename: 'StableSurgeHookParams';
  maxSurgeFeePercentage?: Maybe<Scalars['String']['output']>;
  surgeThresholdPercentage?: Maybe<Scalars['String']['output']>;
};

export type Token = {
  __typename: 'Token';
  address: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
};

export type CurrentTokenPricesQueryVariables = Exact<{
  chains: Array<GqlChain> | GqlChain;
}>;


export type CurrentTokenPricesQuery = { __typename: 'Query', tokenGetCurrentPrices: Array<{ __typename: 'GqlTokenPrice', address: string, price: number, chain: GqlChain }> };

export type GetPoolQueryVariables = Exact<{
  id: Scalars['String']['input'];
  chain: GqlChain;
}>;


export type GetPoolQuery = { __typename: 'Query', pool: { __typename: 'GqlPoolComposableStable', address: string, chain: GqlChain, createTime: number, decimals: number, factory?: string | null, hasErc4626: boolean, hasNestedErc4626: boolean, id: string, name: string, owner?: string | null, pauseManager?: string | null, poolCreator?: string | null, protocolVersion: number, swapFeeManager?: string | null, symbol: string, tags?: Array<string | null> | null, type: GqlPoolType, version: number, dynamicData: { __typename: 'GqlPoolDynamicData', fees24h: string, holdersCount: string, isInRecoveryMode: boolean, isPaused: boolean, poolId: string, surplus24h: string, swapEnabled: boolean, swapFee: string, totalLiquidity: string, totalShares: string, volume24h: string, aprItems: Array<{ __typename: 'GqlPoolAprItem', apr: number, id: string, rewardTokenAddress?: string | null, rewardTokenSymbol?: string | null, title: string, type: GqlPoolAprItemType }> } } | { __typename: 'GqlPoolElement', address: string, chain: GqlChain, createTime: number, decimals: number, factory?: string | null, hasErc4626: boolean, hasNestedErc4626: boolean, id: string, name: string, owner?: string | null, pauseManager?: string | null, poolCreator?: string | null, protocolVersion: number, swapFeeManager?: string | null, symbol: string, tags?: Array<string | null> | null, type: GqlPoolType, version: number, dynamicData: { __typename: 'GqlPoolDynamicData', fees24h: string, holdersCount: string, isInRecoveryMode: boolean, isPaused: boolean, poolId: string, surplus24h: string, swapEnabled: boolean, swapFee: string, totalLiquidity: string, totalShares: string, volume24h: string, aprItems: Array<{ __typename: 'GqlPoolAprItem', apr: number, id: string, rewardTokenAddress?: string | null, rewardTokenSymbol?: string | null, title: string, type: GqlPoolAprItemType }> } } | { __typename: 'GqlPoolFixedPriceLBP', address: string, chain: GqlChain, createTime: number, decimals: number, factory?: string | null, hasErc4626: boolean, hasNestedErc4626: boolean, id: string, name: string, owner?: string | null, pauseManager?: string | null, poolCreator?: string | null, protocolVersion: number, swapFeeManager?: string | null, symbol: string, tags?: Array<string | null> | null, type: GqlPoolType, version: number, dynamicData: { __typename: 'GqlPoolDynamicData', fees24h: string, holdersCount: string, isInRecoveryMode: boolean, isPaused: boolean, poolId: string, surplus24h: string, swapEnabled: boolean, swapFee: string, totalLiquidity: string, totalShares: string, volume24h: string, aprItems: Array<{ __typename: 'GqlPoolAprItem', apr: number, id: string, rewardTokenAddress?: string | null, rewardTokenSymbol?: string | null, title: string, type: GqlPoolAprItemType }> } } | { __typename: 'GqlPoolFx', address: string, chain: GqlChain, createTime: number, decimals: number, factory?: string | null, hasErc4626: boolean, hasNestedErc4626: boolean, id: string, name: string, owner?: string | null, pauseManager?: string | null, poolCreator?: string | null, protocolVersion: number, swapFeeManager?: string | null, symbol: string, tags?: Array<string | null> | null, type: GqlPoolType, version: number, dynamicData: { __typename: 'GqlPoolDynamicData', fees24h: string, holdersCount: string, isInRecoveryMode: boolean, isPaused: boolean, poolId: string, surplus24h: string, swapEnabled: boolean, swapFee: string, totalLiquidity: string, totalShares: string, volume24h: string, aprItems: Array<{ __typename: 'GqlPoolAprItem', apr: number, id: string, rewardTokenAddress?: string | null, rewardTokenSymbol?: string | null, title: string, type: GqlPoolAprItemType }> } } | { __typename: 'GqlPoolGyro', address: string, chain: GqlChain, createTime: number, decimals: number, factory?: string | null, hasErc4626: boolean, hasNestedErc4626: boolean, id: string, name: string, owner?: string | null, pauseManager?: string | null, poolCreator?: string | null, protocolVersion: number, swapFeeManager?: string | null, symbol: string, tags?: Array<string | null> | null, type: GqlPoolType, version: number, dynamicData: { __typename: 'GqlPoolDynamicData', fees24h: string, holdersCount: string, isInRecoveryMode: boolean, isPaused: boolean, poolId: string, surplus24h: string, swapEnabled: boolean, swapFee: string, totalLiquidity: string, totalShares: string, volume24h: string, aprItems: Array<{ __typename: 'GqlPoolAprItem', apr: number, id: string, rewardTokenAddress?: string | null, rewardTokenSymbol?: string | null, title: string, type: GqlPoolAprItemType }> } } | { __typename: 'GqlPoolLiquidityBootstrapping', address: string, chain: GqlChain, createTime: number, decimals: number, factory?: string | null, hasErc4626: boolean, hasNestedErc4626: boolean, id: string, name: string, owner?: string | null, pauseManager?: string | null, poolCreator?: string | null, protocolVersion: number, swapFeeManager?: string | null, symbol: string, tags?: Array<string | null> | null, type: GqlPoolType, version: number, dynamicData: { __typename: 'GqlPoolDynamicData', fees24h: string, holdersCount: string, isInRecoveryMode: boolean, isPaused: boolean, poolId: string, surplus24h: string, swapEnabled: boolean, swapFee: string, totalLiquidity: string, totalShares: string, volume24h: string, aprItems: Array<{ __typename: 'GqlPoolAprItem', apr: number, id: string, rewardTokenAddress?: string | null, rewardTokenSymbol?: string | null, title: string, type: GqlPoolAprItemType }> } } | { __typename: 'GqlPoolLiquidityBootstrappingV3', address: string, chain: GqlChain, createTime: number, decimals: number, factory?: string | null, hasErc4626: boolean, hasNestedErc4626: boolean, id: string, name: string, owner?: string | null, pauseManager?: string | null, poolCreator?: string | null, protocolVersion: number, swapFeeManager?: string | null, symbol: string, tags?: Array<string | null> | null, type: GqlPoolType, version: number, dynamicData: { __typename: 'GqlPoolDynamicData', fees24h: string, holdersCount: string, isInRecoveryMode: boolean, isPaused: boolean, poolId: string, surplus24h: string, swapEnabled: boolean, swapFee: string, totalLiquidity: string, totalShares: string, volume24h: string, aprItems: Array<{ __typename: 'GqlPoolAprItem', apr: number, id: string, rewardTokenAddress?: string | null, rewardTokenSymbol?: string | null, title: string, type: GqlPoolAprItemType }> } } | { __typename: 'GqlPoolMetaStable', address: string, chain: GqlChain, createTime: number, decimals: number, factory?: string | null, hasErc4626: boolean, hasNestedErc4626: boolean, id: string, name: string, owner?: string | null, pauseManager?: string | null, poolCreator?: string | null, protocolVersion: number, swapFeeManager?: string | null, symbol: string, tags?: Array<string | null> | null, type: GqlPoolType, version: number, dynamicData: { __typename: 'GqlPoolDynamicData', fees24h: string, holdersCount: string, isInRecoveryMode: boolean, isPaused: boolean, poolId: string, surplus24h: string, swapEnabled: boolean, swapFee: string, totalLiquidity: string, totalShares: string, volume24h: string, aprItems: Array<{ __typename: 'GqlPoolAprItem', apr: number, id: string, rewardTokenAddress?: string | null, rewardTokenSymbol?: string | null, title: string, type: GqlPoolAprItemType }> } } | { __typename: 'GqlPoolQuantAmmWeighted', address: string, chain: GqlChain, createTime: number, decimals: number, factory?: string | null, hasErc4626: boolean, hasNestedErc4626: boolean, id: string, name: string, owner?: string | null, pauseManager?: string | null, poolCreator?: string | null, protocolVersion: number, swapFeeManager?: string | null, symbol: string, tags?: Array<string | null> | null, type: GqlPoolType, version: number, dynamicData: { __typename: 'GqlPoolDynamicData', fees24h: string, holdersCount: string, isInRecoveryMode: boolean, isPaused: boolean, poolId: string, surplus24h: string, swapEnabled: boolean, swapFee: string, totalLiquidity: string, totalShares: string, volume24h: string, aprItems: Array<{ __typename: 'GqlPoolAprItem', apr: number, id: string, rewardTokenAddress?: string | null, rewardTokenSymbol?: string | null, title: string, type: GqlPoolAprItemType }> } } | { __typename: 'GqlPoolReClamm', centerednessMargin: string, currentFourthRootPriceRatio: string, dailyPriceShiftBase: string, endFourthRootPriceRatio: string, hasAnyAllowedBuffer: boolean, lastTimestamp: number, lastVirtualBalances: Array<string>, priceRatioUpdateEndTime: number, priceRatioUpdateStartTime: number, startFourthRootPriceRatio: string, address: string, chain: GqlChain, createTime: number, decimals: number, factory?: string | null, hasErc4626: boolean, hasNestedErc4626: boolean, id: string, name: string, owner?: string | null, pauseManager?: string | null, poolCreator?: string | null, protocolVersion: number, swapFeeManager?: string | null, symbol: string, tags?: Array<string | null> | null, type: GqlPoolType, version: number, dynamicData: { __typename: 'GqlPoolDynamicData', fees24h: string, holdersCount: string, isInRecoveryMode: boolean, isPaused: boolean, poolId: string, surplus24h: string, swapEnabled: boolean, swapFee: string, totalLiquidity: string, totalShares: string, volume24h: string, aprItems: Array<{ __typename: 'GqlPoolAprItem', apr: number, id: string, rewardTokenAddress?: string | null, rewardTokenSymbol?: string | null, title: string, type: GqlPoolAprItemType }> } } | { __typename: 'GqlPoolStable', address: string, chain: GqlChain, createTime: number, decimals: number, factory?: string | null, hasErc4626: boolean, hasNestedErc4626: boolean, id: string, name: string, owner?: string | null, pauseManager?: string | null, poolCreator?: string | null, protocolVersion: number, swapFeeManager?: string | null, symbol: string, tags?: Array<string | null> | null, type: GqlPoolType, version: number, dynamicData: { __typename: 'GqlPoolDynamicData', fees24h: string, holdersCount: string, isInRecoveryMode: boolean, isPaused: boolean, poolId: string, surplus24h: string, swapEnabled: boolean, swapFee: string, totalLiquidity: string, totalShares: string, volume24h: string, aprItems: Array<{ __typename: 'GqlPoolAprItem', apr: number, id: string, rewardTokenAddress?: string | null, rewardTokenSymbol?: string | null, title: string, type: GqlPoolAprItemType }> } } | { __typename: 'GqlPoolWeighted', address: string, chain: GqlChain, createTime: number, decimals: number, factory?: string | null, hasErc4626: boolean, hasNestedErc4626: boolean, id: string, name: string, owner?: string | null, pauseManager?: string | null, poolCreator?: string | null, protocolVersion: number, swapFeeManager?: string | null, symbol: string, tags?: Array<string | null> | null, type: GqlPoolType, version: number, dynamicData: { __typename: 'GqlPoolDynamicData', fees24h: string, holdersCount: string, isInRecoveryMode: boolean, isPaused: boolean, poolId: string, surplus24h: string, swapEnabled: boolean, swapFee: string, totalLiquidity: string, totalShares: string, volume24h: string, aprItems: Array<{ __typename: 'GqlPoolAprItem', apr: number, id: string, rewardTokenAddress?: string | null, rewardTokenSymbol?: string | null, title: string, type: GqlPoolAprItemType }> } } };

export type GetPoolsQueryVariables = Exact<{
  chainIn?: InputMaybe<Array<GqlChain> | GqlChain>;
}>;


export type GetPoolsQuery = { __typename: 'Query', poolGetPools: Array<{ __typename: 'GqlPoolMinimal', chain: GqlChain, protocolVersion: number, address: string, id: string, name: string, symbol: string, type: GqlPoolType, version: number, createTime: number, swapFeeManager?: string | null, staking?: { __typename: 'GqlPoolStaking', gauge?: { __typename: 'GqlPoolStakingGauge', id: string } | null } | null, dynamicData: { __typename: 'GqlPoolDynamicData', swapFee: string, poolId: string } }> };

export type GetV3PoolsQueryVariables = Exact<{
  chainIn?: InputMaybe<Array<GqlChain> | GqlChain>;
  chainNotIn?: InputMaybe<Array<GqlChain> | GqlChain>;
  tagIn?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  poolTypeIn?: InputMaybe<Array<GqlPoolType> | GqlPoolType>;
}>;


export type GetV3PoolsQuery = { __typename: 'Query', poolGetPools: Array<{ __typename: 'GqlPoolMinimal', id: string, chain: GqlChain, protocolVersion: number, address: string, name: string, symbol: string, type: GqlPoolType, version: number, createTime: number, swapFeeManager?: string | null, tags?: Array<string | null> | null, hasErc4626: boolean, hasAnyAllowedBuffer: boolean, dynamicData: { __typename: 'GqlPoolDynamicData', swapFee: string, poolId: string, totalLiquidity: string, volume24h: string, aggregateSwapFee: string, aggregateYieldFee: string, isPaused: boolean, isInRecoveryMode: boolean }, poolTokens: Array<{ __typename: 'GqlPoolTokenDetail', chain?: GqlChain | null, chainId?: number | null, address: string, weight?: string | null, symbol: string, name: string, decimals: number, isErc4626: boolean, logoURI?: string | null, useUnderlyingForAddRemove?: boolean | null, balance: string, balanceUSD: string, scalingFactor?: string | null, priceRate: string, underlyingToken?: { __typename: 'GqlToken', chainId: number, address: string, name: string, symbol: string, decimals: number, isErc4626: boolean } | null }> }> };

export type GetV3PoolsWithHooksQueryVariables = Exact<{
  chainIn?: InputMaybe<Array<GqlChain> | GqlChain>;
  chainNotIn?: InputMaybe<Array<GqlChain> | GqlChain>;
  tagIn?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetV3PoolsWithHooksQuery = { __typename: 'Query', poolGetPools: Array<{ __typename: 'GqlPoolMinimal', id: string, address: string, chain: GqlChain, protocolVersion: number, name: string, symbol: string, type: GqlPoolType, version: number, createTime: number, swapFeeManager?: string | null, poolTokens: Array<{ __typename: 'GqlPoolTokenDetail', symbol: string, balance: string, balanceUSD: string, logoURI?: string | null }>, dynamicData: { __typename: 'GqlPoolDynamicData', totalLiquidity: string, volume24h: string, poolId: string, swapFee: string }, hook?: { __typename: 'GqlHook', address: string, type: GqlHookType, params?: { __typename: 'ExitFeeHookParams' } | { __typename: 'FeeTakingHookParams' } | { __typename: 'MevTaxHookParams', maxMevSwapFeePercentage?: string | null, mevTaxMultiplier?: string | null, mevTaxThreshold?: string | null } | { __typename: 'StableSurgeHookParams', maxSurgeFeePercentage?: string | null, surgeThresholdPercentage?: string | null } | null } | null }> };

export type GetPoolsWithGaugesQueryVariables = Exact<{
  chainIn?: InputMaybe<Array<GqlChain> | GqlChain>;
}>;


export type GetPoolsWithGaugesQuery = { __typename: 'Query', poolGetPools: Array<{ __typename: 'GqlPoolMinimal', chain: GqlChain, protocolVersion: number, address: string, id: string, name: string, symbol: string, type: GqlPoolType, version: number, createTime: number, swapFeeManager?: string | null, staking?: { __typename: 'GqlPoolStaking', gauge?: { __typename: 'GqlPoolStakingGauge', id: string } | null } | null, dynamicData: { __typename: 'GqlPoolDynamicData', swapFee: string, poolId: string } }> };

export type GetTokensQueryVariables = Exact<{
  chainIn: Array<GqlChain> | GqlChain;
  tokensIn?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  typeIn?: InputMaybe<Array<GqlTokenType> | GqlTokenType>;
}>;


export type GetTokensQuery = { __typename: 'Query', tokenGetTokens: Array<{ __typename: 'GqlToken', chain: GqlChain, chainId: number, address: string, name: string, symbol: string, decimals: number, logoURI?: string | null, isErc4626: boolean, isBufferAllowed: boolean, underlyingTokenAddress?: string | null, erc4626ReviewData?: { __typename: 'Erc4626ReviewData', canUseBufferForSwaps?: boolean | null } | null }> };

export type VeBalGetVotingGaugesQueryVariables = Exact<{ [key: string]: never; }>;


export type VeBalGetVotingGaugesQuery = { __typename: 'Query', veBalGetVotingList: Array<{ __typename: 'GqlVotingPool', id: string, address: string, chain: GqlChain, type: GqlPoolType, symbol: string, gauge: { __typename: 'GqlVotingGauge', address: string, childGaugeAddress?: string | null, isKilled: boolean, relativeWeightCap?: string | null, addedTimestamp?: number | null }, tokens: Array<{ __typename: 'GqlVotingGaugeToken', address: string, logoURI: string, symbol: string, weight?: string | null }> }> };


export const CurrentTokenPricesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentTokenPrices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chains"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GqlChain"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tokenGetCurrentPrices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chains"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chains"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"chain"}}]}}]}}]} as unknown as DocumentNode<CurrentTokenPricesQuery, CurrentTokenPricesQueryVariables>;
export const GetPoolDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPool"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GqlChain"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"pool"},"name":{"kind":"Name","value":"poolGetPool"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"chain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"chain"}},{"kind":"Field","name":{"kind":"Name","value":"createTime"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aprItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"apr"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rewardTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"rewardTokenSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fees24h"}},{"kind":"Field","name":{"kind":"Name","value":"holdersCount"}},{"kind":"Field","name":{"kind":"Name","value":"isInRecoveryMode"}},{"kind":"Field","name":{"kind":"Name","value":"isPaused"}},{"kind":"Field","name":{"kind":"Name","value":"poolId"}},{"kind":"Field","name":{"kind":"Name","value":"surplus24h"}},{"kind":"Field","name":{"kind":"Name","value":"swapEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"swapFee"}},{"kind":"Field","name":{"kind":"Name","value":"totalLiquidity"}},{"kind":"Field","name":{"kind":"Name","value":"totalShares"}},{"kind":"Field","name":{"kind":"Name","value":"volume24h"}}]}},{"kind":"Field","name":{"kind":"Name","value":"factory"}},{"kind":"Field","name":{"kind":"Name","value":"hasErc4626"}},{"kind":"Field","name":{"kind":"Name","value":"hasNestedErc4626"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"}},{"kind":"Field","name":{"kind":"Name","value":"pauseManager"}},{"kind":"Field","name":{"kind":"Name","value":"poolCreator"}},{"kind":"Field","name":{"kind":"Name","value":"protocolVersion"}},{"kind":"Field","name":{"kind":"Name","value":"swapFeeManager"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GqlPoolReClamm"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"centerednessMargin"}},{"kind":"Field","name":{"kind":"Name","value":"currentFourthRootPriceRatio"}},{"kind":"Field","name":{"kind":"Name","value":"dailyPriceShiftBase"}},{"kind":"Field","name":{"kind":"Name","value":"endFourthRootPriceRatio"}},{"kind":"Field","name":{"kind":"Name","value":"hasAnyAllowedBuffer"}},{"kind":"Field","name":{"kind":"Name","value":"lastTimestamp"}},{"kind":"Field","name":{"kind":"Name","value":"lastVirtualBalances"}},{"kind":"Field","name":{"kind":"Name","value":"priceRatioUpdateEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"priceRatioUpdateStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"startFourthRootPriceRatio"}}]}}]}}]}}]} as unknown as DocumentNode<GetPoolQuery, GetPoolQueryVariables>;
export const GetPoolsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPools"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chainIn"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GqlChain"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"poolGetPools"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"chainIn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chainIn"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"totalLiquidity"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chain"}},{"kind":"Field","name":{"kind":"Name","value":"protocolVersion"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"createTime"}},{"kind":"Field","name":{"kind":"Name","value":"swapFeeManager"}},{"kind":"Field","name":{"kind":"Name","value":"staking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gauge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dynamicData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swapFee"}},{"kind":"Field","name":{"kind":"Name","value":"poolId"}}]}}]}}]}}]} as unknown as DocumentNode<GetPoolsQuery, GetPoolsQueryVariables>;
export const GetV3PoolsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetV3Pools"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chainIn"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GqlChain"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chainNotIn"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GqlChain"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tagIn"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"poolTypeIn"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GqlPoolType"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"poolGetPools"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"chainIn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chainIn"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"chainNotIn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chainNotIn"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"protocolVersionIn"},"value":{"kind":"ListValue","values":[{"kind":"IntValue","value":"3"}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"tagIn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tagIn"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"poolTypeIn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"poolTypeIn"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"totalLiquidity"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chain"}},{"kind":"Field","name":{"kind":"Name","value":"protocolVersion"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"createTime"}},{"kind":"Field","name":{"kind":"Name","value":"swapFeeManager"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"hasErc4626"}},{"kind":"Field","name":{"kind":"Name","value":"hasAnyAllowedBuffer"}},{"kind":"Field","name":{"kind":"Name","value":"dynamicData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swapFee"}},{"kind":"Field","name":{"kind":"Name","value":"poolId"}},{"kind":"Field","name":{"kind":"Name","value":"totalLiquidity"}},{"kind":"Field","name":{"kind":"Name","value":"volume24h"}},{"kind":"Field","name":{"kind":"Name","value":"aggregateSwapFee"}},{"kind":"Field","name":{"kind":"Name","value":"aggregateYieldFee"}},{"kind":"Field","name":{"kind":"Name","value":"isPaused"}},{"kind":"Field","name":{"kind":"Name","value":"isInRecoveryMode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"poolTokens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chain"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"isErc4626"}},{"kind":"Field","name":{"kind":"Name","value":"logoURI"}},{"kind":"Field","name":{"kind":"Name","value":"useUnderlyingForAddRemove"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"balanceUSD"}},{"kind":"Field","name":{"kind":"Name","value":"underlyingToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"isErc4626"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scalingFactor"}},{"kind":"Field","name":{"kind":"Name","value":"priceRate"}}]}}]}}]}}]} as unknown as DocumentNode<GetV3PoolsQuery, GetV3PoolsQueryVariables>;
export const GetV3PoolsWithHooksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetV3PoolsWithHooks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chainIn"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GqlChain"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chainNotIn"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GqlChain"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tagIn"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"poolGetPools"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"chainIn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chainIn"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"chainNotIn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chainNotIn"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"protocolVersionIn"},"value":{"kind":"ListValue","values":[{"kind":"IntValue","value":"3"}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"tagIn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tagIn"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"totalLiquidity"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"chain"}},{"kind":"Field","name":{"kind":"Name","value":"protocolVersion"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"createTime"}},{"kind":"Field","name":{"kind":"Name","value":"swapFeeManager"}},{"kind":"Field","name":{"kind":"Name","value":"poolTokens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"balanceUSD"}},{"kind":"Field","name":{"kind":"Name","value":"logoURI"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dynamicData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalLiquidity"}},{"kind":"Field","name":{"kind":"Name","value":"volume24h"}},{"kind":"Field","name":{"kind":"Name","value":"poolId"}},{"kind":"Field","name":{"kind":"Name","value":"swapFee"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hook"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"params"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StableSurgeHookParams"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maxSurgeFeePercentage"}},{"kind":"Field","name":{"kind":"Name","value":"surgeThresholdPercentage"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MevTaxHookParams"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maxMevSwapFeePercentage"}},{"kind":"Field","name":{"kind":"Name","value":"mevTaxMultiplier"}},{"kind":"Field","name":{"kind":"Name","value":"mevTaxThreshold"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetV3PoolsWithHooksQuery, GetV3PoolsWithHooksQueryVariables>;
export const GetPoolsWithGaugesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPoolsWithGauges"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chainIn"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GqlChain"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"poolGetPools"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"chainIn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chainIn"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"EnumValue","value":"totalLiquidity"}},{"kind":"Argument","name":{"kind":"Name","value":"orderDirection"},"value":{"kind":"EnumValue","value":"desc"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chain"}},{"kind":"Field","name":{"kind":"Name","value":"protocolVersion"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"createTime"}},{"kind":"Field","name":{"kind":"Name","value":"swapFeeManager"}},{"kind":"Field","name":{"kind":"Name","value":"staking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gauge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"dynamicData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swapFee"}},{"kind":"Field","name":{"kind":"Name","value":"poolId"}}]}}]}}]}}]} as unknown as DocumentNode<GetPoolsWithGaugesQuery, GetPoolsWithGaugesQueryVariables>;
export const GetTokensDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTokens"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chainIn"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GqlChain"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tokensIn"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"typeIn"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GqlTokenType"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tokenGetTokens"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chains"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chainIn"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"tokensIn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tokensIn"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"typeIn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"typeIn"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chain"}},{"kind":"Field","name":{"kind":"Name","value":"chainId"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"decimals"}},{"kind":"Field","name":{"kind":"Name","value":"logoURI"}},{"kind":"Field","name":{"kind":"Name","value":"isErc4626"}},{"kind":"Field","name":{"kind":"Name","value":"isBufferAllowed"}},{"kind":"Field","name":{"kind":"Name","value":"underlyingTokenAddress"}},{"kind":"Field","name":{"kind":"Name","value":"erc4626ReviewData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canUseBufferForSwaps"}}]}}]}}]}}]} as unknown as DocumentNode<GetTokensQuery, GetTokensQueryVariables>;
export const VeBalGetVotingGaugesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VeBalGetVotingGauges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"veBalGetVotingList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"chain"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"gauge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"childGaugeAddress"}},{"kind":"Field","name":{"kind":"Name","value":"isKilled"}},{"kind":"Field","name":{"kind":"Name","value":"relativeWeightCap"}},{"kind":"Field","name":{"kind":"Name","value":"addedTimestamp"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tokens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"logoURI"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}}]}}]}}]}}]} as unknown as DocumentNode<VeBalGetVotingGaugesQuery, VeBalGetVotingGaugesQueryVariables>;