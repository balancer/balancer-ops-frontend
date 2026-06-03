"use client";

import React from "react";
import {
  Box,
  Show,
  Card,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { ReClammPool, ReClammContractData } from "@/types/interfaces";

interface ReClammPoolInfoCardProps {
  pool: ReClammPool;
  contractData?: ReClammContractData;
}

export const ReClammPoolInfoCard: React.FC<ReClammPoolInfoCardProps> = ({ pool, contractData }) => {
  // Helper function to calculate daily price shift percentage from dailyPriceShiftBase
  const calculateDailyPriceShiftPercentage = (dailyPriceShiftBase: string): string => {
    try {
      // Convert from 18-decimal fixed point to percentage
      const percentage = (parseFloat(dailyPriceShiftBase) / 1e18) * 100;
      return percentage.toFixed(2);
    } catch {
      return "0";
    }
  };

  // Helper function to format price range
  const formatPriceRange = (priceRange: string[]): string => {
    try {
      const min = parseFloat(priceRange[0]) / 1e18;
      const max = parseFloat(priceRange[1]) / 1e18;
      return `${min.toFixed(2)} - ${max.toFixed(2)}`;
    } catch {
      return "Invalid range";
    }
  };

  // Get ReClaMM-specific attributes
  const reClammAttributes = [
    {
      title: "Centeredness Margin",
      value: `${(parseFloat(pool.centerednessMargin) * 100).toFixed(2)}%`,
    },
    {
      title: "Has Buffer",
      value: pool.hasAnyAllowedBuffer ? "Yes" : "No",
    },
    {
      title: "Last Update",
      value: new Date(parseInt(pool.lastTimestamp) * 1000).toLocaleString(),
    },
    {
      title: "Daily Price Shift Base",
      value: `${(parseFloat(pool.dailyPriceShiftBase) * 100).toFixed(2)}%`,
    },
  ];

  // Get compute data attributes if available
  const contractAttributes = contractData
    ? [
        {
          title: "Daily Price Shift Exponent",
          value: `${calculateDailyPriceShiftPercentage(contractData.dailyPriceShiftExponent)}%`,
        },
        {
          title: "Price Range",
          value: formatPriceRange(contractData.priceRange),
        },
        {
          title: "Within Target Range",
          value: contractData.isPoolWithinTargetRange ? "Yes" : "No",
        },
      ]
    : [];

  return (
    <Card>
      <VStack alignItems="flex-start" spacing={{ base: "sm", md: "md" }} width="full" p={4}>
        <Flex width="full" justifyContent="space-between" alignItems="center">
          <Heading variant="h4" fontSize="1.25rem">
            AutoRange Parameters
          </Heading>
          {contractData && (
            <Badge
              colorScheme={contractData.isPoolWithinTargetRange ? "green" : "red"}
              display="flex"
              alignItems="center"
              px={2}
              py={1}
            >
              {contractData.isPoolWithinTargetRange ? "IN RANGE" : "OUT OF RANGE"}
            </Badge>
          )}
        </Flex>

        <VStack width="full">
          <Show above="md">
            <HStack spacing={{ base: "0", md: "xl" }} width="full">
              <Box minWidth="160px">
                <Heading variant="h6" fontSize="1rem">
                  Attribute
                </Heading>
              </Box>
              <Heading variant="h6" fontSize="1rem">
                Details
              </Heading>
            </HStack>
          </Show>

          {reClammAttributes.map(attribute => (
            <Stack
              width="full"
              spacing={{ base: "xxs", md: "xl" }}
              key={`reclamm-param-${attribute.title}`}
              direction={{ base: "column", md: "row" }}
            >
              <Box minWidth="160px">
                <Text fontSize="sm" variant={{ base: "primary", md: "secondary" }}>
                  {attribute.title}
                </Text>
              </Box>
              <Text variant={{ base: "secondary", md: "secondary" }} mb={{ base: "sm", md: "0" }}>
                {attribute.value}
              </Text>
            </Stack>
          ))}

          {contractData && (
            <>
              {contractAttributes.map(attribute => (
                <Stack
                  width="full"
                  spacing={{ base: "xxs", md: "xl" }}
                  key={`compute-param-${attribute.title}`}
                  direction={{ base: "column", md: "row" }}
                >
                  <Box minWidth="160px">
                    <Text fontSize="sm" variant={{ base: "primary", md: "secondary" }}>
                      {attribute.title}
                    </Text>
                  </Box>
                  <Text
                    variant={{ base: "secondary", md: "secondary" }}
                    mb={{ base: "sm", md: "0" }}
                  >
                    {attribute.value}
                  </Text>
                </Stack>
              ))}
            </>
          )}
        </VStack>
      </VStack>
    </Card>
  );
};
