"use client";

import React, { useEffect, useState, useRef } from "react";
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
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  useDisclosure,
  useToast,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import {
  copyJsonToClipboard,
  generateStableSurgeParamsPayload,
  handleDownloadClick,
  StableSurgeParamsInput,
} from "@/app/payload-builder/payloadHelperFunctions";
import { NETWORK_OPTIONS, networks, STABLE_SURGE_PARAMS } from "@/constants/constants";
import {
  GetV3PoolsWithHooksQuery,
  GetV3PoolsWithHooksQueryVariables,
  GetV3PoolsWithHooksDocument,
} from "@/lib/services/apollo/generated/graphql";
import {
  AddressBook,
  Pool,
  StableSurgeHookParams,
  HookParams,
  AddressType,
} from "@/types/interfaces";
import { PRCreationModal } from "@/components/modal/PRModal";
import { CopyIcon, DownloadIcon } from "@chakra-ui/icons";
import SimulateTransactionButton from "@/components/btns/SimulateTransactionButton";
import SimulateEOATransactionButton from "@/components/btns/SimulateEOATransactionButton";
import { buildStableSurgeParameterSimulationTransactions } from "@/app/payload-builder/simulationHelperFunctions";
import { getNetworksWithCategory } from "@/lib/data/balancer/addressBook";
import OpenPRButton from "./btns/OpenPRButton";
import { JsonViewerEditor } from "@/components/JsonViewerEditor";
import { DollarSign } from "react-feather";
import { ethers } from "ethers";
import { isZeroAddress } from "@ethereumjs/util";
import { stableSurgeHookAbi } from "@/abi/StableSurgeHook";
import { useAccount, useSwitchChain } from "wagmi";
import { NetworkSelector } from "@/components/NetworkSelector";
import { PoolInfoCard } from "./PoolInfoCard";
import { ParameterChangePreviewCard } from "./ParameterChangePreviewCard";
import PoolSelector from "./PoolSelector";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useValidateStableSurge } from "@/lib/hooks/validation/useValidateStableSurge";
import { getMultisigForNetwork } from "@/lib/utils/getMultisigForNetwork";
import { updateQueryParams } from "@/lib/utils/updateQueryParams";
import { generateUniqueId } from "@/lib/utils/generateUniqueID";
import ComposerButton from "@/app/payload-builder/composer/ComposerButton";
import ComposerIndicator from "@/app/payload-builder/composer/ComposerIndicator";
import { fetchAddressType } from "@/lib/services/fetchAddressType";
import { useQuery as useReactQuery } from "@tanstack/react-query";

// Type guard for StableSurgeHookParams
export const isStableSurgeHookParams = (params?: HookParams): params is StableSurgeHookParams => {
  if (!params) return false;
  return (
    params.__typename === "StableSurgeHookParams" ||
    ("maxSurgeFeePercentage" in params && "surgeThresholdPercentage" in params)
  );
};

export default function StableSurgeHookConfigurationModule({
  addressBook,
}: {
  addressBook: AddressBook;
}) {
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [newMaxSurgeFeePercentage, setNewMaxSurgeFeePercentage] = useState<string>("");
  const [newSurgeThresholdPercentage, setNewSurgeThresholdPercentage] = useState<string>("");
  const [generatedPayload, setGeneratedPayload] = useState<null | any>(null);
  const [selectedMultisig, setSelectedMultisig] = useState<string>("");
  const [isCurrentWalletManager, setIsCurrentWalletManager] = useState(false);

  // Create debounced versions of the state values
  const [debouncedMaxSurgeFeePercentage] = useDebounce(newMaxSurgeFeePercentage, 300);
  const [debouncedSurgeThresholdPercentage] = useDebounce(newSurgeThresholdPercentage, 300);

  // Use the validation hook with debounced values
  const { maxSurgeFeePercentageError, surgeThresholdPercentageError, isValid } =
    useValidateStableSurge({
      maxSurgeFeePercentage: debouncedMaxSurgeFeePercentage,
      surgeThresholdPercentage: debouncedSurgeThresholdPercentage,
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
    variables: { chainIn: [selectedNetwork as any], tagIn: ["HOOKS_STABLESURGE"] },
    skip: !selectedNetwork,
  });

  const getPrefillValues = () => {
    // Make sure we have a selected pool and at least one parameter changed
    if (!selectedPool || (!debouncedMaxSurgeFeePercentage && !debouncedSurgeThresholdPercentage))
      return {};

    // Generate a unique ID for the branch and file
    const uniqueId = generateUniqueId();

    // Create a truncated version of the pool address for the branch name
    const shortPoolId = selectedPool.address.substring(0, 8);

    // Get pool name for the description
    const poolName = selectedPool.name;

    // Create parameter change descriptions
    const changes = [];
    if (debouncedMaxSurgeFeePercentage) {
      const newMaxFee = parseFloat(debouncedMaxSurgeFeePercentage);
      const maxFeeChangeDirection = newMaxFee > currentMaxSurgeFee ? "increase" : "decrease";
      changes.push(
        `${maxFeeChangeDirection}s the max surge fee from ${currentMaxSurgeFee.toFixed(2)}% to ${newMaxFee.toFixed(2)}%`,
      );
    }

    if (debouncedSurgeThresholdPercentage) {
      const newThreshold = parseFloat(debouncedSurgeThresholdPercentage);
      const thresholdChangeDirection =
        newThreshold > currentSurgeThreshold ? "increase" : "decrease";
      changes.push(
        `${thresholdChangeDirection}s the surge threshold from ${currentSurgeThreshold.toFixed(2)}% to ${newThreshold.toFixed(2)}%`,
      );
    }

    // Find the network option for the chain ID
    const networkOption = NETWORK_OPTIONS.find(n => n.apiID === selectedNetwork);
    const networkName = networkOption?.label || selectedNetwork;
    const networkPath = networkName === "Ethereum" ? "Mainnet" : networkName;
    const chainId = networkOption?.chainId || selectedNetwork;

    // Create the filename with chain ID included
    const filename = `stable-surge-params-${chainId}-${selectedPool.address}-${uniqueId}.json`;

    // Add the network to the OpenPRButton
    // This ensures the network is passed to the PR modal
    return {
      prefillBranchName: `feature/stable-surge-params-${shortPoolId}-${uniqueId}`,
      prefillPrName: `Update StableSurge Hook Parameters for ${poolName} on ${networkName}`,
      prefillDescription: `This PR ${changes.join(" and ")} for ${poolName} (${shortPoolId}) on ${networkName}.`,
      prefillFilename: filename,
    };
  };

  const resolveMultisig = (network: string) => getMultisigForNetwork(addressBook, network);

  const networkOptionsWithV3 = (() => {
    const networksWithV3 = getNetworksWithCategory(addressBook, "20241204-v3-vault");
    return NETWORK_OPTIONS.filter(
      network => networksWithV3.includes(network.apiID.toLowerCase()) || network.apiID === "SONIC",
    );
  })();

  // Handle URL parameters for pre-selection
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
    setNewMaxSurgeFeePercentage("");
    setNewSurgeThresholdPercentage("");
    setIsCurrentWalletManager(false);
    updateQueryParams({ network: newNetwork.toLowerCase(), pool: null });

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

  // Check manager status when pool is selected
  const handlePoolSelect = (pool: Pool) => {
    setSelectedPool(pool);
    updateQueryParams({ pool: pool.address.toLowerCase() });
  };

  const clearPoolSelection = () => {
    setSelectedPool(null);
    setGeneratedPayload(null);
    setNewMaxSurgeFeePercentage("");
    setNewSurgeThresholdPercentage("");
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

  const handleGenerateClick = async () => {
    if (
      !selectedPool ||
      (!debouncedMaxSurgeFeePercentage && !debouncedSurgeThresholdPercentage) ||
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

      const input: StableSurgeParamsInput = {
        poolAddress: selectedPool.address,
        newMaxSurgeFeePercentage: debouncedMaxSurgeFeePercentage || undefined,
        newSurgeThresholdPercentage: debouncedSurgeThresholdPercentage || undefined,
      };

      // Use the Safe address as multisig if it's a Safe, otherwise use DAO multisig
      const multisigAddress =
        addressTypeData?.type === AddressType.SAFE_PROXY
          ? selectedPool.swapFeeManager
          : selectedMultisig;

      const payload = generateStableSurgeParamsPayload(
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
        // This try/catch is needed to handle errors that occur before toast.promise
        // such as errors during transaction creation, contract method calls, etc.
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const hookContract = new ethers.Contract(
          selectedPool.hook?.address!!,
          stableSurgeHookAbi,
          signer,
        );

        // Update max surge fee if provided
        if (debouncedMaxSurgeFeePercentage) {
          const txMaxSurgeFeePercentage = ethers
            .parseUnits(debouncedMaxSurgeFeePercentage, 16)
            .toString();
          const tx1 = await hookContract.setMaxSurgeFeePercentage(
            selectedPool.address,
            txMaxSurgeFeePercentage,
          );

          // toast.promise handles errors during transaction confirmation (tx.wait)
          toast.promise(tx1.wait(), {
            success: {
              title: "Success",
              description: `The max surge fee percentage has been updated to ${debouncedMaxSurgeFeePercentage}%. Changes will appear in the UI in the next few minutes after the block is indexed.`,
              duration: 5000,
              isClosable: true,
            },
            loading: {
              title: "Updating max surge fee percentage",
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

        // Update surge threshold if provided
        if (debouncedSurgeThresholdPercentage) {
          const txSurgeThresholdPercentage = ethers
            .parseUnits(debouncedSurgeThresholdPercentage, 16)
            .toString();
          const tx2 = await hookContract.setSurgeThresholdPercentage(
            selectedPool.address,
            txSurgeThresholdPercentage,
          );

          // toast.promise handles errors during transaction confirmation (tx.wait)
          toast.promise(tx2.wait(), {
            success: {
              title: "Success",
              description: `The surge threshold percentage has been updated to ${debouncedSurgeThresholdPercentage}%. Changes will appear in the UI in the next few minutes after the block is indexed.`,
              duration: 5000,
              isClosable: true,
            },
            loading: {
              title: "Updating surge threshold percentage",
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
        // This catches errors that happen before toast.promise, such as transaction creation errors
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

  const currentMaxSurgeFee =
    selectedPool &&
    selectedPool.hook?.type === "STABLE_SURGE" &&
    selectedPool.hook.params &&
    isStableSurgeHookParams(selectedPool.hook.params)
      ? parseFloat(selectedPool.hook.params.maxSurgeFeePercentage) * 100
      : 0;

  const currentSurgeThreshold =
    selectedPool &&
    selectedPool.hook?.type === "STABLE_SURGE" &&
    selectedPool.hook.params &&
    isStableSurgeHookParams(selectedPool.hook.params)
      ? parseFloat(selectedPool.hook.params.surgeThresholdPercentage) * 100
      : 0;

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

      if (methodName === "setMaxSurgeFeePercentage" && contractInputsValues) {
        extractedParams.pool = contractInputsValues.pool;
        extractedParams.newMaxSurgeSurgeFeePercentage =
          contractInputsValues.newMaxSurgeSurgeFeePercentage;
      } else if (methodName === "setSurgeThresholdPercentage" && contractInputsValues) {
        extractedParams.pool = contractInputsValues.pool;
        extractedParams.newSurgeThresholdPercentage =
          contractInputsValues.newSurgeThresholdPercentage;
      }
    });

    return {
      type: "hook-stable-surge",
      title: "Configure StableSurge Hook",
      description: payload.meta.description,
      payload: payload,
      params: extractedParams,
      builderPath: "hook-stable-surge",
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
          Configure StableSurge Hook
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
                You can modify its StableSurge hook parameters and execute through your connected
                EOA.
              </AlertDescription>
            </Alert>
          ) : isAuthorizedPool ? (
            <Alert status="info" mt={4}>
              <AlertIcon />
              <AlertDescription>
                This pool's StableSurge hook configuration can be modified through the DAO multisig.
              </AlertDescription>
            </Alert>
          ) : addressTypeData ? (
            <Alert status="warning" mt={4}>
              <AlertIcon />
              <AlertDescription>
                {addressTypeData.type === AddressType.SAFE_PROXY
                  ? `This pool's StableSurge hook configuration is managed by a Safe: ${selectedPool.swapFeeManager}`
                  : `This pool's StableSurge hook configuration can only be modified by the swap fee manager: ${selectedPool.swapFeeManager}`}
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
            isInvalid={!!maxSurgeFeePercentageError}
          >
            <FormLabel>New Max Surge Fee Percentage</FormLabel>
            <Input
              type="number"
              step="0.01"
              value={newMaxSurgeFeePercentage}
              onChange={e => setNewMaxSurgeFeePercentage(e.target.value)}
              placeholder={`Current: ${currentMaxSurgeFee.toFixed(2)}%`}
              onWheel={e => (e.target as HTMLInputElement).blur()}
              min={STABLE_SURGE_PARAMS.MAX_SURGE_FEE.MIN}
              max={STABLE_SURGE_PARAMS.MAX_SURGE_FEE.MAX}
            />
            <FormHelperText>
              Enter a value between {STABLE_SURGE_PARAMS.MAX_SURGE_FEE.MIN} and{" "}
              {STABLE_SURGE_PARAMS.MAX_SURGE_FEE.MAX}%
            </FormHelperText>
            {maxSurgeFeePercentageError && (
              <FormErrorMessage>{maxSurgeFeePercentageError}</FormErrorMessage>
            )}
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
            isInvalid={!!surgeThresholdPercentageError}
          >
            <FormLabel>New Surge Threshold Percentage</FormLabel>
            <Input
              type="number"
              step="0.01"
              value={newSurgeThresholdPercentage}
              onChange={e => setNewSurgeThresholdPercentage(e.target.value)}
              placeholder={`Current: ${currentSurgeThreshold.toFixed(2)}%`}
              onWheel={e => (e.target as HTMLInputElement).blur()}
              min={STABLE_SURGE_PARAMS.SURGE_THRESHOLD.MIN}
              max={STABLE_SURGE_PARAMS.SURGE_THRESHOLD.MAX}
            />
            <FormHelperText>
              Enter a value between {STABLE_SURGE_PARAMS.SURGE_THRESHOLD.MIN} and{" "}
              {STABLE_SURGE_PARAMS.SURGE_THRESHOLD.MAX}%
            </FormHelperText>
            {surgeThresholdPercentageError && (
              <FormErrorMessage>{surgeThresholdPercentageError}</FormErrorMessage>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      {selectedPool &&
        ((debouncedMaxSurgeFeePercentage && !maxSurgeFeePercentageError) ||
          (debouncedSurgeThresholdPercentage && !surgeThresholdPercentageError)) && (
          <ParameterChangePreviewCard
            title="Hook Parameters Change Preview"
            icon={<DollarSign size={24} />}
            parameters={[
              ...(debouncedMaxSurgeFeePercentage && !maxSurgeFeePercentageError
                ? [
                    {
                      name: "Max Surge Fee",
                      currentValue: currentMaxSurgeFee.toFixed(2),
                      newValue: Number(debouncedMaxSurgeFeePercentage).toFixed(2),
                      difference: (
                        Number(debouncedMaxSurgeFeePercentage) - currentMaxSurgeFee
                      ).toFixed(2),
                      formatValue: (value: string) => `${value}%`,
                    },
                  ]
                : []),
              ...(debouncedSurgeThresholdPercentage && !surgeThresholdPercentageError
                ? [
                    {
                      name: "Surge Threshold",
                      currentValue: currentSurgeThreshold.toFixed(2),
                      newValue: Number(debouncedSurgeThresholdPercentage).toFixed(2),
                      difference: (
                        Number(debouncedSurgeThresholdPercentage) - currentSurgeThreshold
                      ).toFixed(2),
                      formatValue: (value: string) => `${value}%`,
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
              isDisabled={
                (!debouncedMaxSurgeFeePercentage && !debouncedSurgeThresholdPercentage) || !isValid
              }
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
                isDisabled={
                  (!debouncedMaxSurgeFeePercentage && !debouncedSurgeThresholdPercentage) ||
                  !isValid
                }
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
                buildStableSurgeParameterSimulationTransactions({
                  selectedPool,
                  hasMaxSurgeFeePercentage: !!debouncedMaxSurgeFeePercentage,
                  hasSurgeThresholdPercentage: !!debouncedSurgeThresholdPercentage,
                  maxSurgeFeePercentage: debouncedMaxSurgeFeePercentage,
                  surgeThresholdPercentage: debouncedSurgeThresholdPercentage,
                }) || []
              }
              networkId={NETWORK_OPTIONS.find(n => n.apiID === selectedNetwork)?.chainId || "1"}
              disabled={
                (!debouncedMaxSurgeFeePercentage && !debouncedSurgeThresholdPercentage) || !isValid
              }
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
              type={"hook-stable-surge"}
              isOpen={isOpen}
              onClose={onClose}
              payload={generatedPayload ? JSON.parse(generatedPayload) : null}
              network={selectedNetwork}
              {...getPrefillValues()}
            />
          </Box>
        )}
    </Container>
  );
}
