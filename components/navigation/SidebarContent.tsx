import { useState } from "react";
import {
  Box,
  Text,
  CloseButton,
  Flex,
  Heading,
  BoxProps,
  Link,
  Image,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { RiAlertLine, RiContractLine } from "react-icons/ri";
import {
  TbTransactionBitcoin,
  TbGaugeFilled,
  TbFishHook,
  TbCoins,
  TbChartCovariate,
} from "react-icons/tb";
import { FaChartPie } from "react-icons/fa";
import { MdOutlineSsidChart } from "react-icons/md";
import { BiAlignMiddle } from "react-icons/bi";
import { PiRocketLaunchBold } from "react-icons/pi";
import NavItem, { NavItemType } from "./NavItem";
import { BalancerLogo } from "@/public/imgs/BalancerLogo";
import NextLink from "next/link";
import { GoAlertFill } from "react-icons/go";

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems = [
  {
    name: "Payload Builder",
    icon: TbTransactionBitcoin,
    target: "/payload-builder",
    description: "Choose from a variety of options to create Balancer DAO Payloads",
  },
  {
    name: "Pools",
    icon: FaChartPie,
    children: [
      {
        name: "Boosted",
        icon: MdOutlineSsidChart,
        target: "/boosted-pools",
        description: "View boosted pools with buffer utilization",
      },
      {
        name: "AutoRange",
        icon: TbChartCovariate,
        target: "/autorange",
        description: "View AutoRange pools",
      },
    ],
  },
  {
    name: "Hooks",
    icon: TbFishHook,
    target: "/hooks",
    description: "View pools with hooks connected",
  },
  {
    name: "Incentive Management",
    icon: RiContractLine,
    children: [
      {
        name: "Gauge Creator",
        icon: TbGaugeFilled,
        target: "/gauge-creator",
        description: "Create a staking gauge for Balancer pools",
      },
      {
        name: "Rewards Injector Viewer",
        icon: RiContractLine,
        target: "/rewards-injector",
        description: "View and Configure Gauge Rewards injectors",
      },
      {
        name: "Rewards Status",
        icon: RiAlertLine,
        target: "/rewards-injector/status",
        description: "Check Injector status",
      },
      {
        name: "Injector Deployer",
        icon: PiRocketLaunchBold,
        target: "/injector-creator-v2",
        description: "Deploy a new rewards injector",
      },
      {
        name: "Reward Tokens",
        icon: TbCoins,
        target: "/reward-tokens",
        description: "Manage reward tokens on gauges",
      },
    ],
  },
  {
    name: "Liquidity Buffers",
    icon: BiAlignMiddle,
    target: "/liquidity-buffers",
    description: "View liquidity buffer allocations",
  },
  {
    name: "Emergency",
    icon: GoAlertFill,
    target: "/payload-builder/emergency",
    description: "Create Emergency Payloads",
  },
];

const DefilyticaBanner = () => (
  <Link href="https://defilytica.com" isExternal>
    <Box
      shadow="md"
      borderRadius="md"
      overflow="hidden"
      transition="all 0.1s"
      p={2}
      display="flex"
      alignItems="center"
      gap={2}
      bg="purple.950"
      _hover={{
        shadow: "lg",
        transform: "translateY(-2px)",
      }}
    >
      <Image
        src="/imgs/defilytica.png"
        alt="DeFilytica"
        width="24px"
        height="24px"
        objectFit="contain"
      />
      <Text fontSize="sm" fontWeight="medium" variant="special">
        developed by DeFilytica
      </Text>
    </Box>
  </Link>
);

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (itemName: string) => {
    setOpenItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const renderNavItem = (item: NavItemType, isSubItem = false) => {
    const hasSubItems = item.children && item.children.length > 0;
    const isOpen = openItems[item.name];

    return (
      <div key={item.name}>
        <NavItem
          icon={item.icon}
          title={item.name}
          target={item.target || "/"} // Ensure target always has a value
          onClose={onClose}
          hasSubItems={hasSubItems}
          isSubItem={isSubItem}
          isOpen={isOpen}
          onToggle={() => toggleItem(item.name)}
        />

        {hasSubItems && isOpen && (
          <div>{item.children?.map(child => renderNavItem(child, true))}</div>
        )}
      </div>
    );
  };

  return (
    <Box w={{ base: "full", md: 72 }} pos="fixed" h="full" {...rest}>
      <Flex direction="column" h="full">
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between" flexShrink={0}>
          <Flex alignItems="center">
            <Box boxSize={30} marginRight={2}>
              <ChakraLink
                as={NextLink}
                href="/" // Explicit href for the logo
                style={{ textDecoration: "none" }}
                _focus={{ boxShadow: "none" }}
              >
                <BalancerLogo />
              </ChakraLink>
            </Box>
            <Box>
              <ChakraLink
                as={NextLink}
                href="/" // Explicit href for the heading
                style={{ textDecoration: "none" }}
                _focus={{ boxShadow: "none" }}
              >
                <Heading as="h5" size="md" variant="special">
                  Ops Tooling
                </Heading>
              </ChakraLink>
            </Box>
          </Flex>
          <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
        </Flex>

        <Box flex="1" overflowY="auto" px="4" minH="0">
          {LinkItems.map(item => renderNavItem(item))}
        </Box>

        <Flex
          alignItems="center"
          justifyContent="center"
          px="4"
          h={{ base: 20, md: 20 }}
          flexShrink={0}
          borderTop="1px solid"
          borderColor="background.level2"
        >
          <DefilyticaBanner />
        </Flex>
      </Flex>
    </Box>
  );
};
export default SidebarContent;
