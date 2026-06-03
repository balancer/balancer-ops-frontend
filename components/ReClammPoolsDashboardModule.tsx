"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { HookFilters } from "@/components/filter/HookFilters";
import { NETWORK_OPTIONS, networks } from "@/constants/constants";
import {
  GetV3PoolsQuery,
  GetV3PoolsDocument,
  GqlChain,
} from "@/lib/services/apollo/generated/graphql";
import { Pool, AddressBook } from "@/types/interfaces";
import { getNetworksWithCategory } from "@/lib/data/balancer/addressBook";
import { ReClammPoolsTable } from "@/components/tables/ReClammPoolsTable";
import { isBlacklistedAutoRangePool } from "@/lib/utils/reclammUtils";

interface ReClammPoolsDashboardModuleProps {
  addressBook: AddressBook;
}

export default function ReClammPoolsDashboardModule({
  addressBook,
}: ReClammPoolsDashboardModuleProps) {
  const [selectedNetwork, setSelectedNetwork] = useState("ALL");
  const [minTvl, setMinTvl] = useState<number | null>(null);

  const { loading, error, data } = useQuery<GetV3PoolsQuery, any>(GetV3PoolsDocument, {
    variables:
      selectedNetwork !== "ALL"
        ? {
            chainIn: [selectedNetwork as GqlChain],
            chainNotIn: ["SEPOLIA" as GqlChain],
            poolTypeIn: ["RECLAMM"],
          }
        : {
            poolTypeIn: ["RECLAMM"],
            chainNotIn: ["SEPOLIA" as GqlChain],
          },
  });

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNetwork(e.target.value);
  };

  const networkOptionsWithAll = (() => {
    const baseOptions = [
      {
        label: "All networks",
        apiID: "ALL",
        chainId: "",
      },
    ];

    // Get networks that have v3 vaults
    const networksWithV3 = getNetworksWithCategory(addressBook, "20241204-v3-vault");

    // Include all v3 networks for ReCLAMM pools
    return [
      ...baseOptions,
      ...NETWORK_OPTIONS.filter(
        network =>
          networksWithV3.includes(network.apiID.toLowerCase()) || network.apiID === "SONIC",
      ),
    ];
  })();

  const networksWithAll = {
    ...networks,
    all: {
      logo: "/imgs/globe.svg",
      rpc: "",
      explorer: "",
      chainId: "",
    },
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-start", md: "center" }}
        justify="space-between"
        mb={6}
        wrap="wrap"
        gap={4}
      >
        <Box>
          <Heading as="h2" size="lg" variant="special" mb={2}>
            AutoRange Pools
          </Heading>
          <Text>View all AutoRange pools in Balancer v3</Text>
        </Box>

        <Box>
          <HookFilters
            selectedNetwork={selectedNetwork}
            onNetworkChange={handleNetworkChange}
            minTvl={minTvl}
            onMinTvlChange={setMinTvl}
            networkOptions={networkOptionsWithAll}
            networks={networksWithAll}
            hookType={"RECLAMM" as any}
            addressBook={addressBook}
          />
        </Box>
      </Flex>

      {loading ? (
        <Center h="50vh" flexDir="column" gap={4}>
          <Box p={4} w="16" h="16" rounded="full" bg="whiteAlpha.50">
            <Spinner size="lg" color="gray.400" />
          </Box>
          <Text fontSize="m" color="gray.500">
            Loading AutoRange pools...
          </Text>
        </Center>
      ) : error ? (
        <Alert status="error" mt={4}>
          <AlertIcon />
          <AlertTitle>Error loading pools</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ) : (
        (() => {
          const activePools = (data?.poolGetPools ?? []).filter(
            (pool: any) =>
              !(pool?.dynamicData?.isPaused && pool?.dynamicData?.isInRecoveryMode) &&
              !isBlacklistedAutoRangePool(pool.chain, pool.address),
          );
          if (activePools.length === 0) {
            return (
              <Alert status="info" mt={4}>
                <AlertIcon />
                <AlertTitle>No AutoRange pools found</AlertTitle>
                <AlertDescription>Try selecting a different network</AlertDescription>
              </Alert>
            );
          }
          return (
            <ReClammPoolsTable
              pools={activePools as unknown as Pool[]}
              addressBook={addressBook}
              minTvl={minTvl}
            />
          );
        })()
      )}
    </Container>
  );
}
