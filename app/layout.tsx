"use client";
import { Providers } from "./providers";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import "@/public/css/global.css";
import { satoshiFont } from "@/public/fonts/satoshi/satoshi";
import { Drawer, DrawerContent } from "@chakra-ui/react";
import SidebarContent from "@/components/navigation/SidebarContent";
import MobileNav from "@/components/navigation/MobileNav";
import DesktopNav from "@/components/navigation/DesktopNav";
import Footer from "@/components/Footer";
import DisclaimerModal from "@/components/DisclaimerModal";
import { useEffect, useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    // Check if user has already seen the disclaimer
    const hasSeenDisclaimer = localStorage.getItem("hasSeenDisclaimer");
    if (!hasSeenDisclaimer) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleDisclaimerClose = () => {
    localStorage.setItem("hasSeenDisclaimer", "true");
    setShowDisclaimer(false);
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={satoshiFont.className} suppressHydrationWarning>
        <Providers>
          <Flex direction="column" minH="100vh">
            <SidebarContent onClose={() => onClose} display={{ base: "none", md: "block" }} />
            <Drawer
              isOpen={isOpen}
              placement="left"
              onClose={onClose}
              returnFocusOnClose={false}
              onOverlayClick={onClose}
              size="full"
            >
              <DrawerContent>
                <SidebarContent onClose={onClose} />
              </DrawerContent>
            </Drawer>
            <Box ml={{ base: 0, md: 72 }} display="flex" flexDirection="column" flex="1" minH="100vh">
              <MobileNav onOpen={onOpen} />
              <DesktopNav />
              <Box flex="1" p="4">
                <Flex flexDir="column" width="100%">
                  <main>{children}</main>
                </Flex>
              </Box>
              <Footer />
            </Box>
            <DisclaimerModal isOpen={showDisclaimer} onClose={handleDisclaimerClose} />
          </Flex>
        </Providers>
      </body>
    </html>
  );
}
