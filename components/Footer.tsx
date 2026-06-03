"use client";

import { Box, Container, Stack, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box
      mt="auto"
      borderTop="1px solid"
      borderColor="background.level2"
      bg="background.level1"
      h={{ base: "auto", md: 20 }}
      display="flex"
      alignItems="center"
    >
      <Container maxW="container.xl" py={{ base: 4, md: 0 }}>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify="space-between"
          align="center"
        >
          <Text fontSize="sm" color="font.secondary" textAlign={{ base: "center", md: "left" }}>
            <Text as="span" fontWeight="semibold" color="font.primary">
              Disclaimer:
            </Text>{" "}
            This is a self-custody application. You are solely responsible for all transactions. No
            liability is assumed by developers for any losses or errors. Use at your own risk.
          </Text>
          <Text fontSize="xs" color="font.secondary" whiteSpace="nowrap">
            Built by DeFilytica for the Balancer DAO
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
