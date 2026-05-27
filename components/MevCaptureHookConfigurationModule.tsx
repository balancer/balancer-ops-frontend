"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Container,
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
  generateMevCaptureParamsPayload,
  handleDownloadClick,
  MevCaptureParamsInput,
} from "@/app/payload-builder/payloadHelperFunctions";
import { MEV_CAPTURE_PARAMS, NETWORK_OPTIONS, networks } from "@/constants/constants";
import { getNetworksForFeature } from "@/constants/networkFeatures";
import {
  GetV3PoolsWithHooksDocument,
  GetV3PoolsWithHooksQuery,
  GetV3PoolsWithHooksQueryVariables,
} from "@/lib/services/apollo/generated/graphql";
import { AddressBook, HookParams, MevTaxHookParams, Pool, AddressType } from "@/types/interfaces";
import { PRCreationModal } from "@/components/modal/PRModal";
import { CopyIcon, DownloadIcon } from "@chakra-ui/icons";
import SimulateTransactionButton from "@/components/btns/SimulateTransactionButton";
import SimulateEOATransactionButton from "@/components/btns/SimulateEOATransactionButton";
import { buildMevCaptureParameterSimulationTransactions } from "@/app/payload-builder/simulationHelperFunctions";
import OpenPRButton from "./btns/OpenPRButton";
import { JsonViewerEditor } from "@/components/JsonViewerEditor";
import { DollarSign } from "react-feather";
import { ethers, parseUnits } from "ethers";
import { isZeroAddress } from "@ethereumjs/util";
import { mevCaptureHookAbi } from "@/abi/MevCaptureHook";
import { useAccount, useSwitchChain } from "wagmi";
import { NetworkSelector } from "@/components/NetworkSelector";
import { PoolInfoCard } from "./PoolInfoCard";
import { ParameterChangePreviewCard } from "./ParameterChangePreviewCard";
import PoolSelector from "./PoolSelector";
import { formatGwei, parseEther } from "viem";
import { useSearchParams } from "next/navigation";
import { useValidateMevCapture } from "@/lib/hooks/validation/useValidateMevCapture";
import { useDebounce } from "use-debounce";
import { getMultisigForNetwork } from "@/lib/utils/getMultisigForNetwork";
import { updateQueryParams } from "@/lib/utils/updateQueryParams";
import { generateUniqueId } from "@/lib/utils/generateUniqueID";
import ComposerButton from "@/app/payload-builder/composer/ComposerButton";
import ComposerIndicator from "@/app/payload-builder/composer/ComposerIndicator";
import { fetchAddressType } from "@/lib/services/fetchAddressType";
import { useQuery as useReactQuery } from "@tanstack/react-query";

// Type guard for MevTaxHookParams
export const isMevTaxHookParams = (params?: HookParams): params is MevTaxHookParams => {
  if (!params) return false;
  return (
    params.__typename === "MevTaxHookParams" ||
    ("mevTaxThreshold" in params && "mevTaxMultiplier" in params)
  );
};

export default function MevCaptureHookConfigurationModule({
  addressBook,
}: {
  addressBook: AddressBook;
}) {
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [newMevTaxThreshold, setNewMevTaxThreshold] = useState<string>("");
  const [newMevTaxMultiplier, setNewMevTaxMultiplier] = useState<string>("");
  const [generatedPayload, setGeneratedPayload] = useState<null | any>(null);
  const [selectedMultisig, setSelectedMultisig] = useState<string>("");
  const [isCurrentWalletManager, setIsCurrentWalletManager] = useState(false);

  // Create debounced versions of the state values
  const [debouncedMevTaxThreshold] = useDebounce(newMevTaxThreshold, 300);
  const [debouncedMevTaxMultiplier] = useDebounce(newMevTaxMultiplier, 300);

  // Use the validation hook with debounced values
  const { mevTaxThresholdError, mevTaxMultiplierError, isValid } = useValidateMevCapture({
    mevTaxThreshold: debouncedMevTaxThreshold,
    mevTaxMultiplier: debouncedMevTaxMultiplier,
  });

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const searchParams = useSearchParams();
  const initialNetworkSetRef = useRef(false);

  //Chain state switch
  const { switchChain } = useSwitchChain();

  // Add wallet connection hook
  const { address: walletAddress } = useAccount();

  // Compare the wagmi-connected wallet against the pool's swap fee manager.
  // Reading from window.ethereum is wrong here: it may be undefined (WalletConnect,
  // Safe, mobile) or expose a different default account than the one selected via wagmi.
  useEffect(() => {
    if (!selectedPool || !walletAddress) {
      setIsCurrentWalletManager(false);
      return;
    }
    setIsCurrentWalletManager(
      selectedPool.swapFeeManager.toLowerCase() === walletAddress.toLowerCase(),
    );
  }, [selectedPool, walletAddress]);

  const { loading, error, data } = useQuery<
    GetV3PoolsWithHooksQuery,
    GetV3PoolsWithHooksQueryVariables
  >(GetV3PoolsWithHooksDocument, {
    variables: { chainIn: [selectedNetwork as any], tagIn: ["HOOKS_MEVCAPTURE"] },
    skip: !selectedNetwork,
  });

  const resolveMultisig = (network: string) => getMultisigForNetwork(addressBook, network);

  const networkOptions = getNetworksForFeature("mevCaptureHook");

  // Handle URL parameters for pre-selection
  useEffect(() => {
    const networkParam = searchParams.get("network");
    const poolParam = searchParams.get("pool");

    if (networkParam && !initialNetworkSetRef.current) {
      // Find the network option that matches the network parameter
      const networkOption = networkOptions.find(
        n => n.apiID.toLowerCase() === networkParam.toLowerCase(),
      );

      if (networkOption) {
        setSelectedNetwork(networkOption.apiID);
        setSelectedMultisig(resolveMultisig(networkOption.apiID));
        initialNetworkSetRef.current = true;
      }
    }
  }, [searchParams, networkOptions, resolveMultisig]);

  // Separate effect to handle pool selection when data is loaded
  useEffect(() => {
    const poolParam = searchParams.get("pool");

    if (poolParam && data?.poolGetPools && selectedNetwork) {
      const pool = data.poolGetPools.find(p => p.address.toLowerCase() === poolParam.toLowerCase());
      if (pool) {
        setSelectedPool(pool as unknown as Pool);
      }
    }
  }, [searchParams, data?.poolGetPools, selectedNetwork]);

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNetwork = e.target.value;
    setSelectedNetwork(newNetwork);
    setSelectedMultisig(resolveMultisig(newNetwork));
    setSelectedPool(null);
    setGeneratedPayload(null);
    setNewMevTaxThreshold("");
    setNewMevTaxMultiplier("");
    setIsCurrentWalletManager(false);
    updateQueryParams({ network: newNetwork.toLowerCase(), pool: null });

    // Find the corresponding chain ID for the selected network
    const networkOption = networkOptions.find(n => n.apiID === newNetwork);
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

  const getPrefillValues = () => {
    // Make sure we have a selected pool and at least one parameter changed
    if (!selectedPool || (!debouncedMevTaxThreshold && !debouncedMevTaxMultiplier)) return {};

    // Generate a unique ID for the branch and file
    const uniqueId = generateUniqueId();

    // Create a truncated version of the pool address for the branch name
    const shortPoolId = selectedPool.address.substring(0, 8);

    // Get pool name for the description
    const poolName = selectedPool.name;

    // Create parameter change descriptions
    const changes = [];
    if (debouncedMevTaxThreshold) {
      const newThreshold = parseFloat(debouncedMevTaxThreshold);
      const thresholdChangeDirection =
        newThreshold > parseFloat(displayCurrentMevTaxThreshold) ? "increase" : "decrease";
      changes.push(
        `${thresholdChangeDirection}s the MEV tax threshold from ${displayCurrentMevTaxThreshold} to ${debouncedMevTaxThreshold} Gwei`,
      );
    }

    if (debouncedMevTaxMultiplier) {
      const newMultiplier = parseInt(debouncedMevTaxMultiplier);
      const multiplierChangeDirection =
        newMultiplier > parseInt(displayCurrentMevTaxMultiplier) ? "increase" : "decrease";
      changes.push(
        `${multiplierChangeDirection}s the MEV tax multiplier from ${displayCurrentMevTaxMultiplier} to ${debouncedMevTaxMultiplier}`,
      );
    }

    // Find the network name from the selected network
    const networkOption = NETWORK_OPTIONS.find(n => n.apiID === selectedNetwork);
    const networkName = networkOption?.label || selectedNetwork;
    const networkPath = networkName === "Ethereum" ? "Mainnet" : networkName;
    const chainId = networkOption?.chainId || selectedNetwork;

    // Create the filename with chain ID included
    const filename = `mev-capture-params-${chainId}-${shortPoolId}-${uniqueId}.json`;

    return {
      prefillBranchName: `feature/mev-capture-params-${shortPoolId}-${uniqueId}`,
      prefillPrName: `Update MEV Capture Hook Parameters for ${poolName} on ${networkName}`,
      prefillDescription: `This PR ${changes.join(" and ")} for ${poolName} (${shortPoolId}) on ${networkName}.`,
      prefillFilename: filename,
    };
  };

  const handlePoolSelect = (pool: Pool) => {
    setSelectedPool(pool);
    updateQueryParams({ pool: pool.address.toLowerCase() });
  };

  const clearPoolSelection = () => {
    setSelectedPool(null);
    setGeneratedPayload(null);
    setNewMevTaxThreshold("");
    setNewMevTaxMultiplier("");
    updateQueryParams({ pool: null });
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

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMevTaxThreshold(value);
  };

  const handleMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMevTaxMultiplier(value);
  };

  const handleGenerateClick = async () => {
    if (
      !selectedPool ||
      (!debouncedMevTaxThreshold && !debouncedMevTaxMultiplier) ||
      !selectedNetwork
    ) {
      toast({
        title: "Missing information",
        description: "Please select a network, pool, and enter at least one parameter to change",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Use isValid from the hook
    if (!isValid) {
      toast({
        title: "Invalid input values",
        description: "Please correct the input errors before generating the payload",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Case 1: Zero or omni address manager (DAO governed) OR Safe proxy
    if (isAuthorizedPool || addressTypeData?.type === AddressType.SAFE_PROXY) {
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

      // Use the new helper function to generate the payload
      const hookAddress = selectedPool.hook?.address;
      if (!hookAddress) {
        toast({
          title: "Missing hook address",
          description: "The pool must have a hook address to modify hook parameters.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const input: MevCaptureParamsInput = {
        poolAddress: selectedPool.address,
        newMevTaxThreshold: debouncedMevTaxThreshold,
        newMevTaxMultiplier: debouncedMevTaxMultiplier,
      };

      // Use the Safe address as multisig if it's a Safe, otherwise use DAO multisig
      const multisigAddress =
        addressTypeData?.type === AddressType.SAFE_PROXY
          ? selectedPool.swapFeeManager
          : selectedMultisig;

      const payload = generateMevCaptureParamsPayload(
        input,
        network.chainId,
        hookAddress,
        multisigAddress,
      );
      setGeneratedPayload(JSON.stringify(payload, null, 2));
    }
    // Case 2: Current wallet is the fee manager
    else if (isCurrentWalletManager) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const hookContract = new ethers.Contract(
          selectedPool.hook?.address!!,
          mevCaptureHookAbi,
          signer,
        );

        // Update MEV tax threshold if provided (convert from Gwei to Wei)
        if (debouncedMevTaxThreshold) {
          const txMevTaxThreshold = parseUnits(debouncedMevTaxThreshold, "gwei");

          const tx1 = await hookContract.setPoolMevTaxThreshold(
            selectedPool.address,
            txMevTaxThreshold,
          );

          toast.promise(tx1.wait(), {
            success: {
              title: "Success",
              description: `The MEV tax threshold has been updated to ${debouncedMevTaxThreshold} Gwei. Changes will appear in the UI in the next few minutes after the block is indexed.`,
              duration: 5000,
              isClosable: true,
            },
            loading: {
              title: "Updating MEV tax threshold",
              description: "Waiting for transaction confirmation... Please wait.",
            },
            error: (error: any) => ({
              title: "Error",
              description: error.message,
              duration: 7000,
              isClosable: true,
            }),
          });
        }

        // Update MEV tax multiplier if provided
        if (debouncedMevTaxMultiplier) {
          // Convert multiplier from MEther to Wei for tx payload
          const txMevTaxMultiplier = parseUnits(debouncedMevTaxMultiplier, 24);
          const tx2 = await hookContract.setPoolMevTaxMultiplier(
            selectedPool.address,
            txMevTaxMultiplier.toString(),
          );

          toast.promise(tx2.wait(), {
            success: {
              title: "Success",
              description: `The MEV tax multiplier has been updated to ${debouncedMevTaxMultiplier}. Changes will appear in the UI in the next few minutes after the block is indexed.`,
              duration: 5000,
              isClosable: true,
            },
            loading: {
              title: "Updating MEV tax multiplier",
              description: "Waiting for transaction confirmation... Please wait.",
            },
            error: (error: any) => ({
              title: "Error",
              description: error.message,
              duration: 7000,
              isClosable: true,
            }),
          });
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
    }
  };

  const currentMevTaxThreshold =
    selectedPool &&
    selectedPool.hook?.type === "MEV_TAX" &&
    selectedPool.hook.params &&
    isMevTaxHookParams(selectedPool.hook.params)
      ? selectedPool.hook.params.mevTaxThreshold
      : "0";

  const currentMevTaxMultiplier =
    selectedPool &&
    selectedPool.hook?.type === "MEV_TAX" &&
    selectedPool.hook.params &&
    isMevTaxHookParams(selectedPool.hook.params)
      ? selectedPool.hook.params.mevTaxMultiplier
      : "0";

  // API returns value in ETH, convert to GWei for display (1 ETH = 10^9 GWei)
  const displayCurrentMevTaxThreshold = (() => {
    if (!currentMevTaxThreshold || currentMevTaxThreshold === "0") return "0";
    return formatGwei(parseEther(currentMevTaxThreshold)).toString();
  })();

  // Convert from Ether to MEther (divide by 1e6)
  const displayCurrentMevTaxMultiplier = (() => {
    if (!currentMevTaxMultiplier || currentMevTaxMultiplier === "0") return "0";
    return (Number(currentMevTaxMultiplier) / 1e6).toString();
  })();

  const isAuthorizedPool = (() => {
    if (!selectedPool?.swapFeeManager) return false;
    return (
      isZeroAddress(selectedPool.swapFeeManager) ||
      selectedPool.swapFeeManager.toLowerCase() === selectedMultisig.toLowerCase()
    );
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

  const generateComposerData = () => {
    if (!generatedPayload) return null;

    const payload =
      typeof generatedPayload === "string" ? JSON.parse(generatedPayload) : generatedPayload;

    // Extract parameters from transactions based on contract method names
    const extractedParams: { [key: string]: any } = {};

    payload.transactions?.forEach((transaction: any) => {
      const methodName = transaction.contractMethod?.name;
      const contractInputsValues = transaction.contractInputsValues;

      if (methodName === "setPoolMevTaxThreshold" && contractInputsValues) {
        extractedParams.pool = contractInputsValues.pool;
        extractedParams.newPoolMevTaxThreshold = contractInputsValues.newPoolMevTaxThreshold;
      } else if (methodName === "setPoolMevTaxMultiplier" && contractInputsValues) {
        extractedParams.pool = contractInputsValues.pool;
        extractedParams.newPoolMevTaxMultiplier = contractInputsValues.newPoolMevTaxMultiplier;
      }
    });

    return {
      type: "hook-mev-capture",
      title: "Configure MEV Capture Hook",
      description: payload.meta.description,
      payload: payload,
      params: extractedParams,
      builderPath: "hook-mev-capture",
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
          Configure MEV Capture Hook
        </Heading>
        <Box width={{ base: "full", md: "auto" }}>
          <ComposerIndicator />
        </Box>
      </Flex>

      <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={6}>
        <GridItem colSpan={{ base: 12, md: 4 }}>
          <NetworkSelector
            networks={networks}
            networkOptions={networkOptions}
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
              onPoolSelect={pool => handlePoolSelect(pool as Pool)}
              onClearSelection={clearPoolSelection}
            />
          )}
        </GridItem>
      </Grid>

      {selectedPool && (
        <Box mb={6}>
          <PoolInfoCard pool={selectedPool} showHook={true} />
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
                You can modify its MEV Capture hook parameters and execute through your connected
                EOA.
              </AlertDescription>
            </Alert>
          ) : isAuthorizedPool ? (
            <Alert status="info" mt={4}>
              <AlertIcon />
              <AlertDescription>
                This pool's MEV Capture hook configuration can be modified through the DAO multisig.
              </AlertDescription>
            </Alert>
          ) : addressTypeData ? (
            <Alert status="warning" mt={4}>
              <AlertIcon />
              <AlertDescription>
                {addressTypeData.type === AddressType.SAFE_PROXY
                  ? `This pool's MEV Capture hook configuration is managed by a Safe: ${selectedPool.swapFeeManager}`
                  : `This pool's MEV Capture hook configuration can only be modified by the swap fee manager: ${selectedPool.swapFeeManager}`}
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
            isDisabled={
              !selectedPool ||
              (!isAuthorizedPool &&
                !isCurrentWalletManager &&
                addressTypeData?.type !== AddressType.SAFE_PROXY)
            }
            mb={4}
            isInvalid={!!mevTaxThresholdError}
          >
            <FormLabel>New MEV Tax Threshold (Gwei)</FormLabel>
            <Input
              type="number"
              value={newMevTaxThreshold}
              onChange={handleThresholdChange}
              placeholder={`Current: ${displayCurrentMevTaxThreshold}`}
              onWheel={e => (e.target as HTMLInputElement).blur()}
              step={0.001}
              min={MEV_CAPTURE_PARAMS.THRESHOLD.MIN}
              max={MEV_CAPTURE_PARAMS.THRESHOLD.MAX}
            />
            <FormHelperText>
              Enter a value between {MEV_CAPTURE_PARAMS.THRESHOLD.MIN} and{" "}
              {MEV_CAPTURE_PARAMS.THRESHOLD.MAX} Gwei
            </FormHelperText>
            {mevTaxThresholdError && <FormErrorMessage>{mevTaxThresholdError}</FormErrorMessage>}
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 12, md: 6 }}>
          <FormControl
            isDisabled={
              !selectedPool ||
              (!isAuthorizedPool &&
                !isCurrentWalletManager &&
                addressTypeData?.type !== AddressType.SAFE_PROXY)
            }
            mb={4}
            isInvalid={!!mevTaxMultiplierError}
          >
            <FormLabel>New MEV Tax Multiplier</FormLabel>
            <Input
              type="number"
              step="1"
              value={newMevTaxMultiplier}
              onChange={handleMultiplierChange}
              placeholder={`Current: ${displayCurrentMevTaxMultiplier}`}
              onWheel={e => (e.target as HTMLInputElement).blur()}
              min={MEV_CAPTURE_PARAMS.MULTIPLIER.MIN}
              max={MEV_CAPTURE_PARAMS.MULTIPLIER.MAX}
            />
            <FormHelperText>
              Enter a whole number between {MEV_CAPTURE_PARAMS.MULTIPLIER.MIN} and{" "}
              {MEV_CAPTURE_PARAMS.MULTIPLIER.MAX}
            </FormHelperText>
            {mevTaxMultiplierError && <FormErrorMessage>{mevTaxMultiplierError}</FormErrorMessage>}
          </FormControl>
        </GridItem>
      </Grid>

      {selectedPool &&
        ((debouncedMevTaxThreshold && !mevTaxThresholdError) ||
          (debouncedMevTaxMultiplier && !mevTaxMultiplierError)) && (
          <ParameterChangePreviewCard
            title="Hook Parameters Change Preview"
            icon={<DollarSign size={24} />}
            parameters={[
              ...(debouncedMevTaxThreshold && !mevTaxThresholdError
                ? [
                    {
                      name: "MEV Tax Threshold",
                      currentValue: `${displayCurrentMevTaxThreshold}`,
                      newValue: `${debouncedMevTaxThreshold}`,
                      difference: (
                        (parseFloat(debouncedMevTaxThreshold) * 1000 -
                          parseFloat(displayCurrentMevTaxThreshold) * 1000) /
                        1000
                      ).toString(),
                    },
                  ]
                : []),
              ...(debouncedMevTaxMultiplier && !mevTaxMultiplierError
                ? [
                    {
                      name: "MEV Tax Multiplier",
                      currentValue: displayCurrentMevTaxMultiplier,
                      newValue: debouncedMevTaxMultiplier,
                      difference: (
                        parseInt(debouncedMevTaxMultiplier) -
                        parseInt(displayCurrentMevTaxMultiplier)
                      ).toString(),
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
            <Button
              variant="primary"
              onClick={handleGenerateClick}
              isDisabled={(!debouncedMevTaxThreshold && !debouncedMevTaxMultiplier) || !isValid}
            >
              Execute Parameter Change
            </Button>
          ) : isAuthorizedPool ||
            addressTypeData?.type === AddressType.SAFE_PROXY ||
            isCurrentWalletManager ? (
            <>
              <Button
                variant="primary"
                onClick={handleGenerateClick}
                isDisabled={(!debouncedMevTaxThreshold && !debouncedMevTaxMultiplier) || !isValid}
              >
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
          addressTypeData?.type !== AddressType.SAFE_PROXY && (
            <SimulateEOATransactionButton
              transactions={
                buildMevCaptureParameterSimulationTransactions({
                  selectedPool,
                  hasMevTaxThreshold: !!debouncedMevTaxThreshold,
                  hasMevTaxMultiplier: !!debouncedMevTaxMultiplier,
                  mevTaxThreshold: debouncedMevTaxThreshold,
                  mevTaxMultiplier: debouncedMevTaxMultiplier,
                }) || []
              }
              networkId={NETWORK_OPTIONS.find(n => n.apiID === selectedNetwork)?.chainId || "1"}
              disabled={(!debouncedMevTaxThreshold && !debouncedMevTaxMultiplier) || !isValid}
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
            <OpenPRButton onClick={handleOpenPRModal} />
            <Box mt={8} />
            <PRCreationModal
              type={"hook-mev-capture"}
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
