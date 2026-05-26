"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  Text,
  useDisclosure,
  useMediaQuery,
  useToast,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { ChevronDownIcon, CopyIcon, DownloadIcon, ExternalLinkIcon } from "@chakra-ui/icons";

import { AddressOption } from "@/types/interfaces";
import SimulateTransactionButton, { BatchFile } from "@/components/btns/SimulateTransactionButton";
import { PRCreationModal } from "@/components/modal/PRModal";
import {
  copyJsonToClipboard,
  generateInjectorSchedulePayload,
  handleDownloadClick,
  InjectorScheduleInput,
} from "@/app/payload-builder/payloadHelperFunctions";
import { RewardsInjectorData } from "@/components/tables/RewardsInjectorTable";
import { networks } from "@/constants/constants";
import { formatTokenName } from "@/lib/utils/formatTokenName";
import { EditableInjectorConfig } from "./EditableInjectorConfig";
import OpenPRButton from "./btns/OpenPRButton";
import { JsonViewerEditor } from "@/components/JsonViewerEditor";
import { getChainId } from "@/lib/utils/getChainId";
import { generateUniqueId } from "@/lib/utils/generateUniqueID";
import ComposerButton from "@/app/payload-builder/composer/ComposerButton";
import ComposerIndicator from "@/app/payload-builder/composer/ComposerIndicator";

type RewardsInjectorConfiguratorProps = {
  addresses: AddressOption[];
  selectedAddress: AddressOption | null;
  onAddressSelect: (address: AddressOption) => void;
  selectedSafe: string;
  injectorData: any;
  isLoading: boolean;
  onVersionToggle: () => void;
  isV2: boolean;
};

function RewardsInjectorConfigurator({
  addresses,
  selectedAddress,
  onAddressSelect,
  selectedSafe,
  injectorData,
  isLoading,
  isV2,
  onVersionToggle,
}: RewardsInjectorConfiguratorProps) {
  const [gauges, setGauges] = useState<RewardsInjectorData[]>([]);
  const [contractBalance, setContractBalance] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(0);
  const [currentConfig, setCurrentConfig] = useState<RewardsInjectorData[]>([]);
  const [generatedPayload, setGeneratedPayload] = useState<BatchFile | null>(null);
  const [isMobile] = useMediaQuery("(max-width: 48em)");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log(currentConfig);

  useEffect(() => {
    if (selectedAddress && injectorData) {
      setTokenSymbol(injectorData.tokenInfo.symbol);
      setTokenDecimals(injectorData.tokenInfo.decimals);
      setGauges(injectorData.gauges);
      setContractBalance(injectorData.contractBalance);
      setCurrentConfig(injectorData.gauges);
    }
  }, [selectedAddress, injectorData]);

  const handleConfigChange = (newConfig: RewardsInjectorData[]) => {
    setCurrentConfig(newConfig);
  };

  const calculateDistributionAmounts = (config: RewardsInjectorData[]) => {
    let total = 0;
    let distributed = 0;
    let remaining = 0;

    config.forEach(gauge => {
      const amount = parseFloat(gauge.amountPerPeriod!) || 0;
      const maxPeriods = parseInt(gauge.maxPeriods) || 0;
      const currentPeriod = parseInt(gauge.periodNumber) || 0;

      const gaugeTotal = amount * maxPeriods;
      const gaugeDistributed = amount * currentPeriod;

      total += gaugeTotal;
      distributed += gaugeDistributed;
      remaining += gaugeTotal - gaugeDistributed;
    });

    return { total, distributed, remaining };
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const currentDistribution = calculateDistributionAmounts(gauges);
  const newDistribution = calculateDistributionAmounts(currentConfig);
  const distributionDelta = newDistribution.total - currentDistribution.total;

  const generatePayload = () => {
    if (!selectedAddress || currentConfig.length === 0) {
      toast({
        title: "Invalid Input",
        description: "Please select an injector and configure at least one gauge.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const scheduleInputs: InjectorScheduleInput[] = currentConfig.map(gauge => ({
      gaugeAddress: gauge.gaugeAddress,
      amountPerPeriod: gauge.amountPerPeriod,
      rawAmountPerPeriod: gauge.rawAmountPerPeriod,
      maxPeriods: gauge.maxPeriods,
    }));

    const payload = generateInjectorSchedulePayload({
      injectorType: isV2 ? "v2" : "v1",
      injectorAddress: selectedAddress.address,
      chainId: getChainId(selectedAddress.network),
      safeAddress: selectedSafe,
      scheduleInputs,
    });

    setGeneratedPayload(payload);
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

  const handleJsonChange = (newJson: string | BatchFile) => {
    setGeneratedPayload(newJson as BatchFile);
  };

  const getPrefillValues = () => {
    // Make sure we have a selected injector and configuration
    if (!selectedAddress || !currentConfig.length || !generatedPayload) return {};

    // Generate a unique ID for the branch and file
    const uniqueId = generateUniqueId();

    // Get injector details for the filename and description
    const shortInjectorId = selectedAddress.address.substring(0, 8);
    const networkName = selectedAddress.network;

    // Determine what changed between original and current config
    const changes = calculateConfigChanges(gauges, currentConfig);

    // Create a descriptive summary
    let changeDescription = [];
    if (changes.addedGauges > 0) {
      changeDescription.push(
        `added ${changes.addedGauges} gauge${changes.addedGauges !== 1 ? "s" : ""}`,
      );
    }
    if (changes.removedGauges > 0) {
      changeDescription.push(
        `removed ${changes.removedGauges} gauge${changes.removedGauges !== 1 ? "s" : ""}`,
      );
    }
    if (changes.modifiedGauges > 0) {
      changeDescription.push(
        `modified ${changes.modifiedGauges} gauge${changes.modifiedGauges !== 1 ? "s" : ""}`,
      );
    }

    // Join the changes with appropriate punctuation
    let changeSummary = changeDescription.join(", ");

    // Add distribution change information
    const distributionChangeText =
      distributionDelta !== 0
        ? ` with a net ${distributionDelta > 0 ? "increase" : "decrease"} of ${formatAmount(Math.abs(distributionDelta))} ${tokenSymbol}`
        : "";

    // Create the filename without any path prefix - the path will come from config
    const chainId = getChainId(networkName);
    const filename = `injector-config-${chainId}-${shortInjectorId}-${uniqueId}.json`;

    return {
      prefillBranchName: `feature/injector-config-${shortInjectorId}-${uniqueId}`,
      prefillPrName: `Update ${tokenSymbol} Injector Configuration on ${networkName}`,
      prefillDescription: `This PR updates the rewards injector at ${selectedAddress.address} on ${networkName}, ${changeSummary}${distributionChangeText}.`,
      prefillFilename: filename,
    };
  };

  const calculateConfigChanges = (
    originalConfig: RewardsInjectorData[],
    newConfig: RewardsInjectorData[],
  ) => {
    const addedGauges = newConfig.filter(
      gauge => !originalConfig.some(g => g.gaugeAddress === gauge.gaugeAddress),
    ).length;

    const removedGauges = originalConfig.filter(
      gauge => !newConfig.some(g => g.gaugeAddress === gauge.gaugeAddress),
    ).length;

    const modifiedGauges = newConfig.filter(gauge => {
      const original = originalConfig.find(g => g.gaugeAddress === gauge.gaugeAddress);
      return (
        original &&
        (original.amountPerPeriod !== gauge.amountPerPeriod ||
          original.maxPeriods !== gauge.maxPeriods)
      );
    }).length;

    return {
      addedGauges,
      removedGauges,
      modifiedGauges,
      totalChanges: addedGauges + removedGauges + modifiedGauges,
    };
  };

  const generateComposerData = () => {
    if (!generatedPayload) return null;

    const payload =
      typeof generatedPayload === "string" ? JSON.parse(generatedPayload) : generatedPayload;

    // Determine what changed between original and current config
    const changes = calculateConfigChanges(gauges, currentConfig);

    // Extract key parameters from the payload
    const injectorAddress = selectedAddress?.address;

    return {
      type: "injector-configurator",
      title: "Update Rewards Injector Configuration",
      description: `Update rewards injector configurations with ${changes.totalChanges} change${changes.totalChanges !== 1 ? "s" : ""}.`,
      payload: payload,
      params: {
        injectorAddress: injectorAddress,
        addedGauges: changes.addedGauges,
        removedGauges: changes.removedGauges,
        modifiedGauges: changes.modifiedGauges,
      },
      builderPath: "injector-configurator",
    };
  };

  return (
    <Container maxW="container.xl">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={6}
        direction={{ base: "column", md: "row" }}
        gap={4}
      >
        <Box>
          <Heading as="h2" size="lg" variant="special">
            Injector Schedule Payload Configurator
          </Heading>
          <Text>
            Build a injector schedule payload to configure reward emissions on a gauge set.
          </Text>
        </Box>
        <Box width={{ base: "full", md: "auto" }}>
          <ComposerIndicator />
        </Box>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" verticalAlign="center" mb={4}>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            isDisabled={isLoading}
            whiteSpace="normal"
            height="auto"
            blockSize="auto"
            w="100%"
          >
            {selectedAddress ? (
              <Flex alignItems="center">
                <Image
                  src={networks[selectedAddress.network]?.logo}
                  alt={`${selectedAddress.network} logo`}
                  boxSize="20px"
                  mr={2}
                />
                <Text>
                  <Text as="span" fontFamily="mono" isTruncated>
                    {isMobile
                      ? `${selectedAddress.address.slice(0, 6)}...`
                      : selectedAddress.address}
                  </Text>
                  {" - "}
                  {formatTokenName(selectedAddress.token)}
                </Text>
              </Flex>
            ) : (
              <Text>Select an injector</Text>
            )}
          </MenuButton>
          <MenuList w="135%" maxHeight="60vh" overflowY="auto">
            {addresses.map(address => (
              <MenuItem
                key={address.network + address.token}
                onClick={() => onAddressSelect(address)}
                w="100%"
              >
                <Flex alignItems="center" w="100%">
                  <Image
                    src={networks[address.network]?.logo}
                    alt={`${address.network} logo`}
                    boxSize="20px"
                    mr={2}
                  />
                  <Text>
                    <Text as="span" fontFamily="mono" isTruncated>
                      {address.address}
                    </Text>
                    {" - "}
                    {formatTokenName(address.token)}
                  </Text>
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        {selectedAddress && (
          <IconButton
            aria-label={""}
            as="a"
            href={`${networks[selectedAddress.network.toLowerCase()].explorer}address/${selectedAddress.address}`}
            target="_blank"
            rel="noopener noreferrer"
            size="m"
            icon={<ExternalLinkIcon />}
            variant="ghost"
            ml={2}
          />
        )}

        <FormControl display="flex" alignItems="center" w="auto" marginLeft={10}>
          <FormLabel htmlFor="version-switch" mb="0">
            V1
          </FormLabel>
          <Switch
            size={"lg"}
            id="version-switch"
            isChecked={isV2}
            onChange={() => {
              setGauges([]);
              setCurrentConfig([]);
              onVersionToggle();
            }}
          />
          <FormLabel htmlFor="version-switch" mb="0" ml={2}>
            V2
          </FormLabel>
        </FormControl>
      </Flex>

      {selectedAddress && !isLoading && (
        <>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
            <Card>
              <CardBody>
                <Stack spacing={3}>
                  <Heading size="md">Current Total Distribution</Heading>
                  <Text fontSize="2xl" fontWeight="bold">
                    {formatAmount(currentDistribution.total)} {tokenSymbol}
                  </Text>
                </Stack>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Stack spacing={3}>
                  <Heading size="md">New Total Distribution</Heading>
                  <Text fontSize="2xl" fontWeight="bold">
                    {formatAmount(newDistribution.total)} {tokenSymbol}
                  </Text>
                </Stack>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Stack spacing={3}>
                  <Heading size="md">Distribution Delta</Heading>
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color={distributionDelta >= 0 ? "green.500" : "red.500"}
                  >
                    {distributionDelta >= 0 ? "+" : ""}
                    {formatAmount(distributionDelta)} {tokenSymbol}
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {distributionDelta > contractBalance && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              <AlertTitle mr={2}>Insufficient Funds!</AlertTitle>
              <AlertDescription>
                Additional {formatAmount(distributionDelta - contractBalance)} {tokenSymbol}{" "}
                required to complete all distributions.
              </AlertDescription>
            </Alert>
          )}

          <Box mt={6}>
            <Heading as="h2" size="lg" mb={4}>
              Current Configuration
            </Heading>

            <EditableInjectorConfig
              data={currentConfig}
              tokenSymbol={tokenSymbol}
              tokenDecimals={tokenDecimals}
              onConfigChange={handleConfigChange}
            />
          </Box>
        </>
      )}

      {isLoading && (
        <Flex justifyContent="center" alignItems="center" height="200px">
          <Spinner size="xl" />
        </Flex>
      )}

      {selectedAddress && !isLoading && (
        <Flex justifyContent="space-between" mt={6} mb={6}>
          <Flex gap={2} alignItems="center">
            <Button colorScheme="blue" onClick={generatePayload}>
              Generate Payload
            </Button>
            <ComposerButton generateData={generateComposerData} isDisabled={!generatedPayload} />
          </Flex>
          {generatedPayload && <SimulateTransactionButton batchFile={generatedPayload} />}
        </Flex>
      )}
      <Divider />

      {!selectedAddress ||
        (!selectedSafe && !isLoading && (
          <Alert status="warning" mb={4}>
            <AlertIcon />
            <AlertDescription>
              This injector does not have an owner configured yet. Make sure to set an owner first
              before attempting to configure this injector.
            </AlertDescription>
          </Alert>
        ))}

      {generatedPayload && (
        <JsonViewerEditor jsonData={generatedPayload} onJsonChange={handleJsonChange} />
      )}

      {generatedPayload && (
        <Box display="flex" alignItems="center" mt="20px">
          <Button
            variant="secondary"
            mr="10px"
            leftIcon={<DownloadIcon />}
            onClick={() => handleDownloadClick(JSON.stringify(generatedPayload))}
          >
            Download Payload
          </Button>
          <Button
            variant="secondary"
            mr="10px"
            leftIcon={<CopyIcon />}
            onClick={() => copyJsonToClipboard(JSON.stringify(generatedPayload), toast)}
          >
            Copy Payload to Clipboard
          </Button>
          <OpenPRButton onClick={handleOpenPRModal} />
          <Box mt={8} />
          <PRCreationModal
            type={"injector-configurator"}
            isOpen={isOpen}
            onClose={onClose}
            payload={generatedPayload ? JSON.parse(JSON.stringify(generatedPayload)) : null}
            network={selectedAddress ? selectedAddress.network.toLowerCase() : "mainnet"}
            {...getPrefillValues()}
          />
        </Box>
      )}
    </Container>
  );
}

export default RewardsInjectorConfigurator;
