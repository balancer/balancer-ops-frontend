"use client";
import React, { useEffect, useReducer, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
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
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Tag,
  TagCloseButton,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { CopyIcon, DownloadIcon, HamburgerIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { ActionIdsData, AddressBook, Permission, ReverseAddressBook } from "@/types/interfaces";
import { NETWORK_OPTIONS, networks } from "@/constants/constants";
import { getNetworksForFeature } from "@/constants/networkFeatures";
import { getAddress, getCategoryData } from "@/lib/data/balancer/addressBook";
import SimulateTransactionButton, { BatchFile } from "@/components/btns/SimulateTransactionButton";
import { JsonViewerEditor } from "@/components/JsonViewerEditor";
import { NetworkSelector } from "@/components/NetworkSelector";
import SearchableAddressInput from "@/components/SearchableAddressInput";
import PermissionsTable from "@/components/tables/PermissionsTable";
import GroupedPermissionsList from "./GroupedPermissionsList";
import {
  copyJsonToClipboard,
  generateHumanReadablePermissions,
  handleDownloadClick,
  PermissionInput,
  transformToHumanReadable,
} from "@/app/payload-builder/payloadHelperFunctions";
import OpenPRButton from "@/components/btns/OpenPRButton";
import { PRCreationModal } from "@/components/modal/PRModal";
import { generateUniqueId } from "@/lib/utils/generateUniqueID";
import { PermissionsAction } from "@/types/types";
import ComposerButton from "@/app/payload-builder/composer/ComposerButton";
import ComposerIndicator from "@/app/payload-builder/composer/ComposerIndicator";

export interface PermissionsPayloadBuilderProps {
  addressBook: AddressBook;
}

// State interfaces
interface PermissionsState {
  allPermissions: Permission[];
  filteredPermissions: Permission[];
  selectedPermissions: string[];
  currentPermissions: string[];
  actionIdDescriptions: Record<string, string>;
  loading: boolean;
  permissionsLoading: boolean;
  currentPage: number;
  permissionsPerPage: number;
}

// Component prop interfaces
interface PermissionTagProps {
  permission: string;
  description: string;
  deployment?: string;
  onRemove: (actionId: string) => void;
}

interface VirtualizedPermissionsListProps {
  permissions: Permission[];
  selectedPermissions: string[];
  onToggle: (actionId: string) => void;
  loading: boolean;
}

interface PermissionRowProps {
  index: number;
  style: React.CSSProperties;
}

// Initial state for permissions reducer
const initialPermissionsState: PermissionsState = {
  allPermissions: [],
  filteredPermissions: [],
  selectedPermissions: [],
  currentPermissions: [],
  actionIdDescriptions: {},
  loading: false,
  permissionsLoading: false,
  currentPage: 1,
  permissionsPerPage: 10,
};

// Custom hook types
interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// View type enum
enum PermissionViewType {
  LIST = "list",
  GROUPED = "grouped",
}

// Reducer for handling permissions-related state
function permissionsReducer(state: PermissionsState, action: PermissionsAction): PermissionsState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_PERMISSIONS_LOADING":
      return { ...state, permissionsLoading: action.payload };
    case "SET_ALL_PERMISSIONS":
      return {
        ...state,
        allPermissions: action.payload.permissions,
        actionIdDescriptions: action.payload.descriptions,
        filteredPermissions: action.payload.permissions,
        loading: false,
      };
    case "SET_CURRENT_PERMISSIONS":
      return {
        ...state,
        currentPermissions: action.payload,
        permissionsLoading: false,
        currentPage: 1,
      };
    case "SET_FILTERED_PERMISSIONS":
      return { ...state, filteredPermissions: action.payload };
    case "TOGGLE_PERMISSION":
      return {
        ...state,
        selectedPermissions: state.selectedPermissions.includes(action.payload)
          ? state.selectedPermissions.filter(id => id !== action.payload)
          : [...state.selectedPermissions, action.payload],
      };
    case "REMOVE_PERMISSION":
      return {
        ...state,
        selectedPermissions: state.selectedPermissions.filter(id => id !== action.payload),
      };
    case "CLEAR_SELECTED_PERMISSIONS":
      return { ...state, selectedPermissions: [] };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_PER_PAGE":
      return { ...state, permissionsPerPage: action.payload, currentPage: 1 };
    case "RESET_PERMISSIONS":
      return {
        ...state,
        selectedPermissions: [],
        currentPermissions: [],
        currentPage: 1,
      };
    default:
      return state;
  }
}

// Custom hook for debouncing values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Memoized permission tag component
const PermissionTag: React.FC<PermissionTagProps> = React.memo(
  ({ permission, description, deployment, onRemove }) => {
    // Format deployment info for better readability
    const formattedDeployment = (() => {
      if (!deployment) return null;

      try {
        // Extract date and version information
        const isV3 = deployment.includes("-v3-");
        const version = isV3 ? "v3" : "v2";

        const dateMatch = deployment.match(/^(\d{8})/);
        let formattedDate = "";

        if (dateMatch) {
          const dateStr = dateMatch[1];
          const year = dateStr.substring(0, 4);
          const month = dateStr.substring(4, 6);
          const day = dateStr.substring(6, 8);
          formattedDate = `${year}-${month}-${day}`;
        }

        return { date: formattedDate, version };
      } catch {
        return { date: "", version: "v2" };
      }
    })();

    // Extract contract and function name from description
    const [contract, funcName] = description.split(".");

    return (
      <Popover trigger="hover" placement="top-start" closeDelay={200}>
        <PopoverTrigger>
          <Tag
            colorScheme="green"
            size="md"
            borderRadius="md"
            mb={1}
            p={2}
            height="auto"
            maxW="100%"
          >
            <Box>
              <Flex alignItems="center" mb={1}>
                <Text as="span" fontWeight="bold" fontSize="sm">
                  {contract}
                </Text>
                <Text as="span" fontSize="sm" ml={1}>
                  .{funcName}
                </Text>
                {formattedDeployment && (
                  <HStack spacing={1} ml={2}>
                    <Badge colorScheme={formattedDeployment.version === "v3" ? "purple" : "blue"}>
                      {formattedDeployment.version}
                    </Badge>
                    {formattedDeployment.date && (
                      <Badge variant="outline" colorScheme="gray">
                        {formattedDeployment.date}
                      </Badge>
                    )}
                  </HStack>
                )}
              </Flex>
              <Text as="span" fontSize="xs" color="gray.500" fontFamily="monospace" noOfLines={1}>
                {permission.substring(0, 26)}...
              </Text>
            </Box>
            <TagCloseButton onClick={() => onRemove(permission)} ml={2} />
          </Tag>
        </PopoverTrigger>
        <PopoverContent width="400px" maxW="90vw" p={0}>
          <PopoverArrow />
          <PopoverBody p={3}>
            <Box>
              <Flex justifyContent="space-between" alignItems="center" mb={2}>
                <Text fontSize="sm" fontWeight="bold">
                  Permission Details
                </Text>
                {formattedDeployment && (
                  <HStack>
                    <Badge colorScheme={formattedDeployment.version === "v3" ? "purple" : "blue"}>
                      {formattedDeployment.version}
                    </Badge>
                    {formattedDeployment.date && (
                      <Badge variant="outline" colorScheme="gray">
                        {formattedDeployment.date}
                      </Badge>
                    )}
                  </HStack>
                )}
              </Flex>

              <Box p={2} borderRadius="md" mb={2}>
                <Text fontWeight="medium" fontSize="sm">
                  Deployment:
                </Text>
                <Text fontSize="sm" mb={2}>
                  {deployment}
                </Text>

                <Text fontWeight="medium" fontSize="sm">
                  Function:
                </Text>
                <Text fontSize="sm" mb={2}>
                  {description}
                </Text>

                <Text fontWeight="medium" fontSize="sm">
                  Action ID:
                </Text>
                <Text fontSize="xs" fontFamily="monospace" wordBreak="break-all">
                  {permission}
                </Text>
              </Box>

              <Button size="xs" colorScheme="red" onClick={() => onRemove(permission)} width="full">
                Remove Permission
              </Button>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  },
);

PermissionTag.displayName = "PermissionTag";

// Memoized permissions list component with virtualization
const VirtualizedPermissionsList: React.FC<VirtualizedPermissionsListProps> = React.memo(
  ({ permissions, selectedPermissions, onToggle, loading }) => {
    if (loading) {
      return (
        <Flex justify="center" align="center" p={4}>
          <Spinner />
        </Flex>
      );
    }

    if (!permissions.length) {
      return <Text>No matching permissions found</Text>;
    }

    const PermissionRow = ({ index, style }: ListChildComponentProps) => {
      const permission = permissions[index];
      return (
        <div style={style as React.CSSProperties}>
          <Checkbox
            isChecked={selectedPermissions.includes(permission.actionId)}
            onChange={() => onToggle(permission.actionId)}
            colorScheme="green"
          >
            <Flex direction="column">
              <Text fontSize="sm">{permission.description}</Text>
              <Text color="gray.500" fontSize="xs" fontFamily="monospace">
                {permission.actionId}
              </Text>
            </Flex>
          </Checkbox>
        </div>
      );
    };

    return (
      <List
        height={500}
        itemCount={permissions.length}
        itemSize={50}
        width="100%"
        overscanCount={5}
      >
        {PermissionRow}
      </List>
    );
  },
);

VirtualizedPermissionsList.displayName = "VirtualizedPermissionsList";

const PermissionsPayloadBuilder: React.FC<PermissionsPayloadBuilderProps> = ({ addressBook }) => {
  const toast = useToast();

  // Network related state
  const [selectedNetwork, setSelectedNetwork] = useState<string>("mainnet");

  // Wallet related state
  const [availableWallets, setAvailableWallets] = useState<Record<string, string>>({});
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [customWalletInput, setCustomWalletInput] = useState<string>("");
  const [daoAddress, setDAOAddress] = useState<string>("");
  const [authorizerAdaptor, setAuthorizerAdaptor] = useState<string>("");
  const [versionFilter, setVersionFilter] = useState<string>("all");
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Reverse lookup state
  const [reverseAddressBook, setReverseAddressBook] = useState<ReverseAddressBook>({});

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);

  // View state
  const [permissionViewType, setPermissionViewType] = useState<PermissionViewType>(
    PermissionViewType.GROUPED,
  );

  // Payload state
  const [generatedPayload, setGeneratedPayload] = useState<string | BatchFile | null>(null);
  const [humanReadableText, setHumanReadableText] = useState<string | null>(null);

  // Use reducer for permissions-related state
  const [permissionsState, dispatchPermissions] = useReducer(
    permissionsReducer,
    initialPermissionsState,
  );

  // Filter networks
  const filteredNetworkOptions = getNetworksForFeature("permissions");

  // Load wallets when network changes
  useEffect(() => {
    loadWallets();
  }, [selectedNetwork, addressBook]);

  // Load action IDs and reverse lookup on network change
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      dispatchPermissions({ type: "SET_LOADING", payload: true });
      await Promise.all([loadActionIds(), loadReverseLookup()]);
      dispatchPermissions({ type: "SET_LOADING", payload: false });
    };

    fetchData();
  }, [selectedNetwork]);

  // Version Filter
  useEffect(() => {
    if (versionFilter === "all") {
      // Keep all permissions but apply search filter if present
      dispatchPermissions({
        type: "SET_FILTERED_PERMISSIONS",
        payload: permissionsState.allPermissions.filter(p =>
          debouncedSearchTerm
            ? p.actionId.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
              p.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
              p.deployment.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            : true,
        ),
      });
    } else if (versionFilter === "v3") {
      // Filter for V3: deployment contains '-v3-'
      const filtered = permissionsState.allPermissions.filter(p => {
        const isV3 = p.deployment.includes("-v3-");

        // Apply search filter if present
        const matchesSearch = debouncedSearchTerm
          ? p.actionId.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            p.deployment.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          : true;

        return isV3 && matchesSearch;
      });

      dispatchPermissions({ type: "SET_FILTERED_PERMISSIONS", payload: filtered });
    } else if (versionFilter === "v2") {
      // Filter for V2: deployment does NOT contain '-v3-'
      const filtered = permissionsState.allPermissions.filter(p => {
        const isV2 = !p.deployment.includes("-v3-");

        // Apply search filter if present
        const matchesSearch = debouncedSearchTerm
          ? p.actionId.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            p.deployment.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          : true;

        return isV2 && matchesSearch;
      });

      dispatchPermissions({ type: "SET_FILTERED_PERMISSIONS", payload: filtered });
    }
  }, [versionFilter, debouncedSearchTerm, permissionsState.allPermissions]);

  // Load permissions when wallet changes
  useEffect(() => {
    if (selectedWallet) {
      loadWalletPermissions();
    }
  }, [selectedWallet, selectedNetwork]);

  // Filter permissions based on search term
  useEffect(() => {
    if (debouncedSearchTerm.trim() === "") {
      dispatchPermissions({
        type: "SET_FILTERED_PERMISSIONS",
        payload: permissionsState.allPermissions,
      });
    } else {
      const lowercasedSearchTerm = debouncedSearchTerm.toLowerCase();
      const filtered = permissionsState.allPermissions.filter(
        permission =>
          permission.actionId.toLowerCase().includes(lowercasedSearchTerm) ||
          permission.description.toLowerCase().includes(lowercasedSearchTerm) ||
          permission.deployment.toLowerCase().includes(lowercasedSearchTerm),
      );
      dispatchPermissions({ type: "SET_FILTERED_PERMISSIONS", payload: filtered });
    }
  }, [debouncedSearchTerm, permissionsState.allPermissions]);

  // Memoized sorted and paginated permissions
  const sortedCurrentPermissions = [...permissionsState.currentPermissions].sort((a, b) => {
    const descA = permissionsState.actionIdDescriptions[a] || a;
    const descB = permissionsState.actionIdDescriptions[b] || b;
    return descA.toLowerCase().localeCompare(descB.toLowerCase());
  });

  const paginatedPermissions = ((): string[] => {
    const startIndex = (permissionsState.currentPage - 1) * permissionsState.permissionsPerPage;
    const endIndex = startIndex + permissionsState.permissionsPerPage;
    return sortedCurrentPermissions.slice(startIndex, endIndex);
  })();

  const totalPages = Math.ceil(sortedCurrentPermissions.length / permissionsState.permissionsPerPage);

  // Load wallets for the selected network
  const loadWallets = (): void => {
    const multisigs = getCategoryData(addressBook, selectedNetwork, "multisigs");
    const formattedAddresses: Record<string, string> = {};

    if (multisigs && typeof multisigs === "object") {
      Object.entries(multisigs).forEach(([key, value]) => {
        if (typeof value === "string") {
          formattedAddresses[`multisig.${key}`] = value;
        } else if (typeof value === "object" && value !== null) {
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            if (typeof nestedValue === "string") {
              formattedAddresses[`multisig.${key}.${nestedKey}`] = nestedValue;
            }
          });
        }
      });
    }

    const authorizer = getAddress(
      addressBook,
      selectedNetwork,
      "20210418-authorizer",
      "Authorizer",
    );

    // On Ethereum mainnet the DAO multisig holds the authorizer admin role and
    // acts as the granter. On every other chain it's the Omni multisig instead.
    const isMainnet = selectedNetwork === "mainnet";
    const daoWallet = isMainnet
      ? getAddress(addressBook, selectedNetwork, "multisigs", "dao")
      : getAddress(addressBook, selectedNetwork, "multisigs", "omni") ||
        getAddress(addressBook, selectedNetwork, "multisigs", "dao");

    setAuthorizerAdaptor(authorizer || "");
    setDAOAddress(daoWallet || "");
    setAvailableWallets(formattedAddresses);
    setSelectedWallet("");
    setCustomWalletInput("");

    // Reset permissions state when network changes
    dispatchPermissions({ type: "RESET_PERMISSIONS" });
    setGeneratedPayload(null);
    setHumanReadableText(null);
  };

  // Load reverse lookup data
  const loadReverseLookup = async (): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/balancer/bal_addresses/main/outputs/${selectedNetwork}_reverse.json`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch reverse lookup data: ${response.statusText}`);
      }

      const data = (await response.json()) as ReverseAddressBook;
      setReverseAddressBook(data);
      return true;
    } catch (error) {
      console.error("Error loading reverse lookup:", error);
      toast({
        title: "Error loading reverse lookup",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  };

  // Load action IDs
  const loadActionIds = async (): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/balancer/balancer-deployments/master/action-ids/${selectedNetwork}/action-ids.json`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch action IDs: ${response.statusText}`);
      }

      const data = (await response.json()) as ActionIdsData;

      // Transform the data
      const permissionsArray: Permission[] = [];
      const descriptionsMap: Record<string, string> = {};

      for (const [deployment, contracts] of Object.entries(data)) {
        for (const [contract, contractData] of Object.entries(contracts)) {
          if (contractData.actionIds) {
            for (const [functionName, actionId] of Object.entries(contractData.actionIds)) {
              // Only add if not already in the array (avoid duplicates)
              if (!descriptionsMap[actionId]) {
                permissionsArray.push({
                  actionId,
                  description: `${contract}.${functionName}`,
                  deployment,
                  selected: false,
                });

                descriptionsMap[actionId] = `${deployment}/${contract}.${functionName}`;
              }
            }
          }
        }
      }

      dispatchPermissions({
        type: "SET_ALL_PERMISSIONS",
        payload: {
          permissions: permissionsArray,
          descriptions: descriptionsMap,
        },
      });

      return true;
    } catch (error) {
      console.error("Error loading action IDs:", error);
      toast({
        title: "Error loading action IDs",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      dispatchPermissions({ type: "SET_LOADING", payload: false });
      return false;
    }
  };

  // Load wallet permissions
  const loadWalletPermissions = async (): Promise<void> => {
    try {
      dispatchPermissions({ type: "SET_PERMISSIONS_LOADING", payload: true });

      const response = await fetch(
        `https://raw.githubusercontent.com/balancer/bal_addresses/main/outputs/permissions/active/${selectedNetwork}.json`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch permissions: ${response.statusText}`);
      }

      const data = (await response.json()) as Permissions;

      // Find permissions for selected wallet
      const walletPermissions: string[] = [];

      for (const [actionId, addresses] of Object.entries(data)) {
        // Handle both data formats
        if (Array.isArray(addresses)) {
          // Format 1: actionId -> array of addresses
          if (addresses.some(addr => addr.toLowerCase() === selectedWallet.toLowerCase())) {
            walletPermissions.push(actionId);
          }
        } else if (typeof addresses === "object") {
          // Format 2: actionId -> { address: boolean }
          if (
            addresses[selectedWallet.toLowerCase()] === true ||
            addresses[selectedWallet] === true
          ) {
            walletPermissions.push(actionId);
          }
        }
      }

      dispatchPermissions({
        type: "SET_CURRENT_PERMISSIONS",
        payload: walletPermissions,
      });
    } catch (error) {
      console.error("Error loading wallet permissions:", error);
      toast({
        title: "Error loading wallet permissions",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      dispatchPermissions({ type: "SET_PERMISSIONS_LOADING", payload: false });
    }
  };

  // Handle network change
  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedApiID = e.target.value;

    // First find the network option by apiID
    const selectedOption = NETWORK_OPTIONS.find(option => option.apiID === selectedApiID);
    setSelectedNetwork(selectedOption ? selectedOption?.apiID.toLowerCase() : "mainnet");
    setSelectedWallet("");
    setCustomWalletInput("");
    dispatchPermissions({ type: "RESET_PERMISSIONS" });
    setGeneratedPayload(null);
    setHumanReadableText(null);
  };

  // Handle wallet selection
  const handleWalletSelect = (address: string): void => {
    setSelectedWallet(address);
    setCustomWalletInput("");
    dispatchPermissions({ type: "CLEAR_SELECTED_PERMISSIONS" });
    setGeneratedPayload(null);
    setHumanReadableText(null);
  };

  // Toggle permission selection
  const handlePermissionToggle = (actionId: string): void => {
    dispatchPermissions({ type: "TOGGLE_PERMISSION", payload: actionId });
  };

  // Remove selected permission
  const removeSelectedPermission = (actionId: string): void => {
    dispatchPermissions({ type: "REMOVE_PERMISSION", payload: actionId });
  };

  // Handle pagination
  const handlePageChange = (newPage: number): void => {
    dispatchPermissions({ type: "SET_PAGE", payload: newPage });
  };

  // Handle permissions per page change
  const handlePermissionsPerPageChange = (value: number): void => {
    dispatchPermissions({ type: "SET_PER_PAGE", payload: value });
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
    // Make sure we have a selected wallet and permissions to grant or revoke
    if (
      !selectedWallet ||
      (permissionsState.selectedPermissions.length === 0 && permissionsToRevoke.length === 0)
    ) {
      return {};
    }

    // Generate a unique ID for the branch and file
    const uniqueId = generateUniqueId();

    // Get wallet name for PR description
    const walletName =
      Object.entries(availableWallets).find(([_, address]) => address === selectedWallet)?.[0] ||
      selectedWallet.substring(0, 10);

    const readableWalletName = transformToHumanReadable(walletName);
    const shortWalletAddress = selectedWallet.substring(0, 8);

    // Count permissions changes
    const grantCount = permissionsState.selectedPermissions.length;
    const revokeCount = permissionsToRevoke.length;

    // Get network name and chain id
    const networkOption = NETWORK_OPTIONS.find(n => n.apiID === selectedNetwork.toUpperCase());
    const networkName = networkOption?.label || selectedNetwork;
    const chainId = networkOption?.chainId || "1";

    // Create descriptive action text
    let actionText = "";
    if (grantCount > 0 && revokeCount > 0) {
      actionText = `Grant ${grantCount} and Revoke ${revokeCount} Permissions`;
    } else if (grantCount > 0) {
      actionText = `Grant ${grantCount} Permissions`;
    } else if (revokeCount > 0) {
      actionText = `Revoke ${revokeCount} Permissions`;
    }

    // Create basic description text
    let descriptionText = `This PR manages permissions for ${readableWalletName} (${shortWalletAddress}) on ${networkName}.\n\n`;

    // Add details about permissions if needed
    if (grantCount > 0) {
      descriptionText += `Granting ${grantCount} permissions.\n`;
    }
    if (revokeCount > 0) {
      descriptionText += `Revoking ${revokeCount} permissions.\n`;
    }

    // Create just the filename - path will come from the config.
    // Follows the OmniAutoOps convention: {prefix}-{chainId}-{identifier}-{uniqueId}.json
    const filename = `permissions-${chainId}-${shortWalletAddress}-${uniqueId}.json`;

    return {
      prefillBranchName: `feature/permissions-${chainId}-${shortWalletAddress}-${uniqueId}`,
      prefillPrName: `${actionText} for ${readableWalletName} on ${networkName}`,
      prefillDescription: descriptionText,
      prefillFilename: filename,
    };
  };

  // Toggle view type
  const toggleViewType = (): void => {
    setPermissionViewType(prevType =>
      prevType === PermissionViewType.LIST ? PermissionViewType.GROUPED : PermissionViewType.LIST,
    );
  };

  const [permissionsToRevoke, setPermissionsToRevoke] = useState<string[]>([]);

  // Add function to toggle permission revocation
  const togglePermissionRevocation = (actionId: string): void => {
    setPermissionsToRevoke(prev =>
      prev.includes(actionId) ? prev.filter(id => id !== actionId) : [...prev, actionId],
    );
  };

  // Copy to clipboard utility
  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text).catch(err => {
      console.error("Failed to copy to clipboard:", err);
    });
    toast({
      title: "Copied to clipboard!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Generate payload
  const generatePayload = (): void => {
    if (permissionsState.selectedPermissions.length === 0 && permissionsToRevoke.length === 0) {
      toast({
        title: "No permissions selected",
        description: "Please select at least one permission to grant or revoke",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Get chain ID for the selected network
    const chainId =
      filteredNetworkOptions.find(opt => opt.apiID === selectedNetwork.toUpperCase())?.chainId ||
      "1";

    // Build transactions array
    const transactions = [];

    // Add grant transaction if there are permissions to grant
    if (permissionsState.selectedPermissions.length > 0) {
      const grantInput: PermissionInput = {
        actionIds: permissionsState.selectedPermissions,
        granteeAddress: selectedWallet,
        granterAddress: daoAddress,
        authorizerAddress: authorizerAdaptor,
        network: selectedNetwork,
        chainId: chainId,
      };

      // Add grant transaction
      transactions.push({
        to: authorizerAdaptor,
        value: "0",
        data: null,
        contractMethod: {
          inputs: [
            { internalType: "bytes32[]", name: "roles", type: "bytes32[]" },
            { internalType: "address", name: "account", type: "address" },
          ],
          name: "grantRoles",
          payable: false,
        },
        contractInputsValues: {
          roles: `[${grantInput.actionIds.map(id => `${id}`).join(", ")}]`,
          account: grantInput.granteeAddress,
        },
      });
    }

    // Add revoke transaction if there are permissions to revoke
    if (permissionsToRevoke.length > 0) {
      transactions.push({
        to: authorizerAdaptor,
        value: "0",
        data: null,
        contractMethod: {
          inputs: [
            { internalType: "bytes32[]", name: "roles", type: "bytes32[]" },
            { internalType: "address", name: "account", type: "address" },
          ],
          name: "revokeRoles",
          payable: false,
        },
        contractInputsValues: {
          roles: `[${permissionsToRevoke.map(id => `${id}`).join(", ")}]`,
          account: selectedWallet,
        },
      });
    }

    // Create final payload
    const payload = {
      version: "1.0",
      chainId: chainId,
      createdAt: Math.floor(Date.now() / 1000),
      meta: {
        name: "Transactions Batch",
        description: "Manage permissions for wallet",
        txBuilderVersion: "1.18.0",
        createdFromSafeAddress: daoAddress,
        createdFromOwnerAddress: "",
      },
      transactions: transactions,
    };

    setGeneratedPayload(payload);

    // Generate human readable text
    const walletName =
      Object.entries(availableWallets).find(([_, address]) => address === selectedWallet)?.[0] ||
      selectedWallet;
    const readableWalletName = transformToHumanReadable(walletName);

    let humanReadable = "";

    if (permissionsState.selectedPermissions.length > 0) {
      humanReadable += generateHumanReadablePermissions(
        permissionsState.selectedPermissions,
        permissionsState.actionIdDescriptions,
        selectedWallet,
        readableWalletName,
        "grant",
      );
    }

    if (permissionsToRevoke.length > 0) {
      if (humanReadable) humanReadable += "\n\n";
      humanReadable += generateHumanReadablePermissions(
        permissionsToRevoke,
        permissionsState.actionIdDescriptions,
        selectedWallet,
        readableWalletName,
        "revoke",
      );
    }

    setHumanReadableText(humanReadable);
  };

  const generateComposerData = () => {
    if (!generatedPayload) return null;

    const payload =
      typeof generatedPayload === "string" ? JSON.parse(generatedPayload) : generatedPayload;

    const walletName =
      Object.entries(availableWallets).find(([_, address]) => address === selectedWallet)?.[0] ||
      selectedWallet;
    const readableWalletName = transformToHumanReadable(walletName);

    return {
      type: "permissions",
      title: "Manage Permissions",
      description: "Manage Permissions for " + readableWalletName,
      payload: payload,
      params: {
        grants: permissionsState.selectedPermissions.length,
        revokes: permissionsToRevoke.length,
        wallet: selectedWallet,
      },
      builderPath: "permissions",
    };
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  // Get permission description helper
  const getPermissionDescription = (actionId: string): string => {
    return permissionsState.actionIdDescriptions[actionId] || actionId;
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
            Create Permissions Payload
          </Heading>
          <Text mb={4}>Build a payload to grant permissions to a wallet address.</Text>
        </Box>
        <Box width={{ base: "full", md: "auto" }}>
          <ComposerIndicator />
        </Box>
      </Flex>

      <Box>
        <Grid templateColumns="repeat(12, 1fr)" gap={4} mt={2} mb={6}>
          <GridItem colSpan={{ base: 12, md: 4 }}>
            <FormLabel>Select Network</FormLabel>
            <NetworkSelector
              networks={networks}
              networkOptions={filteredNetworkOptions}
              selectedNetwork={selectedNetwork.toUpperCase()}
              handleNetworkChange={handleNetworkChange}
            />
          </GridItem>

          <GridItem colSpan={{ base: 12, md: 8 }}>
            <FormControl>
              <FormLabel>Select Wallet</FormLabel>
              <SearchableAddressInput
                value={selectedWallet}
                onChange={handleWalletSelect}
                addresses={availableWallets}
              />
            </FormControl>
          </GridItem>
        </Grid>

        {selectedWallet && (
          <Card p={4} mb={4}>
            <Flex justify="space-between" align="center" mb={3}>
              <Heading as="h3" size="md">
                Available Permissions
              </Heading>
              <HStack>
                <Text fontSize="sm" fontWeight="medium">
                  {permissionViewType === PermissionViewType.GROUPED ? "Grouped" : "List"} View
                </Text>
                <IconButton
                  aria-label="Toggle view"
                  icon={
                    permissionViewType === PermissionViewType.GROUPED ? (
                      <HamburgerIcon />
                    ) : (
                      <ViewIcon />
                    )
                  }
                  size="sm"
                  onClick={toggleViewType}
                  variant="outline"
                />
              </HStack>
            </Flex>
            <FormControl mb={4}>
              <FormLabel>Filter by Protocol Version</FormLabel>
              <HStack>
                <Button
                  size="sm"
                  colorScheme={versionFilter === "all" ? "blue" : "gray"}
                  onClick={() => setVersionFilter("all")}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  colorScheme={versionFilter === "v2" ? "blue" : "gray"}
                  onClick={() => setVersionFilter("v2")}
                >
                  V2
                </Button>
                <Button
                  size="sm"
                  colorScheme={versionFilter === "v3" ? "purple" : "gray"}
                  onClick={() => setVersionFilter("v3")}
                >
                  V3
                </Button>
              </HStack>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Search Permissions</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search by contract, function name, or action ID"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </FormControl>

            {permissionsState.selectedPermissions.length > 0 && (
              <Box mb={4} p={3} borderWidth="1px" borderRadius="md">
                <Flex justifyContent="space-between" alignItems="center" mb={2}>
                  <Heading as="h4" size="sm">
                    Selected Permissions ({permissionsState.selectedPermissions.length})
                  </Heading>
                  <Button
                    size="xs"
                    variant="outline"
                    colorScheme="red"
                    onClick={() => dispatchPermissions({ type: "CLEAR_SELECTED_PERMISSIONS" })}
                  >
                    Clear All
                  </Button>
                </Flex>
                <Flex flexWrap="wrap" gap={2}>
                  {permissionsState.selectedPermissions.map(permission => {
                    // Find the full permission object to get deployment info
                    const permObj = permissionsState.allPermissions.find(
                      p => p.actionId === permission,
                    );
                    return (
                      <PermissionTag
                        key={`selected-${permission.substring(0, 8)}`}
                        permission={permission}
                        description={getPermissionDescription(permission)}
                        deployment={permObj?.deployment}
                        onRemove={removeSelectedPermission}
                      />
                    );
                  })}
                </Flex>
              </Box>
            )}

            <Box height="500px">
              {permissionViewType === PermissionViewType.GROUPED ? (
                <GroupedPermissionsList
                  permissions={permissionsState.filteredPermissions}
                  selectedPermissions={permissionsState.selectedPermissions}
                  onToggle={handlePermissionToggle}
                  loading={permissionsState.loading}
                  searchTerm={searchTerm}
                />
              ) : (
                <VirtualizedPermissionsList
                  permissions={permissionsState.filteredPermissions}
                  selectedPermissions={permissionsState.selectedPermissions}
                  onToggle={handlePermissionToggle}
                  loading={permissionsState.loading}
                />
              )}
            </Box>
          </Card>
        )}

        {selectedWallet && (
          <Card p={4} mb={4} overflowX="auto">
            <PermissionsTable
              loading={permissionsState.permissionsLoading}
              permissions={paginatedPermissions}
              getPermissionDescription={getPermissionDescription}
              currentPage={permissionsState.currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              permissionsPerPage={permissionsState.permissionsPerPage}
              handlePermissionsPerPageChange={handlePermissionsPerPageChange}
              copyToClipboard={copyToClipboard}
              totalPermissionsCount={permissionsState.currentPermissions.length}
              permissionsToRevoke={permissionsToRevoke}
              togglePermissionRevocation={togglePermissionRevocation}
            />
          </Card>
        )}
      </Box>

      {selectedWallet && (
        <Flex justifyContent="space-between" alignItems="center" mt="20px" mb="10px">
          <Flex alignItems="center" gap={2}>
            <Button
              variant="primary"
              onClick={generatePayload}
              isDisabled={
                permissionsState.loading ||
                (permissionsState.selectedPermissions.length === 0 &&
                  permissionsToRevoke.length === 0)
              }
            >
              Generate Payload
            </Button>
            <ComposerButton generateData={generateComposerData} isDisabled={!generatedPayload} />
          </Flex>

          {generatedPayload && (
            <SimulateTransactionButton
              batchFile={
                typeof generatedPayload === "string"
                  ? JSON.parse(generatedPayload)
                  : generatedPayload
              }
            />
          )}
        </Flex>
      )}

      <Divider />

      {generatedPayload && (
        <>
          <JsonViewerEditor
            jsonData={generatedPayload}
            onJsonChange={(newJson: string | BatchFile) => setGeneratedPayload(newJson)}
          />

          <Box display="flex" alignItems="center" mt="20px">
            <Button
              variant="secondary"
              mr="10px"
              leftIcon={<DownloadIcon />}
              onClick={() => {
                if (generatedPayload) {
                  const jsonStr =
                    typeof generatedPayload === "string"
                      ? generatedPayload
                      : JSON.stringify(generatedPayload, null, 2);
                  handleDownloadClick(jsonStr);
                }
              }}
            >
              Download Payload
            </Button>
            <Button
              variant="secondary"
              mr="10px"
              leftIcon={<CopyIcon />}
              onClick={() => {
                if (generatedPayload) {
                  const jsonForClipboard =
                    typeof generatedPayload === "string"
                      ? generatedPayload
                      : JSON.stringify(generatedPayload, null, 2);
                  copyJsonToClipboard(jsonForClipboard, toast);
                }
              }}
            >
              Copy Payload to Clipboard
            </Button>
            <OpenPRButton onClick={handleOpenPRModal} network={selectedNetwork} />
            <Box mt={8} />
            <PRCreationModal
              type={"permissions"}
              isOpen={isOpen}
              onClose={onClose}
              payload={generatedPayload}
              network={selectedNetwork}
              {...getPrefillValues()}
            />
          </Box>

          {humanReadableText && (
            <Box mt="20px">
              <Text fontSize="2xl">Human-readable Text</Text>
              <Box p="20px" mb="20px" borderWidth="1px" borderRadius="lg">
                <Text whiteSpace="pre-line">{humanReadableText}</Text>
              </Box>
              <Button
                variant="secondary"
                leftIcon={<CopyIcon />}
                onClick={() => {
                  if (humanReadableText) {
                    navigator.clipboard
                      .writeText(humanReadableText)
                      .then(() => {
                        toast({
                          title: "Copied to clipboard!",
                          status: "success",
                          duration: 2000,
                          isClosable: true,
                        });
                      })
                      .catch(err => {
                        console.error("Could not copy text: ", err);
                      });
                  }
                }}
              >
                Copy Text to Clipboard
              </Button>
            </Box>
          )}
        </>
      )}
      <Box mt={8} />
    </Container>
  );
};

export default PermissionsPayloadBuilder;
