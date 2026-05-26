"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client/react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Container,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  copyJsonToClipboard,
  generateReClammCombinedParametersPayload,
  handleDownloadClick,
  ReClammCombinedParametersInput,
} from "@/app/payload-builder/payloadHelperFunctions";
import { NETWORK_OPTIONS, networks } from "@/constants/constants";
import {
  GetV3PoolsDocument,
  GetV3PoolsQuery,
  GetV3PoolsQueryVariables,
  GqlPoolType,
} from "@/lib/services/apollo/generated/graphql";
import { AddressBook, Pool, ReClammPool, AddressType } from "@/types/interfaces";
import { PoolInfoCard } from "@/components/PoolInfoCard";
import { ReClammPoolInfoCard } from "@/components/ReClammPoolInfoCard";
import { ReClammPoolInfoCardSkeleton } from "./ReClammPoolInfoCardSkeleton";
import { PRCreationModal } from "@/components/modal/PRModal";
import { CopyIcon, DownloadIcon } from "@chakra-ui/icons";
import SimulateTransactionButton from "@/components/btns/SimulateTransactionButton";
import SimulateEOATransactionButton from "@/components/btns/SimulateEOATransactionButton";
import { buildReClammParameterSimulationTransactions } from "@/app/payload-builder/simulationHelperFunctions";
import { getNetworksWithCategory } from "@/lib/data/balancer/addressBook";
import OpenPRButton from "./btns/OpenPRButton";
import { JsonViewerEditor } from "@/components/JsonViewerEditor";
import { Settings } from "react-feather";
import { NetworkSelector } from "@/components/NetworkSelector";
import { generateUniqueId } from "@/lib/utils/generateUniqueID";
import { ParameterChangePreviewCard } from "./ParameterChangePreviewCard";
import PoolSelector from "./PoolSelector";
import { useDebounce } from "use-debounce";
import ComposerButton from "@/app/payload-builder/composer/ComposerButton";
import ComposerIndicator from "@/app/payload-builder/composer/ComposerIndicator";
import { getMultisigForNetwork } from "@/lib/utils/getMultisigForNetwork";
import { isZeroAddress } from "@ethereumjs/util";
import { useValidateReclamm } from "@/lib/hooks/validation/useValidateReclamm";
import { useSearchParams } from "next/navigation";
import { useAccount, useSwitchChain } from "wagmi";
import { ethers } from "ethers";
import { reClammPoolAbi } from "@/abi/ReclammPool.js";
import {
  GetPoolQuery,
  GetPoolQueryVariables,
  GetPoolDocument,
  GqlChain,
} from "@/lib/services/apollo/generated/graphql";
import { fetchReclammContractData } from "@/lib/services/fetchReclammContractData";
import { fetchAddressType } from "@/lib/services/fetchAddressType";
import { useQuery as useReactQuery } from "@tanstack/react-query";
import {
  convertTimestampToLocalDateTime,
  getMinDateTime,
  convertDateTimeToTimestamp,
} from "@/lib/utils/datePickerUtils";

export default function ReClammModule({ addressBook }: { addressBook: AddressBook }) {
  const searchParams = useSearchParams();
  const initialNetworkSetRef = useRef(false);

  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [newCenterednessMargin, setNewCenterednessMargin] = useState<string>("");
  const [newDailyPriceShiftExponent, setNewDailyPriceShiftExponent] = useState<string>("");
  const [endPriceRatio, setEndPriceRatio] = useState<string>("");
  const [priceRatioUpdateStartTime, setPriceRatioUpdateStartTime] = useState<string>("");
  const [priceRatioUpdateEndTime, setPriceRatioUpdateEndTime] = useState<string>("");
  const [stopPriceRatioUpdate, setStopPriceRatioUpdate] = useState<boolean>(false);
  const [generatedPayload, setGeneratedPayload] = useState<null | any>(null);
  const [selectedMultisig, setSelectedMultisig] = useState<string>("");
  const [isCurrentWalletManager, setIsCurrentWalletManager] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Wallet connection hooks
  const { address: walletAddress } = useAccount();
  const { switchChain } = useSwitchChain();

  const [debouncedCenterednessMargin] = useDebounce(newCenterednessMargin, 300);
  const [debouncedDailyPriceShiftExponent] = useDebounce(newDailyPriceShiftExponent, 300);
  const [debouncedEndPriceRatio] = useDebounce(endPriceRatio, 300);
  const [debouncedPriceRatioUpdateStartTime] = useDebounce(priceRatioUpdateStartTime, 300);
  const [debouncedPriceRatioUpdateEndTime] = useDebounce(priceRatioUpdateEndTime, 300);

  // Query for getting pool list
  const { loading, error, data } = useQuery<GetV3PoolsQuery, GetV3PoolsQueryVariables>(
    GetV3PoolsDocument,
    {
      variables: {
        chainIn: [selectedNetwork as any],
        poolTypeIn: [GqlPoolType.Reclamm], // Filter for ReClaMM pools only
      },
      skip: !selectedNetwork,
    },
  );

  // Query for getting selected pool details (including current centeredness margin)
  const { loading: poolLoading, data: poolData } = useQuery<GetPoolQuery, GetPoolQueryVariables>(
    GetPoolDocument,
    {
      variables: { id: selectedPool?.id || "", chain: selectedPool?.chain as GqlChain },
      skip: !selectedPool?.id || !selectedPool?.chain,
    },
  );

  // Fetch ReClaMM compute data
  const { isLoading: loadingContractData, data: reClammContractData } = useReactQuery({
    queryKey: ["reclammComputeData", selectedPool?.address, selectedPool?.chain],
    queryFn: () =>
      fetchReclammContractData(selectedPool!.address, selectedPool!.chain.toLowerCase()),
    enabled:
      !!selectedPool?.address &&
      !!selectedPool?.chain &&
      !!networks[selectedPool.chain.toLowerCase()],
  });

  // Use validation hook
  const {
    isCenterednessMarginValid,
    isDailyPriceShiftExponentValid,
    isEndPriceRatioValid,
    isPriceRatioUpdateStartTimeValid,
    isPriceRatioUpdateEndTimeValid,
    centerednessMarginError,
    dailyPriceShiftExponentError,
    endPriceRatioError,
    priceRatioUpdateStartTimeError,
    priceRatioUpdateEndTimeError,
    hasCenterednessMargin,
    hasDailyPriceShiftExponent,
    hasEndPriceRatioOnly,
    hasPriceRatioUpdate,
    currentDailyPriceShiftExponent,
    currentPriceRatio,
    isValid,
  } = useValidateReclamm({
    centerednessMargin: debouncedCenterednessMargin,
    dailyPriceShiftExponent: debouncedDailyPriceShiftExponent,
    endPriceRatio: debouncedEndPriceRatio,
    priceRatioUpdateStartTime: debouncedPriceRatioUpdateStartTime,
    priceRatioUpdateEndTime: debouncedPriceRatioUpdateEndTime,
    stopPriceRatioUpdate: stopPriceRatioUpdate,
    reClammContractData,
  });

  const resolveMultisig = (network: string) => getMultisigForNetwork(addressBook, network);

  // Check if the pool is authorized for DAO governance (zero address or matches the multisig)
  const isAuthorizedPool = (() => {
    if (!selectedPool?.swapFeeManager) return false;
    return (
      isZeroAddress(selectedPool.swapFeeManager) ||
      selectedPool.swapFeeManager.toLowerCase() === selectedMultisig.toLowerCase()
    );
  })();

  // Check if price ratio update is currently active
  const isPriceRatioUpdateInProgress = (() => {
    if (
      !poolData?.pool ||
      !("priceRatioUpdateStartTime" in poolData.pool) ||
      !("priceRatioUpdateEndTime" in poolData.pool)
    ) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    const startTime = parseInt(poolData.pool.priceRatioUpdateStartTime?.toString() || "0");
    const endTime = parseInt(poolData.pool.priceRatioUpdateEndTime?.toString() || "0");

    return startTime > 0 && endTime > 0 && now >= startTime && now <= endTime;
  })();

  // Determine if we need to check the address type
  const shouldCheckAddressType = (selectedPool?.swapFeeManager && selectedNetwork && !isZeroAddress(selectedPool.swapFeeManager));

  // React Query for address type checking
  const { data: addressTypeData, isLoading: isCheckingAddress } = useReactQuery({
    queryKey: ["addressType", selectedPool?.swapFeeManager, selectedNetwork],
    queryFn: () => fetchAddressType(selectedPool!.swapFeeManager, selectedNetwork),
    enabled: !!shouldCheckAddressType,
    staleTime: 5 * 60 * 1000, // 5 minutes - addresses don't change type often
  });

  // Add effect to check manager status when wallet changes
  useEffect(() => {
    const checkManagerStatus = async () => {
      if (!selectedPool || !window.ethereum) {
        setIsCurrentWalletManager(false);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const signerAddress = await signer.getAddress();

        const isManager = selectedPool.swapFeeManager.toLowerCase() === signerAddress.toLowerCase();
        setIsCurrentWalletManager(isManager);
      } catch (error) {
        console.error("Error checking manager status:", error);
        setIsCurrentWalletManager(false);
      }
    };

    checkManagerStatus();
  }, [selectedPool, walletAddress]); // Dependencies include both selectedPool and walletAddress

  const networkOptionsWithV3 = (() => {
    const networksWithV3 = getNetworksWithCategory(addressBook, "20241204-v3-vault");
    return NETWORK_OPTIONS.filter(
      network => networksWithV3.includes(network.apiID.toLowerCase()) || network.apiID === "SONIC",
    );
  })();

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNetwork = e.target.value;
    setSelectedNetwork(newNetwork);
    setSelectedMultisig(resolveMultisig(newNetwork));
    setSelectedPool(null);
    setGeneratedPayload(null);
    setNewCenterednessMargin("");
    setNewDailyPriceShiftExponent("");
    setEndPriceRatio("");
    setPriceRatioUpdateStartTime("");
    setPriceRatioUpdateEndTime("");
    setStopPriceRatioUpdate(false);
    setIsCurrentWalletManager(false);

    // Find the corresponding chain ID for the selected network
    const networkOption = networkOptionsWithV3.find(n => n.apiID === newNetwork);
    if (networkOption) {
      try {
        switchChain({ chainId: Number(networkOption.chainId) });
      } catch (error) {
        toast({
          title: "Error switching network",
          description: "Please switch network manually in your wallet",
          status: "error",
          duration: 5000,
        });
      }
    }
  };

  const handlePoolSelection = (pool: Pool) => {
    setSelectedPool(pool);
  };

  // Effect to handle URL parameters and auto-select pool
  useEffect(() => {
    const networkParam = searchParams.get("network");

    if (networkParam && !initialNetworkSetRef.current) {
      // Find the network option that matches the network parameter
      const networkOption = networkOptionsWithV3.find(
        n => n.apiID.toLowerCase() === networkParam.toLowerCase(),
      );

      if (networkOption) {
        setSelectedNetwork(networkOption.apiID);
        setSelectedMultisig(resolveMultisig(networkOption.apiID));
        initialNetworkSetRef.current = true;
      }
    }
  }, [searchParams, networkOptionsWithV3, resolveMultisig]);

  // Effect to auto-select pool when data is loaded and poolParam is provided
  useEffect(() => {
    const poolParam = searchParams.get("pool");
    if (poolParam && data?.poolGetPools && !selectedPool) {
      const targetPool = data.poolGetPools.find(
        (pool: any) => pool.address.toLowerCase() === poolParam.toLowerCase(),
      );
      if (targetPool) {
        setSelectedPool(targetPool as unknown as Pool);
      }
    }
  }, [data?.poolGetPools, selectedPool]);

  const clearPoolSelection = () => {
    setSelectedPool(null);
    setGeneratedPayload(null);
    setNewCenterednessMargin("");
    setNewDailyPriceShiftExponent("");
    setEndPriceRatio("");
    setPriceRatioUpdateStartTime("");
    setPriceRatioUpdateEndTime("");
    setStopPriceRatioUpdate(false);
    setIsCurrentWalletManager(false);
  };

  const handleOpenPRModal = () => {
    if (generatedPayload) {
      onOpen();
    } else {
      toast({
        title: "No payload generated",
        description: "Please generate a payload first",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleExecuteTransactions = async () => {
    if (!selectedPool || !selectedNetwork) {
      toast({
        title: "Missing information",
        description: "Please select a network and pool",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!isValid) {
      toast({
        title: "No parameters to change",
        description: "Please enter at least one valid parameter to change",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!isCurrentWalletManager) {
      toast({
        title: "Not authorized",
        description: "You are not the manager of this pool",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(selectedPool.address, reClammPoolAbi, signer);

      // Collect all transactions to execute
      const transactions = [];

      if (hasCenterednessMargin) {
        const centerednessMarginValue = (
          (parseFloat(debouncedCenterednessMargin) / 100) *
          1e18
        ).toString();
        transactions.push({
          type: "centerednessMargin",
          description: `centeredness margin to ${debouncedCenterednessMargin}%`,
          execute: () => contract.setCenterednessMargin(centerednessMarginValue),
        });
      }

      if (hasDailyPriceShiftExponent) {
        const dailyPriceShiftExponentValue = (
          (parseFloat(debouncedDailyPriceShiftExponent) / 100) *
          1e18
        ).toString();
        transactions.push({
          type: "dailyPriceShiftExponent",
          description: `daily price shift exponent to ${debouncedDailyPriceShiftExponent}%`,
          execute: () => contract.setDailyPriceShiftExponent(dailyPriceShiftExponentValue),
        });
      }

      if (hasPriceRatioUpdate) {
        const endPriceRatioValue = (parseFloat(debouncedEndPriceRatio) * 1e18).toString();
        transactions.push({
          type: "priceRatioUpdate",
          description: `price ratio update`,
          execute: () =>
            contract.startPriceRatioUpdate(
              endPriceRatioValue,
              debouncedPriceRatioUpdateStartTime,
              debouncedPriceRatioUpdateEndTime,
            ),
        });
      }

      // Execute transactions sequentially
      for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];

        // Show loading toast
        const loadingToastId = toast({
          title:
            transactions.length === 1
              ? "Processing Transaction"
              : `Processing Transaction ${i + 1} of ${transactions.length}`,
          description: `Updating ${transaction.description}...`,
          status: "loading",
          duration: null,
          isClosable: false,
        });

        try {
          // Execute transaction and wait for completion
          const tx = await transaction.execute();
          await tx.wait();

          // Close loading toast and show success
          toast.close(loadingToastId);
          toast({
            title:
              transaction.type === "centerednessMargin"
                ? "Centeredness Margin Updated"
                : transaction.type === "dailyPriceShiftExponent"
                  ? "Daily Price Shift Exponent Updated"
                  : "Price Ratio Update Started",
            description:
              transaction.type === "priceRatioUpdate"
                ? `Started price ratio update from ${new Date(parseInt(debouncedPriceRatioUpdateStartTime) * 1000).toLocaleString()} to ${new Date(parseInt(debouncedPriceRatioUpdateEndTime) * 1000).toLocaleString()} with end ratio ${debouncedEndPriceRatio}`
                : `Updated ${transaction.description}`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } catch (error: any) {
          // Close loading toast first
          toast.close(loadingToastId);

          console.error(`Transaction ${i + 1} failed:`, error);
          toast({
            title:
              transaction.type === "centeredness"
                ? "Centeredness Margin Update Failed"
                : transaction.type === "dailyShift"
                  ? "Daily Price Shift Exponent Update Failed"
                  : "Price Ratio Update Failed",
            description: error.message,
            status: "error",
            duration: 7000,
            isClosable: true,
          });
          break; // Stop executing remaining transactions on error
        }
      }
    } catch (error: any) {
      toast({
        title: "Error executing transactions",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGenerateClick = async () => {
    if (!selectedPool || !selectedNetwork) {
      toast({
        title: "Missing information",
        description: "Please select a network and pool",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!isValid) {
      toast({
        title: "No parameters to change",
        description: "Please enter at least one valid parameter to change",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!isAuthorizedPool && addressTypeData?.type !== AddressType.SAFE_PROXY) {
      toast({
        title: "Not authorized",
        description: "This pool can only be modified by the DAO multisig",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const network = NETWORK_OPTIONS.find(n => n.apiID === selectedNetwork);
    if (!network) {
      toast({
        title: "Invalid network",
        description: "The selected network is not valid",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const input: ReClammCombinedParametersInput = {
      poolAddress: selectedPool.address,
      poolName: selectedPool.name,
      newCenterednessMargin: hasCenterednessMargin
        ? ((parseFloat(debouncedCenterednessMargin) / 100) * 1e18).toString()
        : undefined,
      newDailyPriceShiftExponent: hasDailyPriceShiftExponent
        ? ((parseFloat(debouncedDailyPriceShiftExponent) / 100) * 1e18).toString()
        : undefined,
      endPriceRatio: hasPriceRatioUpdate
        ? (parseFloat(debouncedEndPriceRatio) * 1e18).toString()
        : undefined,
      priceRatioUpdateStartTime: hasPriceRatioUpdate
        ? debouncedPriceRatioUpdateStartTime
        : undefined,
      priceRatioUpdateEndTime: hasPriceRatioUpdate ? debouncedPriceRatioUpdateEndTime : undefined,
      stopPriceRatioUpdate: stopPriceRatioUpdate,
    };

    // Use the Safe address as multisig if it's a Safe, otherwise use DAO multisig
    const multisigAddress =
      addressTypeData?.type === AddressType.SAFE_PROXY
        ? selectedPool.swapFeeManager
        : selectedMultisig;

    const payload = generateReClammCombinedParametersPayload(
      input,
      network.chainId,
      multisigAddress,
    );
    setGeneratedPayload(JSON.stringify(payload, null, 2));
  };

  const handleStopPriceRatioUpdate = async () => {
    if (!selectedPool || !isCurrentWalletManager) {
      toast({
        title: "Not authorized",
        description: "You are not the manager of this pool",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(selectedPool.address, reClammPoolAbi, signer);

      const loadingToastId = toast({
        title: "Stopping Price Ratio Update",
        description: "Processing transaction...",
        status: "loading",
        duration: null,
        isClosable: false,
      });

      try {
        const tx = await contract.stopPriceRatioUpdate();
        await tx.wait();

        toast.close(loadingToastId);
        toast({
          title: "Price Ratio Update Stopped",
          description: "The price ratio update has been successfully stopped",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error: any) {
        toast.close(loadingToastId);
        console.error("Stop price ratio update failed:", error);
        toast({
          title: "Stop Price Ratio Update Failed",
          description: error.message,
          status: "error",
          duration: 7000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error stopping price ratio update",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getParameterCount = (() => {
    let count = 0;
    if (hasCenterednessMargin) count++;
    if (hasDailyPriceShiftExponent) count++;
    if (hasPriceRatioUpdate) count++;
    if (stopPriceRatioUpdate) count++;
    return count;
  })();

  const getPrefillValues = () => {
    if (
      !selectedPool ||
      (!debouncedCenterednessMargin &&
        !debouncedDailyPriceShiftExponent &&
        !hasPriceRatioUpdate &&
        !stopPriceRatioUpdate)
    )
      return {
        prefillBranchName: "",
        prefillPrName: "",
        prefillDescription: "",
        prefillFilename: "",
      };

    const uniqueId = generateUniqueId();
    const shortPoolId = selectedPool.address.substring(0, 8);
    const poolName = selectedPool.name;

    const networkOption = NETWORK_OPTIONS.find(n => n.apiID === selectedNetwork);
    const networkName = networkOption?.label || selectedNetwork;
    const networkPath = networkName === "Ethereum" ? "Mainnet" : networkName;
    const chainId = networkOption?.chainId || selectedNetwork;

    // Determine what parameters are being changed
    const hasCenterednessMargin = debouncedCenterednessMargin && isCenterednessMarginValid;
    const hasDailyPriceShiftExponent =
      debouncedDailyPriceShiftExponent && isDailyPriceShiftExponentValid;

    let filename: string;
    let branchName: string;
    let prName: string;
    let description: string;

    // Use same filename, branch name, and PR name for all cases
    filename = `set-reclamm-parameters-${chainId}-${selectedPool.address}-${uniqueId}.json`;
    branchName = `feature/reclamm-parameters-${shortPoolId}-${uniqueId}`;
    prName = `Set ReClaMM Parameters for ${poolName} on ${networkName}`;

    // Build description based on what parameters are being changed
    const descriptions = [];
    if (hasCenterednessMargin) {
      descriptions.push(`centeredness margin to ${debouncedCenterednessMargin}%`);
    }
    if (hasDailyPriceShiftExponent) {
      descriptions.push(`daily price shift exponent to ${debouncedDailyPriceShiftExponent}%`);
    }
    if (hasPriceRatioUpdate) {
      descriptions.push(
        `price ratio update from ${new Date(parseInt(debouncedPriceRatioUpdateStartTime) * 1000).toLocaleString()} to ${new Date(parseInt(debouncedPriceRatioUpdateEndTime) * 1000).toLocaleString()} with end ratio ${debouncedEndPriceRatio}`,
      );
    }
    if (stopPriceRatioUpdate) {
      descriptions.push("stop price ratio update");
    }

    if (descriptions.length === 1) {
      description = `This PR sets the ${descriptions[0]} for ${poolName} (${shortPoolId}) on ${networkName}.`;
    } else if (descriptions.length === 2) {
      description = `This PR sets the ${descriptions[0]} and ${descriptions[1]} for ${poolName} (${shortPoolId}) on ${networkName}.`;
    } else {
      description = `This PR sets the ${descriptions.slice(0, -1).join(", ")} and ${descriptions[descriptions.length - 1]} for ${poolName} (${shortPoolId}) on ${networkName}.`;
    }

    return {
      prefillBranchName: branchName,
      prefillPrName: prName,
      prefillDescription: description,
      prefillFilename: filename,
    };
  };

  const generateComposerData = () => {
    if (!generatedPayload) return null;

    const payload =
      typeof generatedPayload === "string" ? JSON.parse(generatedPayload) : generatedPayload;

    const params: { [key: string]: any } = {
      pool: selectedPool?.address,
    };

    payload.transactions?.forEach((transaction: any) => {
      const methodName = transaction.contractMethod?.name;
      const contractInputsValues = transaction.contractInputsValues;

      if (methodName === "setCenterednessMargin" && contractInputsValues) {
        params.newCenterednessMargin = contractInputsValues.newCenterednessMargin;
      } else if (methodName === "setDailyPriceShiftExponent" && contractInputsValues) {
        params.newDailyPriceShiftExponent = contractInputsValues.newDailyPriceShiftExponent;
      } else if (methodName === "startPriceRatioUpdate" && contractInputsValues) {
        params.endPriceRatio = contractInputsValues.endPriceRatio;
        params.priceRatioUpdateStartTime = contractInputsValues.priceRatioUpdateStartTime;
        params.priceRatioUpdateEndTime = contractInputsValues.priceRatioUpdateEndTime;
      } else if (methodName === "stopPriceRatioUpdate") {
        params.stopPriceRatioUpdate = true;
      }
    });

    return {
      type: "reclamm",
      title: "Configure ReCLAMM pool",
      description: payload.meta.description,
      payload: payload,
      params: params,
      builderPath: "reclamm",
    };
  };

  return (
    <Container maxW="container.lg">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={6}
        direction={{ base: "column", md: "row" }}
        gap={4}
      >
        <Heading as="h2" size="lg" variant="special">
          ReCLAMM Pool: Parameter Management
        </Heading>
        <Box width={{ base: "full", md: "auto" }}>
          <ComposerIndicator />
        </Box>
      </Flex>

      <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={6}>
        <GridItem colSpan={{ base: 12, md: 4 }}>
          <NetworkSelector
            networks={networks}
            networkOptions={networkOptionsWithV3}
            selectedNetwork={selectedNetwork}
            handleNetworkChange={handleNetworkChange}
            label="Network"
          />
        </GridItem>

        <GridItem colSpan={{ base: 12, md: 8 }}>
          {selectedNetwork && (
            <PoolSelector
              pools={data?.poolGetPools}
              loading={loading}
              error={error}
              selectedPool={selectedPool}
              onPoolSelect={pool => handlePoolSelection(pool as Pool)}
              onClearSelection={clearPoolSelection}
            />
          )}
        </GridItem>
      </Grid>

      {selectedPool && (
        <Box mb={6}>
          <PoolInfoCard pool={selectedPool} />
          {selectedPool.type === "RECLAMM" && (
            <Box mt={4}>
              {loadingContractData ? (
                <ReClammPoolInfoCardSkeleton />
              ) : poolData?.pool && reClammContractData ? (
                <ReClammPoolInfoCard
                  pool={poolData.pool as unknown as ReClammPool}
                  contractData={reClammContractData}
                />
              ) : null}
            </Box>
          )}
          {isCheckingAddress ? (
            <Alert status="info" mt={4}>
              <AlertIcon />
              <AlertDescription>Checking pool authorization...</AlertDescription>
            </Alert>
          ) : isCurrentWalletManager && addressTypeData?.type === AddressType.EOA ? (
            <Alert status="info" mt={4}>
              <AlertIcon />
              <AlertDescription>
                This pool is owned by the authorized delegate address that is currently connected.
                You can now modify its parameters and execute through your connected EOA.
              </AlertDescription>
            </Alert>
          ) : isAuthorizedPool ? (
            <Alert status="info" mt={4}>
              <AlertIcon />
              <AlertDescription>
                This ReCLAMM pool's parameters can be modified through the DAO multisig.
              </AlertDescription>
            </Alert>
          ) : addressTypeData ? (
            <Alert status="warning" mt={4}>
              <AlertIcon />
              <AlertDescription>
                {addressTypeData.type === AddressType.SAFE_PROXY
                  ? `This pool's parameters are managed by a Safe: ${selectedPool.swapFeeManager}`
                  : `This pool's parameters can only be modified by the swap fee manager: ${selectedPool.swapFeeManager}`}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert status="warning" mt={4}>
              <AlertIcon />
              <AlertDescription>
                This pool is not owned by the authorized delegate address and cannot be modified.
                Only the pool owner can modify this pool.
              </AlertDescription>
            </Alert>
          )}
        </Box>
      )}

      <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={6}>
        <GridItem colSpan={{ base: 12, md: 6 }}>
          <FormControl
            isDisabled={!selectedPool}
            mb={4}
            isInvalid={debouncedCenterednessMargin !== "" && !isCenterednessMarginValid}
          >
            <FormLabel>New Centeredness Margin</FormLabel>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={newCenterednessMargin}
              onChange={e => setNewCenterednessMargin(e.target.value)}
              placeholder={
                poolLoading
                  ? "Loading current value..."
                  : poolData?.pool && "centerednessMargin" in poolData.pool
                    ? `Current: ${(parseFloat(poolData.pool.centerednessMargin || "0") * 100).toFixed(2)}%`
                    : "Enter percentage (e.g., 50 for 50%)"
              }
              onWheel={e => (e.target as HTMLInputElement).blur()}
            />
            <FormHelperText>
              Valid range: 0.00% to 100.00% (0 = no margin, 100 = maximum margin)
            </FormHelperText>
            {debouncedCenterednessMargin !== "" && !isCenterednessMarginValid && (
              <FormErrorMessage>{centerednessMarginError}</FormErrorMessage>
            )}
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 12, md: 6 }}>
          <FormControl
            isDisabled={!selectedPool}
            mb={4}
            isInvalid={debouncedDailyPriceShiftExponent !== "" && !isDailyPriceShiftExponentValid}
          >
            <FormLabel>New Daily Price Shift Exponent</FormLabel>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={newDailyPriceShiftExponent}
              onChange={e => setNewDailyPriceShiftExponent(e.target.value)}
              placeholder={
                currentDailyPriceShiftExponent
                  ? `Current: ${parseFloat(currentDailyPriceShiftExponent || "0").toFixed(2)}%`
                  : "Enter percentage (e.g., 5, 10, 15)"
              }
              onWheel={e => (e.target as HTMLInputElement).blur()}
            />
            <FormHelperText>
              Enter as percentage (e.g., 10 for 10%). Controls how fast the pool can move virtual
              balances per day.
            </FormHelperText>
            {debouncedDailyPriceShiftExponent !== "" && !isDailyPriceShiftExponentValid && (
              <FormErrorMessage>{dailyPriceShiftExponentError}</FormErrorMessage>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={6}>
        <GridItem colSpan={{ base: 12, md: 4 }}>
          <FormControl
            isDisabled={!selectedPool}
            mb={4}
            isInvalid={debouncedEndPriceRatio !== "" && !isEndPriceRatioValid}
          >
            <FormLabel>New End Price Ratio</FormLabel>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={endPriceRatio}
              onChange={e => setEndPriceRatio(e.target.value)}
              placeholder={
                currentPriceRatio
                  ? `Current: ${currentPriceRatio}`
                  : "Enter end price ratio (e.g., 8 for 8e18)"
              }
              onWheel={e => (e.target as HTMLInputElement).blur()}
            />
            <FormHelperText>
              The target price ratio to reach at the end of the update period.
            </FormHelperText>
            {debouncedEndPriceRatio !== "" && !isEndPriceRatioValid && (
              <FormErrorMessage>{endPriceRatioError}</FormErrorMessage>
            )}
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 12, md: 4 }}>
          <FormControl
            isDisabled={!selectedPool}
            mb={4}
            isInvalid={
              debouncedPriceRatioUpdateStartTime !== "" && !isPriceRatioUpdateStartTimeValid
            }
          >
            <FormLabel>Price Ratio Update Start Time</FormLabel>
            <Input
              type="datetime-local"
              value={convertTimestampToLocalDateTime(priceRatioUpdateStartTime)}
              onChange={e => {
                const timestamp = convertDateTimeToTimestamp(e.target.value);
                setPriceRatioUpdateStartTime(timestamp);
              }}
              min={getMinDateTime()}
              placeholder="Select start date and time"
            />
            <FormHelperText>
              Select when the price ratio update should start (must be in the future).
            </FormHelperText>
            {debouncedPriceRatioUpdateStartTime !== "" && !isPriceRatioUpdateStartTimeValid && (
              <FormErrorMessage>{priceRatioUpdateStartTimeError}</FormErrorMessage>
            )}
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 12, md: 4 }}>
          <FormControl
            isDisabled={!selectedPool}
            mb={4}
            isInvalid={debouncedPriceRatioUpdateEndTime !== "" && !isPriceRatioUpdateEndTimeValid}
          >
            <FormLabel>Price Ratio Update End Time</FormLabel>
            <Input
              type="datetime-local"
              value={convertTimestampToLocalDateTime(priceRatioUpdateEndTime)}
              onChange={e => {
                const timestamp = convertDateTimeToTimestamp(e.target.value);
                setPriceRatioUpdateEndTime(timestamp);
              }}
              min={getMinDateTime()}
              placeholder="Select end date and time"
            />
            <FormHelperText>
              Select when the price ratio update should end (must be at least 24h after start time).
            </FormHelperText>
            {debouncedPriceRatioUpdateEndTime !== "" && !isPriceRatioUpdateEndTimeValid && (
              <FormErrorMessage>{priceRatioUpdateEndTimeError}</FormErrorMessage>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      {isPriceRatioUpdateInProgress &&
        poolData?.pool &&
        "priceRatioUpdateStartTime" in poolData.pool &&
        "priceRatioUpdateEndTime" in poolData.pool && (
          <Alert status="info" mb={4} justifyContent="center" alignItems="center">
            <AlertIcon />
            <Box flex="1">
              <AlertDescription>
                Price ratio update is currently active (Started:{" "}
                {new Date(
                  parseInt(poolData.pool.priceRatioUpdateStartTime?.toString() || "0") * 1000,
                ).toLocaleString()}
                , Ends:{" "}
                {new Date(
                  parseInt(poolData.pool.priceRatioUpdateEndTime?.toString() || "0") * 1000,
                ).toLocaleString()}
                )
              </AlertDescription>
            </Box>
            {isCurrentWalletManager ? (
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                ml={4}
                onClick={handleStopPriceRatioUpdate}
              >
                Stop Update
              </Button>
            ) : isAuthorizedPool || addressTypeData?.type === AddressType.SAFE_PROXY ? (
              <Box ml={4} display="flex" alignItems="center">
                <Checkbox
                  isChecked={stopPriceRatioUpdate}
                  onChange={e => setStopPriceRatioUpdate(e.target.checked)}
                >
                  Include stop in payload
                </Checkbox>
              </Box>
            ) : null}
          </Alert>
        )}

      {selectedPool &&
        isValid &&
        (hasCenterednessMargin || hasDailyPriceShiftExponent || hasPriceRatioUpdate) && (
          <ParameterChangePreviewCard
            title="ReCLAMM Parameters Change Preview"
            icon={<Settings size={24} />}
            parameters={[
              ...(hasCenterednessMargin
                ? [
                    {
                      name: "Centeredness Margin",
                      currentValue: poolLoading
                        ? "Loading..."
                        : poolData?.pool && "centerednessMargin" in poolData.pool
                          ? (
                              parseFloat(poolData.pool.centerednessMargin?.toString() || "0") * 100
                            ).toFixed(2)
                          : "0",
                      newValue: parseFloat(debouncedCenterednessMargin).toFixed(2),
                      difference: poolLoading
                        ? "-"
                        : poolData?.pool && "centerednessMargin" in poolData.pool
                          ? (
                              parseFloat(debouncedCenterednessMargin) -
                              parseFloat(poolData.pool.centerednessMargin?.toString() || "0") * 100
                            ).toFixed(2)
                          : debouncedCenterednessMargin,
                      formatValue: (value: string) => `${value}%`,
                    },
                  ]
                : []),
              ...(hasDailyPriceShiftExponent
                ? [
                    {
                      name: "Daily Price Shift Exponent",
                      currentValue:
                        parseFloat(currentDailyPriceShiftExponent).toFixed(2) || "Loading...",
                      newValue: parseFloat(debouncedDailyPriceShiftExponent).toFixed(2),
                      difference: currentDailyPriceShiftExponent
                        ? (
                            parseFloat(debouncedDailyPriceShiftExponent) -
                            parseFloat(currentDailyPriceShiftExponent)
                          ).toFixed(2)
                        : debouncedDailyPriceShiftExponent,
                      formatValue: (value: string) => `${value}%`,
                    },
                  ]
                : []),
              ...(hasEndPriceRatioOnly
                ? [
                    {
                      name: "Price Ratio",
                      currentValue: currentPriceRatio || "Loading...",
                      newValue: debouncedEndPriceRatio,
                      difference: currentPriceRatio
                        ? (
                            parseFloat(debouncedEndPriceRatio) - parseFloat(currentPriceRatio)
                          ).toFixed(6)
                        : "N/A",
                      formatValue: (value: string) => value,
                    },
                  ]
                : []),
            ]}
          />
        )}

      <Flex
        justifyContent="space-between"
        alignItems="center"
        mt="20px"
        mb="10px"
        wrap="wrap"
        gap={2}
      >
        <Flex gap={2} alignItems="center">
          {!selectedPool ? (
            <Button variant="primary" isDisabled={true}>
              Select a Pool
            </Button>
          ) : isCurrentWalletManager && addressTypeData?.type !== AddressType.SAFE_PROXY ? (
            <Button variant="primary" onClick={handleExecuteTransactions} isDisabled={!isValid}>
              Execute Parameter Changes ({getParameterCount})
            </Button>
          ) : isAuthorizedPool || addressTypeData?.type === AddressType.SAFE_PROXY ? (
            <>
              <Button variant="primary" onClick={handleGenerateClick} isDisabled={!isValid}>
                Generate Payload
              </Button>
              <ComposerButton generateData={generateComposerData} isDisabled={!generatedPayload} />
            </>
          ) : (
            <Button variant="primary" isDisabled={true}>
              Not Authorized
            </Button>
          )}
        </Flex>

        {generatedPayload &&
          (isAuthorizedPool || addressTypeData?.type === AddressType.SAFE_PROXY) && (
            <SimulateTransactionButton batchFile={JSON.parse(generatedPayload)} />
          )}

        {selectedPool &&
          isCurrentWalletManager &&
          isValid &&
          addressTypeData?.type !== AddressType.SAFE_PROXY && (
            <SimulateEOATransactionButton
              transactions={
                buildReClammParameterSimulationTransactions({
                  selectedPool,
                  hasCenterednessMargin: !!hasCenterednessMargin,
                  hasDailyPriceShiftExponent: !!hasDailyPriceShiftExponent,
                  hasPriceRatioUpdate: !!hasPriceRatioUpdate,
                  centerednessMargin: debouncedCenterednessMargin,
                  dailyPriceShiftExponent: debouncedDailyPriceShiftExponent,
                  endPriceRatio: debouncedEndPriceRatio,
                  priceRatioUpdateStartTime: debouncedPriceRatioUpdateStartTime,
                  priceRatioUpdateEndTime: debouncedPriceRatioUpdateEndTime,
                }) || []
              }
              networkId={NETWORK_OPTIONS.find(n => n.apiID === selectedNetwork)?.chainId || "1"}
              disabled={!isValid}
            />
          )}
      </Flex>
      <Divider />

      {generatedPayload &&
        (isAuthorizedPool || addressTypeData?.type === AddressType.SAFE_PROXY) && (
          <JsonViewerEditor
            jsonData={generatedPayload}
            onJsonChange={newJson => setGeneratedPayload(newJson)}
          />
        )}

      {generatedPayload &&
        (isAuthorizedPool || addressTypeData?.type === AddressType.SAFE_PROXY) && (
          <Box display="flex" alignItems="center" mt="20px">
            <Button
              variant="secondary"
              mr="10px"
              leftIcon={<DownloadIcon />}
              onClick={() => handleDownloadClick(generatedPayload)}
            >
              Download Payload
            </Button>
            <Button
              variant="secondary"
              mr="10px"
              leftIcon={<CopyIcon />}
              onClick={() => copyJsonToClipboard(generatedPayload, toast)}
            >
              Copy Payload to Clipboard
            </Button>
            <OpenPRButton onClick={handleOpenPRModal} network={selectedNetwork} />
            <Box mt={8} />
            <PRCreationModal
              type={"reclamm"}
              isOpen={isOpen}
              onClose={onClose}
              network={selectedNetwork}
              payload={generatedPayload ? JSON.parse(generatedPayload) : null}
              {...getPrefillValues()}
            />
          </Box>
        )}
    </Container>
  );
}
