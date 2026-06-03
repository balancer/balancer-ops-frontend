export const fetchReclammRangeStatus = async (
  poolAddress: string,
  network: string,
): Promise<boolean> => {
  try {
    const response = await fetch(
      `/api/autorange/range?poolAddress=${poolAddress}&network=${network}`,
    );

    if (!response.ok) {
      throw new Error("Failed to check reclamm range status");
    }

    const data = await response.json();
    return data.isPoolWithinTargetRange;
  } catch (error) {
    console.error("Error checking reclamm range status:", error);
    throw error;
  }
};
