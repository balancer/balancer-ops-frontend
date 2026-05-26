"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  VStack,
  Alert,
  AlertIcon,
  Text,
  useToast,
  Divider,
  Flex,
  useColorModeValue,
  Skeleton,
  useDisclosure,
} from "@chakra-ui/react";
import { CopyIcon, DownloadIcon, InfoIcon, EditIcon } from "@chakra-ui/icons";
import { useComposer } from "./PayloadComposerContext";
import { JsonViewerEditor } from "@/components/JsonViewerEditor";
import SimulateTransactionButton from "@/components/btns/SimulateTransactionButton";
import OpenPRButton from "@/components/btns/OpenPRButton";
import { PRCreationModal } from "@/components/modal/PRModal";
import { copyJsonToClipboard, handleDownloadClick } from "../payloadHelperFunctions";
import { generateUniqueId } from "@/lib/utils/generateUniqueID";
import { getNetworkString } from "@/lib/utils/getNetworkString";
import { NETWORK_OPTIONS } from "@/constants/constants";

interface ComposerPayloadViewerProps {
  hasManualEdits: boolean;
  setHasManualEdits: (hasEdits: boolean) => void;
}

export default function ComposerPayloadViewer({
  hasManualEdits,
  setHasManualEdits,
}: ComposerPayloadViewerProps) {
  const { operations, isMounted, combinationResult, hasErrors, hasWarnings, compatibilityCheck } =
    useComposer();
  const [editedPayload, setEditedPayload] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue("white", "background.level2");
  const borderColor = useColorModeValue("gray.200", "border.base");
  const mutedText = useColorModeValue("gray.600", "font.secondary");
  const lightText = useColorModeValue("gray.500", "gray.400");
  const iconColor = useColorModeValue("gray.400", "gray.500");

  // Format the payload for display
  const formattedPayload = (() => {
    if (!combinationResult.success || !combinationResult.payload || hasErrors) {
      return null;
    }
    return JSON.stringify(combinationResult.payload, null, 2);
  })();

  // Update edited payload when the base payload changes
  useEffect(() => {
    if (formattedPayload && !hasManualEdits) {
      setEditedPayload(formattedPayload);
    }
  }, [formattedPayload, hasManualEdits]);

  // Get the current payload to use (edited version or original)
  const currentPayload = hasManualEdits ? editedPayload : formattedPayload || "";

  // Get primary network for PR creation
  const primaryNetwork = (() => {
    if (!combinationResult.payload?.chainId) return "";
    return getNetworkString(Number(combinationResult.payload.chainId));
  })();

  const getPrefillValues = () => {
    if (!currentPayload || operations.length === 0) {
      return {
        prefillBranchName: "",
        prefillPrName: "",
        prefillDescription: "",
        prefillFilename: "",
      };
    }

    // Generate a unique ID for the branch and file
    const uniqueId = generateUniqueId();

    // Get network name for path
    const networkOption = NETWORK_OPTIONS.find(n => n.apiID === primaryNetwork);
    const networkName = networkOption?.label;
    const networkPath = networkName === "Ethereum" ? "Mainnet" : networkName;
    const chainId = networkOption?.chainId || primaryNetwork;

    // Create descriptive title based on operations, grouping duplicates
    const operationCounts = new Map<string, number>();
    operations.forEach(op => {
      const title = op.title || op.type;
      operationCounts.set(title, (operationCounts.get(title) || 0) + 1);
    });

    const uniqueTitles = Array.from(operationCounts.entries())
      .map(([title, count]) => (count > 1 ? `${title} (${count}x)` : title))
      .slice(0, 3);

    const remainingCount = Math.max(0, operationCounts.size - 3);
    const titleSuffix = remainingCount > 0 ? ` (+${remainingCount} more)` : "";
    const combinedTitle = uniqueTitles.join(", ") + titleSuffix;

    // Create description
    const operationsList = operations
      .map(
        (op, index) =>
          `${index + 1}. ${op.title || op.type}: ${op.description || "No description"}`,
      )
      .join("\n");

    return {
      prefillBranchName: `feature/combined-operations-${uniqueId}`,
      prefillPrName: `Combined Payload: ${combinedTitle}`,
      prefillDescription: `This PR combines ${operations.length} operations into a single transaction on ${networkName}:\n\n${operationsList}`,
      prefillFilename: `combined-operations-${chainId}-${uniqueId}.json`,
    };
  };

  const handleOpenPRModal = () => {
    if (currentPayload) {
      onOpen();
    } else {
      toast({
        title: "No payload generated",
        description: "Please add operations to generate a payload first",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleJsonChange = (newJson: string | any) => {
    const jsonString = typeof newJson === "string" ? newJson : JSON.stringify(newJson, null, 2);
    setEditedPayload(jsonString);
    setHasManualEdits(true);
  };

  const handleCopy = () => {
    if (currentPayload) {
      copyJsonToClipboard(currentPayload, toast);
    }
  };

  const handleDownload = () => {
    if (currentPayload) {
      handleDownloadClick(currentPayload);
    }
  };

  const handleResetToOriginal = () => {
    if (formattedPayload) {
      setEditedPayload(formattedPayload);
      setHasManualEdits(false);
      toast({
        title: "Reset to Original",
        description: "Payload has been reset to the generated version",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Show loading skeleton during hydration to prevent mismatches
  if (!isMounted) {
    return (
      <VStack spacing={6} align="stretch">
        <Skeleton height="200px" borderRadius="lg" />
        <Skeleton height="80px" borderRadius="lg" />
        <Skeleton height="400px" borderRadius="lg" />
      </VStack>
    );
  }

  // Handle empty or error states
  if (operations.length === 0) {
    return (
      <Box p={6} bg={bgColor} borderRadius="lg" border="1px" borderColor={borderColor}>
        <VStack spacing={4} textAlign="center">
          <InfoIcon boxSize={8} color={iconColor} />
          <Text color={mutedText} fontSize="lg">
            No operations to combine
          </Text>
          <Text color={lightText} fontSize="sm">
            Add operations to your Composer to generate a combined payload
          </Text>
        </VStack>
      </Box>
    );
  }

  if (hasErrors) {
    return (
      <Box p={6} bg={bgColor} borderRadius="lg" border="1px" borderColor={borderColor}>
        <VStack spacing={4} align="stretch">
          <Alert status="error">
            <AlertIcon />
            <VStack align="start" spacing={2} flex="1">
              <Text fontWeight="medium">Cannot Construct Payload</Text>
              <Text fontSize="sm">Please resolve the errors.</Text>
            </VStack>
          </Alert>
        </VStack>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {hasManualEdits && (
        <Alert status="info">
          <Flex justifyContent="space-between" alignItems="center" flex="1">
            <AlertIcon />
            <VStack align="start" spacing={1} flex="1">
              <Box>
                <Text fontWeight="medium">Manual Edits Applied</Text>
                <Text fontSize="sm" color={mutedText} mt={1}>
                  The payload has been manually edited. Changes won't sync back to individual
                  operations above.
                </Text>
              </Box>
            </VStack>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<EditIcon />}
              onClick={handleResetToOriginal}
            >
              Reset To Original
            </Button>
          </Flex>
        </Alert>
      )}

      {/* Simulate Transaction Button - moved to top */}
      <Flex justifyContent="flex-end">
        {currentPayload && <SimulateTransactionButton batchFile={JSON.parse(currentPayload)} />}
      </Flex>

      <Divider />

      {/* Payload JSON Viewer */}
      {currentPayload && (
        <JsonViewerEditor jsonData={currentPayload} onJsonChange={handleJsonChange} />
      )}

      {/* Action Buttons - moved below JSON viewer */}
      {currentPayload && (
        <Box display="flex" alignItems="center" mt="20px">
          <Button
            variant="secondary"
            mr="10px"
            leftIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Download Payload
          </Button>
          <Button variant="secondary" mr="10px" leftIcon={<CopyIcon />} onClick={handleCopy}>
            Copy Payload to Clipboard
          </Button>
          <OpenPRButton onClick={handleOpenPRModal} network={primaryNetwork} />
          <PRCreationModal
            type="payload-composer"
            isOpen={isOpen}
            onClose={onClose}
            network={primaryNetwork}
            payload={currentPayload ? JSON.parse(currentPayload) : null}
            {...getPrefillValues()}
          />
        </Box>
      )}
    </VStack>
  );
}
