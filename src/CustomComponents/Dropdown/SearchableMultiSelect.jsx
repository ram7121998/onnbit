import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";

const options = [
  "no verification nedded",
  "verified paypal only",
  "photo id required",
  "invoices are accepted",
  "friends and family",
  "no receipt needed",
  "receipt required",
  "no third party",
];

const SearchableMultiSelect = ({ setOption, initialSelected = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // ensure initialSelected is array and only valid options
  const [selectedItems, setSelectedItems] = useState(() => {
    const initialArray = Array.isArray(initialSelected) ? initialSelected : [];
    return initialArray.filter((item) => item && options.includes(item));
  });

  // run when initialSelected changes (like editing form case)
  useEffect(() => {
    const initialArray = Array.isArray(initialSelected) ? initialSelected : [];
    const validInitial = initialArray.filter((item) => item && options.includes(item));
    setSelectedItems(validInitial);
    setOption(validInitial);
  }, [initialSelected, setOption]);

  const toggleSelection = (item) => {
    if (selectedItems.includes(item)) {
      const updated = selectedItems.filter((i) => i !== item);
      setSelectedItems(updated);
      setOption(updated);
    } else if (selectedItems.length < 4) {
      const updated = [...selectedItems, item];
      setSelectedItems(updated);
      setOption(updated);
    }
  };

  const removeSelection = (item) => {
    const updated = selectedItems.filter((i) => i !== item);
    setSelectedItems(updated);
    setOption(updated);
  };

  return (
    <Box w={{ base: "60%", sm: "50%" }} mb={3}>
      {/* Selected Items Display */}
      <Flex wrap="wrap" gap={2} mb={2}>
        {selectedItems.map((item) => (
          <Tag key={item} size="md" variant="solid" colorScheme="orange">
            <TagLabel>{item}</TagLabel>
            <TagCloseButton onClick={() => removeSelection(item)} />
          </Tag>
        ))}
      </Flex>

      {/* Dropdown Menu */}
      <Menu matchWidth>
        <MenuButton
          justifyContent={"space-between"}
          as={Button}
          variant={"outline"}
          _hover={{ bg: "none" }}
          w="full"
        >
          <Flex justifyContent={"space-between"}>
            {selectedItems.length > 0 ? `${selectedItems.length} Selected` : "Select offers"}
            <MdKeyboardArrowDown />
          </Flex>
        </MenuButton>
        <MenuList p={2}>
          {/* Search Input */}
          <InputGroup mb={2}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          {/* Filtered Items - Excluding Selected Ones */}
          {options
            .filter(
              (item) =>
                !selectedItems.includes(item) &&
                item.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item) => (
              <MenuItem
                key={item}
                onClick={() => toggleSelection(item)}
                isDisabled={selectedItems.length >= 4} // disable if 4 already selected
              >
                {item}
              </MenuItem>
            ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default SearchableMultiSelect;
