"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Checkbox,
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
  generateProtocolFeeChangePayload,
  handleDownloadClick,
  ProtocolFeeChangeInput,
} from "@/app/payload-builder/payloadHelperFunctions";
import { NETWORK_OPTIONS, networks } from "@/constants/constants";
import {
  GetV3PoolsDocument,
  GetV3PoolsQuery,
  GetV3PoolsQueryVariables,
} from "@/lib/services/apollo/generated/graphql";
import { AddressBook, Pool } from "@/types/interfaces";
import { PoolInfoCard } from "@/components/PoolInfoCard";
import { PRCreationModal } from "@/components/modal/PRModal";
import { CopyIcon, DownloadIcon } from "@chakra-ui/icons";
import SimulateTransactionButton from "@/components/btns/SimulateTransactionButton";
import { getAddress, getNetworksWithCategory } from "@/lib/data/balancer/addressBook";
import OpenPRButton from "./btns/OpenPRButton";
import { JsonViewerEditor } from "@/components/JsonViewerEditor";
import { DollarSign } from "react-feather";
import { useSwitchChain } from "wagmi";
import { NetworkSelector } from "@/components/NetworkSelector";
import { generateUniqueId } from "@/lib/utils/generateUniqueID";
import { ParameterChangePreviewCard } from "./ParameterChangePreviewCard";
import PoolSelector from "./PoolSelector";
import { useDebounce } from "use-debounce";
import { getMultisigForNetwork } from "@/lib/utils/getMultisigForNetwork";
import ComposerButton from "@/app/payload-builder/composer/ComposerButton";
import ComposerIndicator from "@/app/payload-builder/composer/ComposerIndicator";
import { ProtocolFeeInfoCard } from "@/components/ProtocolFeeInfoCard";

// Interface for current protocol fee info
interface ProtocolFeeInfo {
  swapFeePercentage: number | null;
  swapFeeIsOverride: boolean;
  yieldFeePercentage: number | null;
  yieldFeeIsOverride: boolean;
  isLoading: boolean;
  error: string | null;
}

// Protocol fee validation constants
const PROTOCOL_FEE_PARAMS = {
  MIN: 0, // 0%
  MAX: 50, // 50%
};

export default function ChangeProtocolFeeV3Module({ addressBook }: { addressBook: AddressBook }) {
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [enableSwapFee, setEnableSwapFee] = useState(false);
  const [enableYieldFee, setEnableYieldFee] = useState(false);
  const [newProtocolSwapFee, setNewProtocolSwapFee] = useState<string>("");
  const [newProtocolYieldFee, setNewProtocolYieldFee] = useState<string>("");
  const [generatedPayload, setGeneratedPayload] = useState<null | any>(null);
  const [selectedMultisig, setSelectedMultisig] = useState<string>("");
  const [currentFeeInfo, setCurrentFeeInfo] = useState<ProtocolFeeInfo>({
    swapFeePercentage: null,
    swapFeeIsOverride: false,
    yieldFeePercentage: null,
    yieldFeeIsOverride: false,
    isLoading: false,
    error: null,
  });
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [debouncedSwapFee] = useDebounce(newProtocolSwapFee, 300);
  const [debouncedYieldFee] = useDebounce(newProtocolYieldFee, 300);

  // Chain state switch
  const { switchChain } = useSwitchChain();

  const { loading, error, data } = useQuery<GetV3PoolsQuery, GetV3PoolsQueryVariables>(
    GetV3PoolsDocument,
    {
      variables: { chainIn: [selectedNetwork as any] },
      skip: !selectedNetwork,
    },
  );

  const resolveMultisig = (network: string) => getMultisigForNetwork(addressBook, network);

  // Get ProtocolFeeController address for the selected network
  const protocolFeeControllerAddress = (() => {
    if (!selectedNetwork) return "";
    const address = getAddress(
      addressBook,
      selectedNetwork.toLowerCase(),
      "20250214-v3-protocol-fee-controller-v2",
      "ProtocolFeeController",
    );
    return address || "";
  })();

  const networkOptionsWithV3 = (() => {
    const networksWithV3 = getNetworksWithCategory(
      addressBook,
      "20250214-v3-protocol-fee-controller-v2",
    );
    return NETWORK_OPTIONS.filter(
      network => networksWithV3.includes(network.apiID.toLowerCase()) || network.apiID === "SONIC",
    );
  })();

  // Track which pool we've already fetched fees for to prevent re-fetching
  const [lastFetchedPoolAddress, setLastFetchedPoolAddress] = useState<string | null>(null);

  // Effect to fetch fees when pool is selected via API
  useEffect(() => {
    // Skip if no pool selected or already fetched for this pool
    if (!selectedPool || !protocolFeeControllerAddress || !selectedNetwork) {
      return;
    }

    // Skip if we've already fetched for this pool
    if (lastFetchedPoolAddress === selectedPool.address) {
      return;
    }

    const fetchFees = async () => {
      setCurrentFeeInfo(prev => ({ ...prev, isLoading: true, error: null }));
      setLastFetchedPoolAddress(selectedPool.address);

      try {
        const params = new URLSearchParams({
          network: selectedNetwork,
          poolAddress: selectedPool.address,
          controllerAddress: protocolFeeControllerAddress,
        });

        const response = await fetch(`/api/protocol-fee?${params}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch protocol fees");
        }

        const data = await response.json();

        setCurrentFeeInfo({
          swapFeePercentage: data.swapFeePercentage,
          swapFeeIsOverride: data.swapFeeIsOverride,
          yieldFeePercentage: data.yieldFeePercentage,
          yieldFeeIsOverride: data.yieldFeeIsOverride,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching protocol fees:", error);
        setCurrentFeeInfo({
          swapFeePercentage: null,
          swapFeeIsOverride: false,
          yieldFeePercentage: null,
          yieldFeeIsOverride: false,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to fetch protocol fees",
        });
      }
    };

    fetchFees();
  }, [
    selectedPool?.address,
    protocolFeeControllerAddress,
    selectedNetwork,
    lastFetchedPoolAddress,
  ]);

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNetwork = e.target.value;
    setSelectedNetwork(newNetwork);
    setSelectedMultisig(resolveMultisig(newNetwork));
    setSelectedPool(null);
    setGeneratedPayload(null);
    setNewProtocolSwapFee("");
    setNewProtocolYieldFee("");
    setEnableSwapFee(false);
    setEnableYieldFee(false);
    setLastFetchedPoolAddress(null);
    setCurrentFeeInfo({
      swapFeePercentage: null,
      swapFeeIsOverride: false,
      yieldFeePercentage: null,
      yieldFeeIsOverride: false,
      isLoading: false,
      error: null,
    });

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
  const handlePoolSelection = async (pool: Pool) => {
    setSelectedPool(pool);
  };

  const clearPoolSelection = () => {
    setSelectedPool(null);
    setGeneratedPayload(null);
    setNewProtocolSwapFee("");
    setNewProtocolYieldFee("");
    setEnableSwapFee(false);
    setEnableYieldFee(false);
    setLastFetchedPoolAddress(null);
    setCurrentFeeInfo({
      swapFeePercentage: null,
      swapFeeIsOverride: false,
      yieldFeePercentage: null,
      yieldFeeIsOverride: false,
      isLoading: false,
      error: null,
    });
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

  // Validation for fees
  const validateFee = (fee: string): { isValid: boolean; error: string } => {
    if (fee === "") return { isValid: true, error: "" };

    const feeValue = parseFloat(fee);
    if (isNaN(feeValue)) {
      return { isValid: false, error: "Please enter a valid number" };
    }
    if (feeValue < PROTOCOL_FEE_PARAMS.MIN || feeValue > PROTOCOL_FEE_PARAMS.MAX) {
      return {
        isValid: false,
        error: `Fee must be between ${PROTOCOL_FEE_PARAMS.MIN}% and ${PROTOCOL_FEE_PARAMS.MAX}%`,
      };
    }
    return { isValid: true, error: "" };
  };

  const swapFeeValidation = validateFee(debouncedSwapFee);
  const yieldFeeValidation = validateFee(debouncedYieldFee);

  const isFormValid = (() => {
    const hasAtLeastOneFee =
      (enableSwapFee && debouncedSwapFee !== "") || (enableYieldFee && debouncedYieldFee !== "");

    const swapFeeOk = !enableSwapFee || (debouncedSwapFee !== "" && swapFeeValidation.isValid);
    const yieldFeeOk = !enableYieldFee || (debouncedYieldFee !== "" && yieldFeeValidation.isValid);

    return hasAtLeastOneFee && swapFeeOk && yieldFeeOk && protocolFeeControllerAddress !== "";
  })();

  const handleGenerateClick = async () => {
    if (!selectedPool || !selectedNetwork || !isFormValid) {
      toast({
        title: "Missing information",
        description: "Please select a network, pool, and enter at least one protocol fee",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!protocolFeeControllerAddress) {
      toast({
        title: "Protocol Fee Controller not found",
        description: `The ProtocolFeeController address is not available for ${selectedNetwork}`,
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

    const input: ProtocolFeeChangeInput = {
      poolAddress: selectedPool.address,
      poolName: selectedPool.name,
      newProtocolSwapFeePercentage: enableSwapFee ? debouncedSwapFee : undefined,
      newProtocolYieldFeePercentage: enableYieldFee ? debouncedYieldFee : undefined,
    };

    const payload = generateProtocolFeeChangePayload(
      input,
      network.chainId,
      protocolFeeControllerAddress,
      selectedMultisig,
    );
    setGeneratedPayload(JSON.stringify(payload, null, 2));
  };

  const getPrefillValues = () => {
    if (!selectedPool || (!debouncedSwapFee && !debouncedYieldFee))
      return {
        prefillBranchName: "",
        prefillPrName: "",
        prefillDescription: "",
        prefillFilename: "",
      };

    const uniqueId = generateUniqueId();
    const shortPoolId = selectedPool.address.substring(0, 8);
    const poolName = selectedPool.name;

    // Build description based on what fees are being changed
    const feeChanges = [];
    if (enableSwapFee && debouncedSwapFee) {
      feeChanges.push(`protocol swap fee to ${debouncedSwapFee}%`);
    }
    if (enableYieldFee && debouncedYieldFee) {
      feeChanges.push(`protocol yield fee to ${debouncedYieldFee}%`);
    }
    const feeChangeDescription = feeChanges.join(" and ");

    const networkOption = NETWORK_OPTIONS.find(n => n.apiID === selectedNetwork);
    const networkName = networkOption?.label || selectedNetwork;
    const networkPath = networkName === "Ethereum" ? "Mainnet" : networkName;
    const chainId = networkOption?.chainId || selectedNetwork;

    const filename = `set-protocol-fee-${chainId}-${selectedPool.address}-${uniqueId}.json`;

    return {
      prefillBranchName: `feature/protocol-fee-${shortPoolId}-${uniqueId}`,
      prefillPrName: `Change Protocol Fee for ${poolName} on ${networkName}`,
      prefillDescription: `This PR sets ${feeChangeDescription} for ${poolName} (${shortPoolId}) on ${networkName}.`,
      prefillFilename: filename,
    };
  };

  const generateComposerData = () => {
    if (!generatedPayload) return null;

    const payload =
      typeof generatedPayload === "string" ? JSON.parse(generatedPayload) : generatedPayload;

    const firstTx = payload.transactions[0];
    const pool = firstTx?.contractInputsValues?.pool;

    return {
      type: "protocol-fee-setter-v3",
      title: "Change Protocol Fee (v3)",
      description: payload.meta.description,
      payload: payload,
      params: {
        pool: pool,
        protocolSwapFeePercentage: enableSwapFee ? debouncedSwapFee : undefined,
        protocolYieldFeePercentage: enableYieldFee ? debouncedYieldFee : undefined,
      },
      builderPath: "protocol-fee-setter-v3",
    };
  };

  // Build preview parameters
  const previewParameters = (() => {
    const params = [];
    if (enableSwapFee && debouncedSwapFee) {
      const currentSwapFee =
        currentFeeInfo.swapFeePercentage !== null
          ? currentFeeInfo.swapFeePercentage.toFixed(2)
          : "N/A";
      const newSwapFee = parseFloat(debouncedSwapFee).toFixed(2);
      const difference =
        currentFeeInfo.swapFeePercentage !== null
          ? (parseFloat(debouncedSwapFee) - currentFeeInfo.swapFeePercentage).toFixed(2)
          : "N/A";

      params.push({
        name: "Protocol Swap Fee",
        currentValue: currentSwapFee,
        newValue: newSwapFee,
        difference: difference,
        formatValue: (value: string) => `${value}%`,
      });
    }
    if (enableYieldFee && debouncedYieldFee) {
      const currentYieldFee =
        currentFeeInfo.yieldFeePercentage !== null
          ? currentFeeInfo.yieldFeePercentage.toFixed(2)
          : "N/A";
      const newYieldFee = parseFloat(debouncedYieldFee).toFixed(2);
      const difference =
        currentFeeInfo.yieldFeePercentage !== null
          ? (parseFloat(debouncedYieldFee) - currentFeeInfo.yieldFeePercentage).toFixed(2)
          : "N/A";

      params.push({
        name: "Protocol Yield Fee",
        currentValue: currentYieldFee,
        newValue: newYieldFee,
        difference: difference,
        formatValue: (value: string) => `${value}%`,
      });
    }
    return params;
  })();

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
          Balancer v3: Change Protocol Fee Payload
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

          <Box mt={4}>
            <ProtocolFeeInfoCard feeInfo={currentFeeInfo} />
          </Box>

          {protocolFeeControllerAddress ? (
            <Alert status="info" mt={4}>
              <AlertIcon />
              <AlertDescription>
                Protocol fees can be configured through the DAO. This payload will be executed
                through the multisig at {selectedMultisig}.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert status="warning" mt={4}>
              <AlertIcon />
              <AlertDescription>
                ProtocolFeeController not found for {selectedNetwork}. Protocol fee changes may not
                be available on this network.
              </AlertDescription>
            </Alert>
          )}
        </Box>
      )}

      <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={6}>
        <GridItem colSpan={{ base: 12, md: 6 }}>
          <FormControl mb={4}>
            <Checkbox
              isChecked={enableSwapFee}
              onChange={e => setEnableSwapFee(e.target.checked)}
              isDisabled={!selectedPool}
            >
              Set Protocol Swap Fee
            </Checkbox>
          </FormControl>
          <FormControl
            isDisabled={!selectedPool || !enableSwapFee}
            mb={4}
            isInvalid={enableSwapFee && debouncedSwapFee !== "" && !swapFeeValidation.isValid}
          >
            <FormLabel>New Protocol Swap Fee Percentage</FormLabel>
            <Input
              type="number"
              step="0.01"
              value={newProtocolSwapFee}
              onChange={e => setNewProtocolSwapFee(e.target.value)}
              placeholder="e.g. 25"
              onWheel={e => (e.target as HTMLInputElement).blur()}
              isDisabled={!enableSwapFee}
            />
            <FormHelperText>
              Valid range: {PROTOCOL_FEE_PARAMS.MIN}% to {PROTOCOL_FEE_PARAMS.MAX}%
            </FormHelperText>
            {enableSwapFee && debouncedSwapFee !== "" && !swapFeeValidation.isValid && (
              <FormErrorMessage>{swapFeeValidation.error}</FormErrorMessage>
            )}
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 12, md: 6 }}>
          <FormControl mb={4}>
            <Checkbox
              isChecked={enableYieldFee}
              onChange={e => setEnableYieldFee(e.target.checked)}
              isDisabled={!selectedPool}
            >
              Set Protocol Yield Fee
            </Checkbox>
          </FormControl>
          <FormControl
            isDisabled={!selectedPool || !enableYieldFee}
            mb={4}
            isInvalid={enableYieldFee && debouncedYieldFee !== "" && !yieldFeeValidation.isValid}
          >
            <FormLabel>New Protocol Yield Fee Percentage</FormLabel>
            <Input
              type="number"
              step="0.01"
              value={newProtocolYieldFee}
              onChange={e => setNewProtocolYieldFee(e.target.value)}
              placeholder="e.g. 25"
              onWheel={e => (e.target as HTMLInputElement).blur()}
              isDisabled={!enableYieldFee}
            />
            <FormHelperText>
              Valid range: {PROTOCOL_FEE_PARAMS.MIN}% to {PROTOCOL_FEE_PARAMS.MAX}%
            </FormHelperText>
            {enableYieldFee && debouncedYieldFee !== "" && !yieldFeeValidation.isValid && (
              <FormErrorMessage>{yieldFeeValidation.error}</FormErrorMessage>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      {selectedPool && previewParameters.length > 0 && (
        <ParameterChangePreviewCard
          title="Protocol Fee Change Preview"
          icon={<DollarSign size={24} />}
          parameters={previewParameters}
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
          ) : (
            <>
              <Button variant="primary" onClick={handleGenerateClick} isDisabled={!isFormValid}>
                Generate Payload
              </Button>
              <ComposerButton generateData={generateComposerData} isDisabled={!generatedPayload} />
            </>
          )}
        </Flex>

        {generatedPayload && <SimulateTransactionButton batchFile={JSON.parse(generatedPayload)} />}
      </Flex>
      <Divider />

      {generatedPayload && (
        <JsonViewerEditor
          jsonData={generatedPayload}
          onJsonChange={newJson => setGeneratedPayload(newJson)}
        />
      )}

      {generatedPayload && (
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
            type={"protocol-fee-setter-v3"}
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
