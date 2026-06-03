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

    const isPoolWithinTargetRange = await contract.isPoolWithinTargetRange();

    return NextResponse.json(
      { isPoolWithinTargetRange: isPoolWithinTargetRange },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate" } },
    );
  } catch (error) {
    console.error("Error checking buffer initialization status:", error);
    return NextResponse.json(
      { error: "Failed to check buffer initialization status" },
      { status: 500 },
    );
  }
}
