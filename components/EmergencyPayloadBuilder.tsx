"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  List,
  ListIcon,
  ListItem,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  ChevronRightIcon,
  CopyIcon,
  DeleteIcon,
  DownloadIcon,
  InfoIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import {
  copyJsonToClipboard,
  copyTextToClipboard,
  generateEmergencyPayload,
  generateHumanReadableEmergency,
  handleDownloadClick,
  EmergencyActionInput,
  EmergencyPayloadInput,
} from "@/app/payload-builder/payloadHelperFunctions";
import { NETWORK_OPTIONS, networks } from "@/constants/constants";
import {
  GetV3PoolsDocument,
  GetV3PoolsQuery,
  GetV3PoolsQueryVariables,
  GetPoolsDocument,
  GetPoolsQuery,
  GetPoolsQueryVariables,
} from "@/lib/services/apollo/generated/graphql";
import { AddressBook, Pool } from "@/types/interfaces";
import { PRCreationModal } from "@/components/modal/PRModal";
import SimulateTransactionButton from "@/components/btns/SimulateTransactionButton";
import { getNetworksWithCategory, getAddress } from "@/lib/data/balancer/addressBook";
import OpenPRButton from "@/components/btns/OpenPRButton";
import { JsonViewerEditor } from "@/components/JsonViewerEditor";
import { NetworkSelector } from "@/components/NetworkSelector";
import PoolSelector from "@/components/PoolSelector";
import { generateUniqueId } from "@/lib/utils/generateUniqueID";
import { getV3PoolFactoriesForNetwork, V3PoolFactory } from "@/lib/utils/getV3PoolFactories";
import {
  DeprecatedPoolFactory,
  getDeprecatedPoolFactoriesForNetwork,
} from "@/lib/utils/getDeprecatedPoolFactories";
import ComposerButton from "@/app/payload-builder/composer/ComposerButton";
import ComposerIndicator from "@/app/payload-builder/composer/ComposerIndicator";

interface PoolOnChainState {
  isPaused: boolean;
  isInRecoveryMode: boolean;
}

interface SelectedPool extends Pool {
  selectedActions: ("pause" | "enableRecoveryMode" | "unpause" | "disableRecoveryMode")[];
  isV3Pool: boolean;
  pauseMethod?: "pause" | "setPaused"; // For v2 pools only
  poolState?: PoolOnChainState; // V3 on-chain state from VaultExplorer
  poolStateLoading?: boolean;
}

interface EmergencyPayloadBuilderProps {
  addressBook: AddressBook;
}

export default function EmergencyPayloadBuilder({ addressBook }: EmergencyPayloadBuilderProps) {
  const [protocolVersion, setProtocolVersion] = useState<"v2" | "v3" | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedPools, setSelectedPools] = useState<SelectedPool[]>([]);
  const [generatedPayload, setGeneratedPayload] = useState<null | any>(null);
  const [humanReadableText, setHumanReadableText] = useState<string | null>(null);
  const [emergencyWallet, setEmergencyWallet] = useState<string>("");
  const [vaultActions, setVaultActions] = useState<
    ("pauseVault" | "pauseVaultBuffers" | "unpauseVault" | "unpauseVaultBuffers")[]
  >([]); // For V3 vault-level actions
  const [selectedFactories, setSelectedFactories] = useState<V3PoolFactory[]>([]); // For V3 factory disable actions
  const [selectedDeprecatedFactories, setSelectedDeprecatedFactories] = useState<
    DeprecatedPoolFactory[]
  >([]); // For deprecated factory disable actions
  const [includeDeprecated, setIncludeDeprecated] = useState<boolean>(false); // Toggle for showing deprecated factories

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Get available networks based on protocol version
  const availableNetworkOptions = (() => {
    if (!protocolVersion) return [];

    if (protocolVersion === "v3") {
      // For V3, only show networks with V3 vault deployed
      const networksWithV3 = getNetworksWithCategory(addressBook, "20241204-v3-vault");
      return NETWORK_OPTIONS.filter(
        network =>
          networksWithV3.includes(network.apiID.toLowerCase()) || network.apiID === "SONIC",
      );
    } else {
      // For V2, show all networks except SONIC
      return NETWORK_OPTIONS.filter(network => network.apiID !== "SONIC");
    }
  })();

  // Get available V3 factories for the selected network
  const availableFactories = (() => {
    if (protocolVersion !== "v3" || !selectedNetwork) return [];
    return getV3PoolFactoriesForNetwork(addressBook, selectedNetwork);
  })();

  // Get deprecated factories for the selected network
  const [deprecatedFactories, setDeprecatedFactories] = useState<DeprecatedPoolFactory[]>([]);
  const [loadingDeprecated, setLoadingDeprecated] = useState(false);

  // Fetch deprecated factories when network changes and deprecated toggle is enabled
  useEffect(() => {
    if (protocolVersion !== "v3" || !selectedNetwork || !includeDeprecated) {
      setDeprecatedFactories([]);
      return;
    }

    const fetchDeprecatedFactories = async () => {
      setLoadingDeprecated(true);
      try {
        const factories = await getDeprecatedPoolFactoriesForNetwork(
          selectedNetwork,
          protocolVersion,
        );
        setDeprecatedFactories(factories);
      } catch (error) {
        console.error("Error fetching deprecated factories:", error);
        setDeprecatedFactories([]);
      } finally {
        setLoadingDeprecated(false);
      }
    };

    fetchDeprecatedFactories();
  }, [protocolVersion, selectedNetwork, includeDeprecated]);

  // Query V3 pools (only when V3 is selected)
  const {
    loading: v3Loading,
    error: v3Error,
    data: v3Data,
  } = useQuery<GetV3PoolsQuery, GetV3PoolsQueryVariables>(GetV3PoolsDocument, {
    variables: { chainIn: [selectedNetwork as any] },
    skip: !selectedNetwork || protocolVersion !== "v3",
  });

  // Query V2 pools (only when V2 is selected)
  const {
    loading: v2Loading,
    error: v2Error,
    data: v2Data,
  } = useQuery<GetPoolsQuery, GetPoolsQueryVariables>(GetPoolsDocument, {
    variables: { chainIn: [selectedNetwork as any] },
    skip: !selectedNetwork || protocolVersion !== "v2",
  });

  // Get pools based on selected protocol
  const availablePools = (() => {
    if (protocolVersion === "v3" && v3Data?.poolGetPools) {
      return v3Data.poolGetPools.map(pool => ({ ...pool, isV3Pool: true }));
    } else if (protocolVersion === "v2" && v2Data?.poolGetPools) {
      // Filter to only include pools with protocolVersion: 2
      return v2Data.poolGetPools
        .filter(pool => pool.protocolVersion === 2)
        .map(pool => ({ ...pool, isV3Pool: false }));
    }
    return [];
  })();

  const loading = protocolVersion === "v3" ? v3Loading : v2Loading;
  const error = protocolVersion === "v3" ? v3Error : v2Error;

  // Resolve emergency wallet when network changes
  useEffect(() => {
    if (selectedNetwork) {
      const wallet = getAddress(
        addressBook,
        selectedNetwork.toLowerCase(),
        "multisigs",
        "emergency",
      );
      setEmergencyWallet(wallet || "");
    }
  }, [selectedNetwork, addressBook]);

  const handleProtocolVersionChange = (version: "v2" | "v3") => {
    setProtocolVersion(version);
    setSelectedNetwork("");
    setSelectedPools([]);
    setVaultActions([]);
    setSelectedFactories([]);
    setSelectedDeprecatedFactories([]);
    setGeneratedPayload(null);
    setHumanReadableText(null);
  };

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNetwork = e.target.value;
    setSelectedNetwork(newNetwork);
    setSelectedPools([]);
    setVaultActions([]);
    setSelectedFactories([]);
    setSelectedDeprecatedFactories([]);
    setGeneratedPayload(null);
    setHumanReadableText(null);
  };

  const handlePoolSelect = (pool: Pool & { isV3Pool?: boolean }) => {
    setSelectedPools(prev => {
      // Check if pool is already selected
      const existingIndex = prev.findIndex(p => p.address === pool.address);
      if (existingIndex >= 0) {
        return prev; // Pool already selected
      }

      const isV3Pool = protocolVersion === "v3";

      if (isV3Pool) {
        // V3 pools: start with no actions, fetch on-chain state first
        return [
          ...prev,
          {
            ...pool,
            selectedActions: [],
            isV3Pool,
            poolStateLoading: true,
          },
        ];
      } else {
        // V2 pools: default to pause action
        return [
          ...prev,
          {
            ...pool,
            selectedActions: ["pause"],
            isV3Pool,
            pauseMethod: "pause",
          },
        ];
      }
    });
  };

  const handleRemovePool = (poolAddress: string) => {
    setSelectedPools(prev => prev.filter(p => p.address !== poolAddress));
  };

  const handleActionChange = (poolAddress: string, actions: string[]) => {
    setSelectedPools(prev =>
      prev.map(pool =>
        pool.address === poolAddress
          ? {
              ...pool,
              selectedActions: actions as (
                | "pause"
                | "enableRecoveryMode"
                | "unpause"
                | "disableRecoveryMode"
              )[],
            }
          : pool,
      ),
    );
  };

  const handleVaultActionChange = (actions: string[]) => {
    setVaultActions(
      actions as ("pauseVault" | "pauseVaultBuffers" | "unpauseVault" | "unpauseVaultBuffers")[],
    );
  };

  const handleFactorySelect = (factory: V3PoolFactory) => {
    setSelectedFactories(prev => {
      // Check if factory is already selected
      const existingIndex = prev.findIndex(f => f.address === factory.address);
      if (existingIndex >= 0) {
        return prev; // Factory already selected
      }
      return [...prev, factory];
    });
  };

  const handleRemoveFactory = (factoryAddress: string) => {
    setSelectedFactories(prev => prev.filter(f => f.address !== factoryAddress));
  };

  const handleDeprecatedFactorySelect = (factory: DeprecatedPoolFactory) => {
    setSelectedDeprecatedFactories(prev => {
      // Check if factory is already selected
      const existingIndex = prev.findIndex(f => f.address === factory.address);
      if (existingIndex >= 0) {
        return prev; // Factory already selected
      }
      return [...prev, factory];
    });
  };

  const handleRemoveDeprecatedFactory = (factoryAddress: string) => {
    setSelectedDeprecatedFactories(prev => prev.filter(f => f.address !== factoryAddress));
  };

  const handlePauseMethodChange = (poolAddress: string, method: "pause" | "setPaused") => {
    setSelectedPools(prev =>
      prev.map(pool => (pool.address === poolAddress ? { ...pool, pauseMethod: method } : pool)),
    );
  };

  // Fetch on-chain state for newly added V3 pools
  const fetchingPoolsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const poolsToFetch = selectedPools.filter(
      pool => pool.isV3Pool && pool.poolStateLoading && !fetchingPoolsRef.current.has(pool.address),
    );

    if (poolsToFetch.length === 0) return;

    for (const pool of poolsToFetch) {
      fetchingPoolsRef.current.add(pool.address);

      fetch(`/api/pool-state?poolAddress=${pool.address}&network=${selectedNetwork}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) throw new Error(data.error);

          const defaultActions: SelectedPool["selectedActions"] = [];
          if (data.isPaused) {
            defaultActions.push("unpause");
          } else {
            defaultActions.push("pause");
          }

          setSelectedPools(prev =>
            prev.map(p =>
              p.address === pool.address
                ? {
                    ...p,
                    poolState: {
                      isPaused: data.isPaused,
                      isInRecoveryMode: data.isInRecoveryMode,
                    },
                    poolStateLoading: false,
                    selectedActions: defaultActions,
                  }
                : p,
            ),
          );
        })
        .catch(error => {
          console.error("Error fetching pool state for", pool.address, error);
          // On error, fall back to showing all actions with pause as default
          setSelectedPools(prev =>
            prev.map(p =>
              p.address === pool.address
                ? {
                    ...p,
                    poolStateLoading: false,
                    selectedActions: ["pause"],
                  }
                : p,
            ),
          );
        })
        .finally(() => {
          fetchingPoolsRef.current.delete(pool.address);
        });
    }
  }, [selectedPools, selectedNetwork]);

  // Clear stale payload when selections change
  useEffect(() => {
    if (generatedPayload) {
      setGeneratedPayload(null);
      setHumanReadableText(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPools, vaultActions, selectedFactories, selectedDeprecatedFactories]);

  const handleGenerateClick = () => {
    if (
      selectedPools.length === 0 &&
      vaultActions.length === 0 &&
      selectedFactories.length === 0 &&
      selectedDeprecatedFactories.length === 0
    ) {
      toast({
        title: "No actions selected",
        description:
          "Please select at least one pool action, vault action, or factory disable action for emergency actions",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!emergencyWallet) {
      toast({
        title: "Emergency wallet not found",
        description: "Emergency wallet address could not be resolved for this network",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!protocolVersion) {
      toast({
        title: "Protocol version not selected",
        description: "Please select a protocol version first",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const networkOption = NETWORK_OPTIONS.find(n => n.apiID === selectedNetwork);
    if (!networkOption) {
      toast({
        title: "Invalid network",
        description: "Selected network is not valid",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Get vault address only for V3 operations
    let vaultAddress;
    if (protocolVersion === "v3") {
      vaultAddress = getAddress(
        addressBook,
        selectedNetwork.toLowerCase(),
        "20241204-v3-vault",
        "Vault",
      );

      if (!vaultAddress) {
        toast({
          title: "Vault address not found",
          description: "V3 Vault address could not be resolved for this network",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }

    const emergencyActions: EmergencyActionInput[] = selectedPools
      .filter(pool => pool.selectedActions.length > 0)
      .map(pool => ({
        poolAddress: pool.address,
        poolName: pool.name,
        actions: pool.selectedActions,
        isV3Pool: protocolVersion === "v3",
        pauseMethod: pool.pauseMethod || "pause",
      }));

    const payloadInput: EmergencyPayloadInput = {
      pools: emergencyActions,
      emergencyWallet,
      chainId: networkOption.chainId,
      vaultAddress,
      vaultActions: protocolVersion === "v3" ? vaultActions : [],
      factoryActions:
        protocolVersion === "v3"
          ? [
              ...selectedFactories.map(f => ({ address: f.address, name: f.displayName })),
              ...selectedDeprecatedFactories.map(f => ({
                address: f.address,
                name: f.displayName,
              })),
            ]
          : [],
    };

    const payload = generateEmergencyPayload(payloadInput);
    const humanReadable = generateHumanReadableEmergency(payloadInput);

    setGeneratedPayload(JSON.stringify(payload, null, 2));
    setHumanReadableText(humanReadable);
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

  const getPrefillValues = () => {
    if (
      (selectedPools.length === 0 &&
        vaultActions.length === 0 &&
        selectedFactories.length === 0 &&
        selectedDeprecatedFactories.length === 0) ||
      !protocolVersion
    )
      return {};

    const uniqueId = generateUniqueId();
    // Count total actions
    const poolActions = selectedPools.reduce((sum, pool) => sum + pool.selectedActions.length, 0);
    const totalActions =
      poolActions +
      vaultActions.length +
      selectedFactories.length +
      selectedDeprecatedFactories.length;

    // Get network name
    const networkOption = NETWORK_OPTIONS.find(n => n.apiID === selectedNetwork);
    const networkName = networkOption?.label || selectedNetwork;
    const networkPath = networkName === "Ethereum" ? "Mainnet" : networkName;
    const chainId = networkOption?.chainId || selectedNetwork;

    // Generate description
    const descriptions = [];
    if (selectedPools.length > 0) {
      descriptions.push(
        `${selectedPools.length} ${protocolVersion} pool${selectedPools.length !== 1 ? "s" : ""}`,
      );
    }
    if (vaultActions.length > 0) {
      descriptions.push(
        `${vaultActions.length} vault action${vaultActions.length !== 1 ? "s" : ""}`,
      );
    }
    const totalFactoryActions = selectedFactories.length + selectedDeprecatedFactories.length;
    if (totalFactoryActions > 0) {
      descriptions.push(
        `${totalFactoryActions} factory disable action${totalFactoryActions !== 1 ? "s" : ""}`,
      );
    }

    const actionType =
      selectedFactories.length > 0 || selectedDeprecatedFactories.length > 0
        ? "mixed"
        : selectedPools.length > 0
          ? "pools"
          : "vault";
    const filename = `emergency-actions-${chainId}-${protocolVersion}-${actionType}-${uniqueId}.json`;

    return {
      prefillBranchName: `emergency/${protocolVersion}-${actionType}-${uniqueId}`,
      prefillPrName: `Emergency Actions for ${protocolVersion.toUpperCase()} on ${networkName}`,
      prefillDescription: `Emergency actions: ${totalActions} total action${totalActions !== 1 ? "s" : ""} (${descriptions.join(", ")}) on ${networkName}.`,
      prefillFilename: filename,
    };
  };

  const generateComposerData = () => {
    if (!generatedPayload) return null;

    const payload =
      typeof generatedPayload === "string" ? JSON.parse(generatedPayload) : generatedPayload;

    // Count total actions
    const poolActions = selectedPools.reduce((sum, pool) => sum + pool.selectedActions.length, 0);
    const totalActions =
      poolActions +
      vaultActions.length +
      selectedFactories.length +
      selectedDeprecatedFactories.length;

    return {
      type: "emergency",
      title: `Emergency actions for ${protocolVersion?.toUpperCase()}`,
      description: `Emergency actions: ${totalActions} total action${totalActions !== 1 ? "s" : ""}`,
      payload: payload,
      params: {
        poolActions: poolActions,
        vaultActions: vaultActions.length,
        totalActions: totalActions,
      },
      builderPath: "emergency",
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
        <Box>
          <Heading as="h2" size="lg" variant="special" mb={4}>
            Emergency Actions Payload Builder
          </Heading>
          <Text fontSize="md" color="font.secondary">
            Create emergency payloads for pool pausing, recovery mode, vault actions, and factory
            disabling. These actions can be executed by the Emergency SubDAO wallet during critical
            situations.
          </Text>
        </Box>
        <Box width={{ base: "full", md: "auto" }}>
          <ComposerIndicator />
        </Box>
      </Flex>

      <Alert status="warning" mb={6} py={4} variant="left-accent" borderRadius="md">
        <Box flex="1">
          <Flex align="center">
            <AlertIcon boxSize="20px" />
            <AlertTitle fontSize="lg" ml={2}>
              Emergency SubDAO Actions
            </AlertTitle>
          </Flex>
          <AlertDescription display="block">
            <Text fontSize="sm" mb={3}>
              This tool creates payloads for emergency actions that can be executed by the Emergency
              SubDAO wallet. Use these actions only in genuine emergency situations.
            </Text>
            <List spacing={2} fontSize="sm">
              <ListItem>
                <ListIcon as={ChevronRightIcon} color="orange.500" />
                <strong>Pause Pool/Vault:</strong> Immediately stops all operations (swaps, adds,
                removes)
              </ListItem>
              <ListItem>
                <ListIcon as={ChevronRightIcon} color="orange.500" />
                <strong>Enable Recovery Mode:</strong> Allows proportional withdrawals only, no
                trading
              </ListItem>
              <ListItem>
                <ListIcon as={ChevronRightIcon} color="green.500" />
                <strong>Unpause / Disable Recovery Mode (V3 only):</strong> Restores normal pool
                operations after an emergency
              </ListItem>
              <ListItem>
                <ListIcon as={ChevronRightIcon} color="orange.500" />
                <strong>Disable Factory:</strong> Permanently prevents new pool deployments from
                specific factories
              </ListItem>
              <ListItem>
                <ListIcon as={WarningIcon} color="red.500" />
                <strong>Important:</strong> These actions should only be executed during actual
                emergencies
              </ListItem>
            </List>
          </AlertDescription>
        </Box>
      </Alert>

      <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={6}>
        <GridItem colSpan={12}>
          <Heading as="h3" size="md" mb={4}>
            Select Protocol Version
          </Heading>
          <Text fontSize="sm" color="font.secondary" mb={4}>
            Choose the Balancer protocol version for your emergency actions. This determines which
            networks and action types are available.
          </Text>
          <HStack spacing={4}>
            <Button
              size="lg"
              colorScheme={protocolVersion === "v2" ? "blue" : "gray"}
              variant={protocolVersion === "v2" ? "solid" : "outline"}
              onClick={() => handleProtocolVersionChange("v2")}
              leftIcon={<Badge colorScheme="blue">V2</Badge>}
            >
              Balancer v2
            </Button>
            <Button
              size="lg"
              colorScheme={protocolVersion === "v3" ? "purple" : "gray"}
              variant={protocolVersion === "v3" ? "solid" : "outline"}
              onClick={() => handleProtocolVersionChange("v3")}
              leftIcon={<Badge colorScheme="purple">V3</Badge>}
            >
              Balancer v3
            </Button>
          </HStack>
          {protocolVersion && (
            <Alert
              status={"info"}
              mt={3}
              p={3}
              borderRadius="md"
              borderLeftWidth="4px"
              borderLeftColor={protocolVersion === "v3" ? "purple.500" : "blue.500"}
            >
              <Text fontSize="sm">
                {protocolVersion === "v2" ? (
                  <>
                    Actions will be called directly on each pool contract (pause() or setPaused(),
                    enableRecoveryMode())
                  </>
                ) : (
                  <>
                    Actions will be called through the Vault contract (pausePool(), unpausePool(),
                    enableRecoveryMode(), disableRecoveryMode())
                  </>
                )}
              </Text>
            </Alert>
          )}
        </GridItem>
      </Grid>

      {protocolVersion && (
        <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={6}>
          <GridItem colSpan={{ base: 12, md: 4 }}>
            <NetworkSelector
              networks={networks}
              networkOptions={availableNetworkOptions}
              selectedNetwork={selectedNetwork}
              handleNetworkChange={handleNetworkChange}
              label="Select Network"
            />
          </GridItem>
        </Grid>
      )}

      {/* Emergency Wallet Display */}
      {emergencyWallet && (
        <Grid templateColumns="repeat(12, 1fr)" gap={4} mb={6}>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Card>
              <CardBody>
                <Text fontSize="sm" fontWeight={"bold"} mb={1}>
                  Emergency Wallet for {selectedNetwork}
                </Text>
                <Text fontFamily="mono" fontSize="sm">
                  {emergencyWallet}
                </Text>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      )}

      {protocolVersion && selectedNetwork && (
        <Box mb={6}>
          <Heading as="h3" size="md" mb={4}>
            Emergency Actions
          </Heading>
          <Text fontSize="sm" color="font.secondary" mb={6}>
            Select the emergency actions to include in your payload. You can combine multiple action
            types.
          </Text>
        </Box>
      )}

      {protocolVersion && selectedNetwork && (
        <Accordion allowMultiple defaultIndex={[]} mb={6}>
          {/* Vault Actions - V3 only */}
          {protocolVersion === "v3" && (
            <AccordionItem border="1px solid" borderColor="inherit" borderRadius="md" mb={4}>
              <AccordionButton py={3} px={4}>
                <Flex flex="1" align="center" gap={2}>
                  <Text fontWeight="bold" fontSize="md">
                    Vault Actions
                  </Text>
                  {vaultActions.length > 0 && (
                    <Badge colorScheme="red" borderRadius="full">
                      {vaultActions.length}
                    </Badge>
                  )}
                </Flex>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Alert status="info" mb={4}>
                  <AlertIcon />
                  <AlertDescription>
                    <Text fontSize="sm">
                      These actions affect the entire V3 vault on {selectedNetwork}. No specific
                      pool selection needed.
                    </Text>
                  </AlertDescription>
                </Alert>
                <Card>
                  <CardBody>
                    <FormControl>
                      <FormLabel fontSize="sm">Vault Emergency Actions</FormLabel>
                      <CheckboxGroup value={vaultActions} onChange={handleVaultActionChange}>
                        <VStack align="stretch" spacing={3}>
                          <Box>
                            <Text fontSize="xs" fontWeight="bold" color="red.500" mb={1}>
                              Emergency
                            </Text>
                            <Stack direction="row" spacing={4}>
                              <Checkbox value="pauseVault" colorScheme="red">
                                Pause Vault
                              </Checkbox>
                              <Checkbox value="pauseVaultBuffers" colorScheme="red">
                                Pause Vault Buffers
                              </Checkbox>
                            </Stack>
                          </Box>
                          <Box>
                            <Text fontSize="xs" fontWeight="bold" color="green.500" mb={1}>
                              Restoration
                            </Text>
                            <Stack direction="row" spacing={4}>
                              <Checkbox value="unpauseVault" colorScheme="green">
                                Unpause Vault
                              </Checkbox>
                              <Checkbox value="unpauseVaultBuffers" colorScheme="green">
                                Unpause Vault Buffers
                              </Checkbox>
                            </Stack>
                          </Box>
                        </VStack>
                      </CheckboxGroup>
                      <Text fontSize="xs" color="font.secondary" mt={2}>
                        Pause Vault: Halts all operations across all pools. Pause Vault Buffers:
                        Halts buffer operations only. Unpause actions restore normal operations.
                      </Text>
                    </FormControl>
                  </CardBody>
                </Card>
                {vaultActions.length > 0 && (
                  <Alert status="success" mt={4}>
                    <AlertIcon />
                    <AlertDescription>
                      Vault actions selected. You can generate the payload now or optionally add
                      specific pool actions below.
                    </AlertDescription>
                  </Alert>
                )}
              </AccordionPanel>
            </AccordionItem>
          )}

          {/* Factory Actions - V3 only */}
          {protocolVersion === "v3" && (
            <AccordionItem border="1px solid" borderColor="inherit" borderRadius="md" mb={4}>
              <AccordionButton py={3} px={4}>
                <Flex flex="1" align="center" gap={2}>
                  <Text fontWeight="bold" fontSize="md">
                    Factory Actions
                  </Text>
                  {(selectedFactories.length > 0 || selectedDeprecatedFactories.length > 0) && (
                    <Badge colorScheme="orange" borderRadius="full">
                      {selectedFactories.length + selectedDeprecatedFactories.length}
                    </Badge>
                  )}
                </Flex>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Alert status="warning" mb={4}>
                  <AlertIcon />
                  <AlertDescription>
                    <Text fontSize="sm">
                      Disable pool factories to prevent creation of new pools. This action is{" "}
                      <strong>irreversible</strong>.
                    </Text>
                  </AlertDescription>
                </Alert>
                <Card>
                  <CardBody>
                    <FormControl>
                      <FormLabel fontSize="sm">Available Pool Factories</FormLabel>
                      {availableFactories.length === 0 ? (
                        <Alert status="info">
                          <AlertIcon />
                          <AlertDescription>
                            No V3 pool factories found for {selectedNetwork}.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <VStack align="stretch" spacing={2}>
                          {availableFactories.map(factory => (
                            <Flex
                              key={factory.address}
                              justify="space-between"
                              align="center"
                              p={2}
                              borderWidth="1px"
                              borderRadius="md"
                            >
                              <Box>
                                <Text fontWeight="medium">{factory.displayName}</Text>
                                <Text fontSize="xs" color="font.secondary" fontFamily="mono">
                                  {factory.address}
                                </Text>
                              </Box>
                              <Button
                                size="sm"
                                colorScheme="red"
                                variant="outline"
                                onClick={() => handleFactorySelect(factory)}
                                isDisabled={selectedFactories.some(
                                  f => f.address === factory.address,
                                )}
                              >
                                {selectedFactories.some(f => f.address === factory.address)
                                  ? "Selected"
                                  : "Select"}
                              </Button>
                            </Flex>
                          ))}
                        </VStack>
                      )}
                    </FormControl>
                  </CardBody>
                </Card>

                {/* Deprecated Factories Toggle */}
                <Card mt={4}>
                  <CardBody>
                    <FormControl>
                      <Checkbox
                        isChecked={includeDeprecated}
                        onChange={e => setIncludeDeprecated(e.target.checked)}
                        colorScheme="orange"
                      >
                        <Text fontWeight="medium">Include Deprecated Pool Factories</Text>
                      </Checkbox>
                      <Text fontSize="xs" color="font.secondary" mt={1}>
                        Show deprecated pool factories that can also be disabled for emergency
                        purposes.
                      </Text>
                    </FormControl>
                  </CardBody>
                </Card>

                {/* Deprecated Factories List */}
                {includeDeprecated && (
                  <Card mt={4}>
                    <CardBody>
                      <FormControl>
                        <FormLabel fontSize="sm">Deprecated Pool Factories</FormLabel>
                        {loadingDeprecated ? (
                          <Alert status="info">
                            <AlertIcon />
                            <AlertDescription>Loading deprecated factories...</AlertDescription>
                          </Alert>
                        ) : deprecatedFactories.length === 0 ? (
                          <Alert status="info">
                            <AlertIcon />
                            <AlertDescription>
                              No deprecated pool factories found for {selectedNetwork}
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <VStack align="stretch" spacing={2}>
                            {deprecatedFactories.map(factory => (
                              <Flex
                                key={factory.address}
                                justify="space-between"
                                align="center"
                                p={2}
                                borderWidth="1px"
                                borderRadius="md"
                              >
                                <Box>
                                  <Flex align="center" gap={2}>
                                    <Text fontWeight="medium">{factory.displayName}</Text>
                                    <Badge colorScheme="orange" size="sm">
                                      DEPRECATED
                                    </Badge>
                                  </Flex>
                                  <Text fontSize="xs" color="font.secondary" fontFamily="mono">
                                    {factory.address}
                                  </Text>
                                  <Text fontSize="xs" color="font.secondary">
                                    Deployment: {factory.deployment}
                                  </Text>
                                </Box>
                                <Button
                                  size="sm"
                                  colorScheme="orange"
                                  variant="outline"
                                  onClick={() => handleDeprecatedFactorySelect(factory)}
                                  isDisabled={selectedDeprecatedFactories.some(
                                    f => f.address === factory.address,
                                  )}
                                >
                                  {selectedDeprecatedFactories.some(
                                    f => f.address === factory.address,
                                  )
                                    ? "Selected"
                                    : "Select"}
                                </Button>
                              </Flex>
                            ))}
                          </VStack>
                        )}
                      </FormControl>
                    </CardBody>
                  </Card>
                )}

                {/* Selected factories summary */}
                {selectedFactories.length > 0 && (
                  <Box mt={4}>
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                      Selected Factories ({selectedFactories.length})
                    </Text>
                    <VStack spacing={2}>
                      {selectedFactories.map(factory => (
                        <Flex
                          key={factory.address}
                          justify="space-between"
                          align="center"
                          w="100%"
                          p={2}
                          borderWidth="1px"
                          borderRadius="md"
                        >
                          <Flex align="center" gap={2}>
                            <Text fontWeight="medium" fontSize="sm">
                              {factory.displayName}
                            </Text>
                            <Badge colorScheme="red" size="sm">
                              DISABLE
                            </Badge>
                          </Flex>
                          <IconButton
                            aria-label="Remove factory"
                            icon={<DeleteIcon />}
                            size="xs"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleRemoveFactory(factory.address)}
                          />
                        </Flex>
                      ))}
                    </VStack>
                  </Box>
                )}

                {selectedDeprecatedFactories.length > 0 && (
                  <Box mt={4}>
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                      Selected Deprecated Factories ({selectedDeprecatedFactories.length})
                    </Text>
                    <VStack spacing={2}>
                      {selectedDeprecatedFactories.map(factory => (
                        <Flex
                          key={factory.address}
                          justify="space-between"
                          align="center"
                          w="100%"
                          p={2}
                          borderWidth="1px"
                          borderRadius="md"
                        >
                          <Flex align="center" gap={2}>
                            <Text fontWeight="medium" fontSize="sm">
                              {factory.displayName}
                            </Text>
                            <Badge colorScheme="orange" size="sm">
                              DEPRECATED
                            </Badge>
                            <Badge colorScheme="red" size="sm">
                              DISABLE
                            </Badge>
                          </Flex>
                          <IconButton
                            aria-label="Remove deprecated factory"
                            icon={<DeleteIcon />}
                            size="xs"
                            variant="ghost"
                            colorScheme="orange"
                            onClick={() => handleRemoveDeprecatedFactory(factory.address)}
                          />
                        </Flex>
                      ))}
                    </VStack>
                  </Box>
                )}
              </AccordionPanel>
            </AccordionItem>
          )}

          {/* Pool Actions - both V2 and V3 */}
          <AccordionItem border="1px solid" borderColor="inherit" borderRadius="md" mb={4}>
            <AccordionButton py={3} px={4}>
              <Flex flex="1" align="center" gap={2}>
                <Text fontWeight="bold" fontSize="md">
                  Pool Actions
                </Text>
                {selectedPools.length > 0 && (
                  <Badge colorScheme="purple" borderRadius="full">
                    {selectedPools.length}
                  </Badge>
                )}
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} minH="400px">
              {protocolVersion === "v3" && vaultActions.length > 0 && (
                <Alert status="info" mb={4}>
                  <AlertIcon />
                  <AlertDescription>
                    Optionally add specific pool actions to combine with your vault actions.
                  </AlertDescription>
                </Alert>
              )}
              <PoolSelector
                pools={availablePools}
                loading={loading}
                error={error}
                selectedPool={null}
                onPoolSelect={handlePoolSelect}
                onClearSelection={() => {}}
              />

              {selectedPools.length > 0 && (
                <Box mt={6}>
                  <Text fontSize="sm" fontWeight="bold" mb={3}>
                    Selected {protocolVersion?.toUpperCase()} Pools ({selectedPools.length})
                  </Text>
                  <VStack spacing={4}>
                    {selectedPools.map(pool => (
                      <Card key={pool.address} w="100%">
                        <CardHeader pb={2}>
                          <Flex justify="space-between" align="center">
                            <Box>
                              <Flex align="center" gap={2}>
                                <Text fontWeight="bold" fontSize="md">
                                  {pool.name}
                                </Text>
                                <Badge
                                  colorScheme={protocolVersion === "v3" ? "purple" : "blue"}
                                  size="sm"
                                >
                                  {protocolVersion?.toUpperCase()}
                                </Badge>
                                {!pool.isV3Pool && pool.pauseMethod === "setPaused" && (
                                  <Badge colorScheme="orange" size="sm">
                                    Legacy
                                  </Badge>
                                )}
                                {pool.isV3Pool && pool.poolState && (
                                  <>
                                    <Badge
                                      colorScheme={pool.poolState.isPaused ? "red" : "green"}
                                      size="sm"
                                    >
                                      {pool.poolState.isPaused ? "Paused" : "Active"}
                                    </Badge>
                                    {pool.poolState.isInRecoveryMode && (
                                      <Badge colorScheme="orange" size="sm">
                                        Recovery Mode
                                      </Badge>
                                    )}
                                  </>
                                )}
                              </Flex>
                              <Text fontSize="sm" color="font.secondary" fontFamily="mono">
                                {pool.address}
                              </Text>
                            </Box>
                            <IconButton
                              aria-label="Remove pool"
                              icon={<DeleteIcon />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleRemovePool(pool.address)}
                            />
                          </Flex>
                        </CardHeader>
                        <CardBody pt={2}>
                          <VStack spacing={4} align="stretch">
                            {pool.poolStateLoading ? (
                              <Flex align="center" gap={2} py={2}>
                                <Spinner size="sm" />
                                <Text fontSize="sm" color="font.secondary">
                                  Fetching on-chain pool state...
                                </Text>
                              </Flex>
                            ) : pool.isV3Pool ? (
                              <FormControl>
                                <FormLabel fontSize="sm">Pool Actions</FormLabel>
                                <CheckboxGroup
                                  value={pool.selectedActions}
                                  onChange={values =>
                                    handleActionChange(pool.address, values as string[])
                                  }
                                >
                                  <VStack align="stretch" spacing={3}>
                                    {/* Emergency section - only show if there are emergency actions */}
                                    {(!pool.poolState ||
                                      !pool.poolState.isPaused ||
                                      !pool.poolState.isInRecoveryMode) && (
                                      <Box>
                                        <Text
                                          fontSize="xs"
                                          fontWeight="bold"
                                          color="red.500"
                                          mb={1}
                                        >
                                          Emergency
                                        </Text>
                                        <Stack direction="row" spacing={4}>
                                          {(!pool.poolState || !pool.poolState.isPaused) && (
                                            <Checkbox value="pause" colorScheme="red">
                                              Pause Pool
                                            </Checkbox>
                                          )}
                                          {(!pool.poolState ||
                                            !pool.poolState.isInRecoveryMode) && (
                                            <Checkbox
                                              value="enableRecoveryMode"
                                              colorScheme="orange"
                                            >
                                              Enable Recovery Mode
                                            </Checkbox>
                                          )}
                                        </Stack>
                                      </Box>
                                    )}
                                    {/* Restoration section - only show if pool is paused or in recovery mode */}
                                    {(pool.poolState?.isPaused ||
                                      pool.poolState?.isInRecoveryMode) && (
                                      <Box>
                                        <Text
                                          fontSize="xs"
                                          fontWeight="bold"
                                          color="green.500"
                                          mb={1}
                                        >
                                          Restoration
                                        </Text>
                                        <Stack direction="row" spacing={4}>
                                          {pool.poolState?.isPaused && (
                                            <Checkbox value="unpause" colorScheme="green">
                                              Unpause Pool
                                            </Checkbox>
                                          )}
                                          {pool.poolState?.isInRecoveryMode && (
                                            <Checkbox
                                              value="disableRecoveryMode"
                                              colorScheme="green"
                                            >
                                              Disable Recovery Mode
                                            </Checkbox>
                                          )}
                                        </Stack>
                                      </Box>
                                    )}
                                  </VStack>
                                </CheckboxGroup>
                              </FormControl>
                            ) : (
                              <>
                                <FormControl>
                                  <FormLabel fontSize="sm">Emergency Actions</FormLabel>
                                  <CheckboxGroup
                                    value={pool.selectedActions}
                                    onChange={values =>
                                      handleActionChange(pool.address, values as string[])
                                    }
                                  >
                                    <Stack direction="row" spacing={4}>
                                      <Checkbox value="pause" colorScheme="red">
                                        Pause Pool
                                      </Checkbox>
                                      <Checkbox value="enableRecoveryMode" colorScheme="orange">
                                        Enable Recovery Mode
                                      </Checkbox>
                                    </Stack>
                                  </CheckboxGroup>
                                </FormControl>

                                {/* Individual pause method selection for V2 pools */}
                                {pool.selectedActions.includes("pause") && (
                                  <FormControl>
                                    <FormLabel fontSize="sm">
                                      <Flex align="center" gap={1}>
                                        Pause Method for this Pool
                                        <InfoIcon color="font.secondary" />
                                      </Flex>
                                    </FormLabel>
                                    <RadioGroup
                                      value={pool.pauseMethod || "pause"}
                                      onChange={(value: "pause" | "setPaused") =>
                                        handlePauseMethodChange(pool.address, value)
                                      }
                                    >
                                      <VStack align="start" spacing={2}>
                                        <Radio value="pause" size="sm">
                                          <VStack align="start" spacing={0}>
                                            <Text fontSize="sm" fontWeight="medium">
                                              pause() - Modern V2 Pools
                                            </Text>
                                            <Text fontSize="xs" color="font.secondary">
                                              Use for newer Balancer v2 pools (most common)
                                            </Text>
                                          </VStack>
                                        </Radio>
                                        <Radio value="setPaused" size="sm">
                                          <VStack align="start" spacing={0}>
                                            <Text fontSize="sm" fontWeight="medium">
                                              setPaused(true) - Legacy V2 Pools
                                            </Text>
                                            <Text fontSize="xs" color="font.secondary">
                                              Use for older pools that don&#39;t have the pause()
                                              method
                                            </Text>
                                          </VStack>
                                        </Radio>
                                      </VStack>
                                    </RadioGroup>
                                    <Text fontSize="xs" color="font.secondary" mt={2}>
                                      <strong>Not sure which to use?</strong> Try pause() first
                                      (default). If the transaction fails, switch to
                                      setPaused(true).
                                    </Text>
                                  </FormControl>
                                )}
                              </>
                            )}

                            {!pool.poolStateLoading && pool.selectedActions.length === 0 && (
                              <Alert status="warning" py={2} borderRadius="md">
                                <AlertIcon boxSize="14px" />
                                <AlertDescription fontSize="xs">
                                  No actions selected for this pool. It will be excluded from the
                                  payload.
                                </AlertDescription>
                              </Alert>
                            )}
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </Box>
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      )}

      <Flex justifyContent="space-between" alignItems="center" mt="20px" mb="10px">
        <Flex gap={2} alignItems="center">
          {!selectedPools.length &&
          !vaultActions.length &&
          !selectedFactories.length &&
          !selectedDeprecatedFactories.length ? (
            <Button variant="primary" isDisabled={true} colorScheme="red">
              {!protocolVersion
                ? "Select Protocol Version"
                : !selectedNetwork
                  ? "Select Network"
                  : "Select Actions"}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleGenerateClick}
              isDisabled={!emergencyWallet || !protocolVersion}
              colorScheme="red"
            >
              Generate Emergency Payload
            </Button>
          )}
          <ComposerButton generateData={generateComposerData} isDisabled={!generatedPayload} />
        </Flex>
        {generatedPayload && <SimulateTransactionButton batchFile={JSON.parse(generatedPayload)} />}
      </Flex>

      <Divider />

      {generatedPayload && (
        <>
          <JsonViewerEditor
            jsonData={generatedPayload}
            onJsonChange={newJson => setGeneratedPayload(newJson)}
          />

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
          </Box>

          {humanReadableText && (
            <Box mt={4}>
              <Text fontSize="lg" fontWeight="medium" mb={2}>
                Human-readable Summary
              </Text>
              <Box p={4} borderWidth="1px" borderRadius="lg" mb={3}>
                <Text whiteSpace="pre-line">{humanReadableText}</Text>
              </Box>
              <Button
                variant="secondary"
                leftIcon={<CopyIcon />}
                onClick={() => copyTextToClipboard(humanReadableText, toast)}
              >
                Copy Summary
              </Button>
            </Box>
          )}
        </>
      )}

      {generatedPayload && (
        <PRCreationModal
          type="emergency-actions"
          network={selectedNetwork}
          isOpen={isOpen}
          onClose={onClose}
          payload={generatedPayload ? JSON.parse(generatedPayload) : null}
          {...getPrefillValues()}
        />
      )}
    </Container>
  );
}
