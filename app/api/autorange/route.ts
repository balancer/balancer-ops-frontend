import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";
import { networks } from "@/constants/constants";
import { reClammPoolAbi } from "@/abi/ReclammPool";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const poolAddress = searchParams.get("poolAddress");
  const network = searchParams.get("network");

  if (!poolAddress || !network) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  const rpcUrl = `${networks[network].rpc}${process.env.DRPC_API_KEY}`;
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  try {
    const contract = new ethers.Contract(poolAddress, reClammPoolAbi, provider);

    const [
      priceRange,
      virtualBalances,
      liveBalances,
      centerednessMargin,
      isPoolWithinTargetRange,
      dailyPriceShiftExponent,
      currentPriceRatio,
    ] = await Promise.all([
      contract.computeCurrentPriceRange(),
      contract.computeCurrentVirtualBalances(),
      contract.getCurrentLiveBalances(),
      contract.getCenterednessMargin(),
      contract.isPoolWithinTargetRange(),
      contract.getDailyPriceShiftExponent(),
      contract.computeCurrentPriceRatio(),
    ]);

    return NextResponse.json(
      {
        priceRange: priceRange.map((value: any) => value.toString()),
        virtualBalances: {
          virtualBalanceA: virtualBalances[0].toString(),
          virtualBalanceB: virtualBalances[1].toString(),
        },
        liveBalances: {
          liveBalanceA: liveBalances[0].toString(),
          liveBalanceB: liveBalances[1].toString(),
        },
        centerednessMargin: centerednessMargin.toString(),
        isPoolWithinTargetRange: isPoolWithinTargetRange,
        dailyPriceShiftExponent: dailyPriceShiftExponent.toString(),
        currentPriceRatio: currentPriceRatio.toString(),
      },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate" } },
    );
  } catch (error) {
    console.error("Error fetching AutoRange compute data:", error);
    return NextResponse.json({ error: "Failed to fetch AutoRange compute data" }, { status: 500 });
  }
}
