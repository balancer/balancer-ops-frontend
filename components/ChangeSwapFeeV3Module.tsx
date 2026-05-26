"use client";

import React, { useEffect, useState } from "react";
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
  generateDAOSwapFeeChangePayload,
  handleDownloadClick,
  SwapFeeChangeInput,
} from "@/app/payload-builder/payloadHelperFunctions";
import { NETWORK_OPTIONS, networks, V3_VAULT_ADDRESS } from "@/constants/constants";
import {
  GetV3PoolsDocument,
  GetV3PoolsQuery,
  GetV3PoolsQueryVariables,
  GqlPoolType,
} from "@/lib/services/apollo/generated/graphql";
import { AddressBook, Pool, AddressType } from "@/types/interfaces";
import { PoolInfoCard } from "@/components/PoolInfoCard";
import { PRCreationModal } from "@/components/modal/PRModal";
import { CopyIcon, DownloadIcon } from "@chakra-ui/icons";
import SimulateTransactionButton from "@/components/btns/SimulateTransactionButton";
import SimulateEOATransactionButton from "@/components/btns/SimulateEOATransactionButton";
import { buildChangeSwapFeeV3SimulationTransactions } from "@/app/payload-builder/simulationHelperFunctions";
import { getNetworksWithCategory } from "@/lib/data/balancer/addressBook";
import OpenPRButton from "./btns/OpenPRButton";
import { JsonViewerEditor } from "@/components/JsonViewerEditor";
import { DollarSign } from "react-feather";
import { ethers } from "ethers";
import { isZeroAddress } from "@ethereumjs/util";
import { V3vaultAdmin } from "@/abi/v3vaultAdmin";
import { useAccount, useSwitchChain } from "wagmi";
import { NetworkSelector } from "@/components/NetworkSelector";
import { generateUniqueId } from "@/lib/utils/generateUniqueID";
import { ParameterChangePreviewCard } from "./ParameterChangePreviewCard";
import PoolSelector from "./PoolSelector";
import {
  getSwapFeeRange,
  isStandardRangePool,
  useValidateSwapFee,
} from "@/lib/hooks/validation/useValidateSwapFee";
import { useDebounce } from "use-debounce";
import { getMultisigForNetwork } from "@/lib/utils/getMultisigForNetwork";
import ComposerButton from "@/app/payload-builder/composer/ComposerButton";
import ComposerIndicator from "@/app/payload-builder/composer/ComposerIndicator";
import { fetchAddressType } from "@/lib/services/fetchAddressType";
import { useQuery as useReactQuery } from "@tanstack/react-query";

export default function ChangeSwapFeeV3Module({ addressBook }: { addressBook: AddressBook }) {
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [newSwapFee, setNewSwapFee] = useState<string>("");
  const [generatedPayload, setGeneratedPayload] = useState<null | any>(null);
  const [selectedMultisig, setSelectedMultisig] = useState<string>("");
  const [isCurrentWalletManager, setIsCurrentWalletManager] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [debouncedSwapFee] = useDebounce(newSwapFee, 300);

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

  const { loading, error, data } = useQuery<GetV3PoolsQuery, GetV3PoolsQueryVariables>(
    GetV3PoolsDocument,
    {
      variables: { chainIn: [selectedNetwork as any] },
      skip: !selectedNetwork,
    },
  );

  const resolveMultisig = (network: string) => getMultisigForNetwork(addressBook, network);

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
    setNewSwapFee("");
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

  // Check manager status when pool is selected
  const handlePoolSelection = async (pool: Pool) => {
    setSelectedPool(pool); // Set pool immediately for UI update
  };

  const clearPoolSelection = () => {
    setSelectedPool(null);
    setGeneratedPayload(null);
    setNewSwapFee("");
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

  // Add validation for swap fee
  const poolType = (selectedPool?.type as GqlPoolType) || GqlPoolType.Weighted;
  const { isValid: isSwapFeeValid, swapFeePercentageError: swapFeeError } = useValidateSwapFee({
    swapFeePercentage: debouncedSwapFee,
    poolType,
  });

  const handleGenerateClick = async () => {
    if (!selectedPool || !debouncedSwapFee || !selectedNetwork || !isSwapFeeValid) {
      toast({
        title: "Missing information",
        description: "Please select a network, pool, and enter a new swap fee",
        status: "warning",
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

      const input: SwapFeeChangeInput = {
        poolAddress: selectedPool.address,
        newSwapFeePercentage: debouncedSwapFee,
        poolName: selectedPool.name,
      };

      // Use the Safe address as multisig if it's a Safe, otherwise use DAO multisig
      const multisigAddress =
        addressTypeData?.type === AddressType.SAFE_PROXY
          ? selectedPool.swapFeeManager
          : selectedMultisig;

      const payload = generateDAOSwapFeeChangePayload(input, network.chainId, multisigAddress);
      setGeneratedPayload(JSON.stringify(payload, null, 2));
    }
    // Case 2: Current wallet is the fee manager
    else if (isCurrentWalletManager) {
      try {
        // This try/catch is needed to handle errors that occur before toast.promise
        // such as errors during transaction creation, contract method calls, etc.
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const contract = new ethers.Contract(V3_VAULT_ADDRESS, V3vaultAdmin, signer);

        const swapFeePercentage = ((parseFloat(debouncedSwapFee) / 100) * 1e18).toString();

        const tx = await contract.setStaticSwapFeePercentage(
          selectedPool.address.toLowerCase(),
          swapFeePercentage,
        );

        // toast.promise handles errors during transaction confirmation (tx.wait)
        toast.promise(tx.wait(), {
          success: {
            title: "Success",
            description: `The swap fee has been updated to ${debouncedSwapFee}%. Changes will appear in the UI in the next few minutes after the block is indexed.`,
            duration: 5000,
            isClosable: true,
          },
          loading: {
            title: "Updating swap fee",
            description: "Waiting for transaction confirmation... Please wait.",
          },
          error: (error: any) => ({
            title: "Error",
            description: error.message,
            duration: 7000,
            isClosable: true,
          }),
        });
      } catch (error: any) {
        // This catches errors that happen before toast.promise, such as transaction creation errors
        toast({
          title: "Error executing transaction",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const currentFee = selectedPool ? parseFloat(selectedPool.dynamicData.swapFee) * 100 : 0;
  const newFee = debouncedSwapFee ? parseFloat(debouncedSwapFee) : currentFee;

  // Check if the pool is authorized for DAO governance (zero address or matches the multisig)
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

  const getPrefillValues = () => {
    // Make sure we have a selected pool and new swap fee
    if (!selectedPool || !debouncedSwapFee)
      return {
        prefillBranchName: "",
        prefillPrName: "",
        prefillDescription: "",
        prefillFilename: "",
      };

    // Generate a unique ID for the branch and file
    const uniqueId = generateUniqueId();

    // Create a truncated version of the pool address for the branch name
    const shortPoolId = selectedPool.address.substring(0, 8);

    // Get pool name for the description
    const poolName = selectedPool.name;

    // Create fee change description
    const currentFee = parseFloat(selectedPool.dynamicData.swapFee) * 100;
    const newFee = parseFloat(debouncedSwapFee);
    const feeChangeDirection = newFee > currentFee ? "increase" : "decrease";

    // Find the network name from the selected network
    const networkOption = NETWORK_OPTIONS.find(n => n.apiID === selectedNetwork);
    const networkName = networkOption?.label || selectedNetwork;
    const networkPath = networkName === "Ethereum" ? "Mainnet" : networkName;
    const chainId = networkOption?.chainId || selectedNetwork;

    // Create the filename with chain ID included
    const filename = `set-swap-fee-${chainId}-${selectedPool.address}-${uniqueId}.json`;

    return {
      prefillBranchName: `feature/swap-fee-${shortPoolId}-${uniqueId}`,
      prefillPrName: `Change Swap Fee for ${poolName} on ${networkName}`,
      prefillDescription: `This PR ${feeChangeDirection}s the swap fee for ${poolName} (${shortPoolId}) from ${currentFee.toFixed(4)}% to ${newFee.toFixed(4)}% on ${networkName}.`,
      prefillFilename: filename,
    };
  };

  const generateComposerData = () => {
    if (!generatedPayload) return null;

    const payload =
      typeof generatedPayload === "string" ? JSON.parse(generatedPayload) : generatedPayload;

    let pool = payload.transactions[0].contractInputsValues.pool;
    let swapFeePercentage = payload.transactions[0].contractInputsValues.swapFeePercentage;

    return {
      type: "fee-setter-v3",
      title: "Change Swap Fee (v3)",
      description: payload.meta.description,
      payload: payload,
      params: {
        pool: pool,
        swapFeePercentage: swapFeePercentage,
      },
      builderPath: "fee-setter-v3",
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
          Balancer v3: Create Swap Fee Change Payload
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
                You can modify its swap fee and execute through your connected EOA.
              </AlertDescription>
            </Alert>
          ) : isAuthorizedPool ? (
            <Alert status="info" mt={4}>
              <AlertIcon />
              <AlertDescription>
                This pool is DAO-governed. Changes must be executed through the multisig.
              </AlertDescription>
            </Alert>
          ) : addressTypeData ? (
            <Alert status="warning" mt={4}>
              <AlertIcon />
              <AlertDescription>
                {addressTypeData.type === AddressType.SAFE_PROXY
                  ? `This pool's swap fee is managed by a Safe: ${selectedPool.swapFeeManager}`
                  : `This pool's swap fee can only be modified by the swap fee manager: ${selectedPool.swapFeeManager}`}
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
            isInvalid={debouncedSwapFee !== "" && !isSwapFeeValid}
          >
            <FormLabel>New Swap Fee Percentage</FormLabel>
            <Input
              type="number"
              step="0.01"
              value={newSwapFee}
              onChange={e => setNewSwapFee(e.target.value)}
              placeholder={`Current: ${currentFee.toFixed(4)}%`}
              onWheel={e => (e.target as HTMLInputElement).blur()}
            />
            {selectedPool && isStandardRangePool(poolType) && (
              <FormHelperText>
                Valid range: {getSwapFeeRange(poolType).MIN}% to {getSwapFeeRange(poolType).MAX}%
              </FormHelperText>
            )}
            {debouncedSwapFee !== "" && !isSwapFeeValid && (
              <FormErrorMessage>{swapFeeError}</FormErrorMessage>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      {selectedPool && debouncedSwapFee && isSwapFeeValid && (
        <ParameterChangePreviewCard
          title="Swap Fee Change Preview"
          icon={<DollarSign size={24} />}
          parameters={[
            {
              name: "Swap Fee",
              currentValue: currentFee.toFixed(4),
              newValue: newFee.toFixed(4),
              difference: (newFee - currentFee).toFixed(4),
              formatValue: (value: string) => `${value}%`,
            },
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
              isDisabled={!debouncedSwapFee || !isSwapFeeValid}
            >
              Execute Fee Change
            </Button>
          ) : isAuthorizedPool ||
            addressTypeData?.type === AddressType.SAFE_PROXY ||
            isCurrentWalletManager ? (
            <>
              <Button
                variant="primary"
                onClick={handleGenerateClick}
                isDisabled={!debouncedSwapFee || !isSwapFeeValid}
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
          debouncedSwapFee &&
          isSwapFeeValid &&
          isCurrentWalletManager &&
          addressTypeData?.type !== AddressType.SAFE_PROXY && (
            <SimulateEOATransactionButton
              transactions={
                buildChangeSwapFeeV3SimulationTransactions({
                  selectedPool,
                  newSwapFeePercentage: debouncedSwapFee,
                }) || []
              }
              networkId={NETWORK_OPTIONS.find(n => n.apiID === selectedNetwork)?.chainId || "1"}
              disabled={!debouncedSwapFee || !isSwapFeeValid}
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
              type={"fee-setter-v3"}
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
