import React, { useState, useRef, useEffect } from "react";
import {
  Input,
  Box,
  List,
  ListItem,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { transformToHumanReadable } from "@/app/payload-builder/payloadHelperFunctions";
import { colors } from "@/lib/services/chakra/themes/base/colors";

interface SearchableAddressInputProps {
  value: string;
  onChange: (value: string) => void;
  addresses: { [key: string]: string };
}

const SearchableAddressInput: React.FC<SearchableAddressInputProps> = ({
  value,
  onChange,
  addresses,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const listBgColor = useColorModeValue("white", colors.gray[600]);
  const hoverColor = useColorModeValue(colors.purple[300], colors.purple[500]);

  const filteredAddresses = Object.entries(addresses).filter(
    ([name, address]) =>
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSelectAddress = (address: string) => {
    onChange(address);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <Box position="relative" ref={inputRef}>
      <InputGroup>
        <Input
          value={value}
          onChange={handleInputChange}
          placeholder="Enter or search for an address"
          onFocus={() => setIsOpen(true)}
        />
        <InputRightElement>
          <IconButton
            aria-label="Search addresses"
            icon={searchTerm ? <CloseIcon /> : <SearchIcon />}
            size="sm"
            onClick={() => {
              if (searchTerm) {
                setSearchTerm("");
                onChange("");
              }
              setIsOpen(!isOpen);
            }}
          />
        </InputRightElement>
      </InputGroup>
      {isOpen && filteredAddresses.length > 0 && (
        <List
          position="absolute"
          zIndex={1}
          bg={listBgColor}
          width="100%"
          boxShadow="md"
          borderRadius="md"
          mt={1}
          maxHeight="200px"
          overflowY="auto"
        >
          {filteredAddresses.map(([name, address]) => (
            <ListItem
              key={`${name}-${address}`}
              onClick={() => handleSelectAddress(address)}
              _hover={{ bg: hoverColor }}
              cursor="pointer"
              p={2}
            >
              <Text fontWeight="bold">{transformToHumanReadable(name)}</Text>
              <Text fontSize="sm">{address}</Text>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SearchableAddressInput;
