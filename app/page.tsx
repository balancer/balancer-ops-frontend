"use client";
import { Box, Heading, Text, Button, VStack, Container, Link, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TbTransactionBitcoin, TbGaugeFilled } from "react-icons/tb";
import { RiAlertLine, RiContractLine } from "react-icons/ri";
import { FaRegChartBar } from "react-icons/fa6";

export default function Page() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const MotionBox = motion(Box);
  const MotionHeading = motion(Heading);
  const MotionText = motion(Text);
  const sections = [
    {
      title: "Incentive Management",
      description: (
        <>
          Create and manage a secondary reward token program on Balancer. Check out the{" "}
          <Link
            href="https://docs.balancer.fi/partner-onboarding/onboarding-overview/incentive-management.html#secondary-reward-token-incentives"
            color="blue.500"
            isExternal
          >
            Docs
          </Link>{" "}
          for more information.
        </>
      ),
      features: [
        {
          title: "Create a Gauge",
          icon: TbGaugeFilled,
          description: "Create a staking gauge for Balancer pools",
          primaryAction: {
            label: "Create Gauge",
            href: "/gauge-creator",
          },
        },
        {
          title: "Create a Rewards Injector Program",
          icon: RiContractLine,
          description: "Create a rewards injector program for Balancer pools",
          primaryAction: {
            label: "Create Injector",
            href: "/rewards-injector",
          },
        },
      ],
    },
    {
      title: "Governance and Tooling",
      description: (
        <>
          Create DAO payloads, create or enable gauges or perform other operations for the DAO by
          submitting pull-requests to the multi-sig operations repository for execution.
        </>
      ),
      features: [
        {
          title: "Create DAO Payloads",
          icon: TbTransactionBitcoin,
          description:
            "Build governance proposals and manage DAO operations with our intuitive payload builder",
          primaryAction: {
            label: "Create Payload",
            href: "/payload-builder",
          },
        },
        {
          title: "Initialize Buffers",
          icon: FaRegChartBar,
          description: "Initialize Buffers for v3 pools",
          primaryAction: {
            label: "Initialize buffers",
            href: "/payload-builder/initialize-buffer",
          },
        },
      ],
    },
    {
      title: "Monitoring",
      description: (
        <>Check the status of critical infrastructure such as injector programs or liquidity buffers.</>
      ),
      features: [
        {
          title: "Injector Program Status",
          icon: RiAlertLine,
          description: "Monitor Injectors funds, rewards and more.",
          primaryAction: {
            label: "View Status",
            href: "/rewards-injector/status",
          },
        },
        {
          title: "Liquidity Buffer Status",
          icon: FaRegChartBar,
          description: "Monitor Balancer v3 Liquidity Buffers.",
          primaryAction: {
            label: "View Buffers",
            href: "/liquidity-buffers",
          },
        },
      ],
    },
  ];

  return (
    <Box minHeight="100vh">
      <Container maxW="container.xl" pt={{ base: 4, md: 8 }}>
        <VStack spacing={2} textAlign="center">
          <MotionHeading
            as="h1"
            p={2}
            size={{ base: "xl", md: "2xl", lg: "3xl" }}
            variant="special"
            fontWeight="bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Welcome to Balancer Ops Tooling
          </MotionHeading>
          <MotionText
            fontSize={{ base: "lg", md: "xl" }}
            variant="secondary"
            fontWeight="bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Streamlining Balancer DAO operations with our powerful suite of tools
          </MotionText>
        </VStack>
      </Container>

      {/* Sections */}
      <Container maxW="container.xl" mt={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 6, md: 12 }}>
          {sections.map((section, sectionIndex) => (
            <MotionBox
              key={sectionIndex}
              width="100%"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
              transition={{ duration: 0.7, delay: 0.3 + sectionIndex * 0.2 }}
            >
              <VStack spacing={2} textAlign="center" mb={{ base: 6, md: 8 }}>
                <MotionHeading
                  as="h2"
                  size={{ base: "md", md: "lg" }}
                  variant="specialSecondary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isLoaded ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + sectionIndex * 0.2 }}
                >
                  {section.title}
                </MotionHeading>
                <MotionText
                  fontSize={{ base: "sm", md: "md" }}
                  maxW="container.md"
                  mx="auto"
                  px={4}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isLoaded ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + sectionIndex * 0.2 }}
                >
                  {section.description}
                </MotionText>
              </VStack>

              {/* Replace SimpleGrid with custom solution for centering */}
              <Flex
                width="100%"
                justifyContent="center"
                flexWrap="wrap"
                px={{ base: 4, md: 0 }}
                sx={{
                  gap: { base: "16px", md: "24px", lg: "32px" },
                }}
                alignItems="stretch"
              >
                {section.features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <MotionBox
                      key={index}
                      borderWidth="1px"
                      borderRadius="lg"
                      p={{ base: 4, md: 6 }}
                      _hover={{
                        shadow: "xl",
                        transform: "translateY(-5px)",
                      }}
                      display="flex"
                      width={{ base: "100%", md: "calc(50% - 12px)", lg: "calc(33.33% - 22px)" }}
                      maxWidth={{ base: "100%", md: "350px" }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.7 + sectionIndex * 0.2 + index * 0.1,
                      }}
                    >
                      <VStack
                        spacing={4}
                        align="center"
                        width="100%"
                        height="100%"
                        justify="space-between"
                      >
                        <VStack spacing={4} align="center" flex="1">
                          <MotionBox
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: isLoaded ? 1 : 0.8, opacity: isLoaded ? 1 : 0 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.9 + sectionIndex * 0.2 + index * 0.1,
                            }}
                          >
                            <Icon size={32} />
                          </MotionBox>
                          <Heading size={{ base: "sm", md: "md" }}>{feature.title}</Heading>
                          <Text textAlign="center" fontSize={{ base: "sm", md: "md" }}>
                            {feature.description}
                          </Text>
                        </VStack>

                        <MotionBox
                          width="100%"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 10 }}
                          transition={{
                            duration: 0.5,
                            delay: 1.0 + sectionIndex * 0.2 + index * 0.1,
                          }}
                        >
                          <Button
                            variant="primary"
                            width="100%"
                            as={Link}
                            style={{ textDecoration: "none" }}
                            href={feature.primaryAction.href}
                            size={{ base: "md", md: "lg" }}
                            _hover={{
                              transform: "scale(1.05)",
                            }}
                            transition="all 0.2s ease"
                          >
                            {feature.primaryAction.label}
                          </Button>
                        </MotionBox>
                      </VStack>
                    </MotionBox>
                  );
                })}
              </Flex>
            </MotionBox>
          ))}
        </VStack>
      </Container>
    </Box>
  );
}
