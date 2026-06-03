const FIXED_POINT_ONE = BigInt("1000000000000000000"); // 1e18 (18 decimal fixed point)
const PRICE_SHIFT_EXPONENT_INTERNAL_ADJUSTMENT = BigInt("124649");

// Old-factory AutoRange (ReCLAMM) pools that are still active on-chain (not paused)
// but should be hidden from the viewer + payload builder. Keyed by lowercased GraphQL chain.
const AUTORANGE_POOL_BLACKLIST: Record<string, string[]> = {
  base: [
    "0x840cd35783c3ec26437b257a2ca9af592e368f76",
    "0x7597ca4f6669878884b35b375b90bd023e062216",
  ],
};

export const isBlacklistedAutoRangePool = (chain: string, address: string): boolean => {
  const entries = AUTORANGE_POOL_BLACKLIST[chain?.toLowerCase()];
  if (!entries) return false;
  return entries.includes(address.toLowerCase());
};

/**
 * Converts daily price shift base from API (decimal) to daily price shift exponent
 * @param dailyPriceShiftBase - The daily price shift base value from API as number (e.g., 0.999999197747274347)
 * @returns The daily price shift exponent as BigInt
 */
export const getDailyPriceShiftExponent = (dailyPriceShiftBase: number): bigint => {
  // Convert API decimal to contract integer format (multiply by 1e18)
  const normalizedDailyPriceShiftBase = BigInt(Math.floor(dailyPriceShiftBase * 1e18));

  // Perform the same calculation as in smart contract
  return (
    (FIXED_POINT_ONE - normalizedDailyPriceShiftBase) * PRICE_SHIFT_EXPONENT_INTERNAL_ADJUSTMENT
  );
};
