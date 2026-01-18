import React, { useState } from "react";
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
    Heading,
    useToast,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useVerification } from "../../Context/VerificationContext";

// Example Time Zones
const timeZones = [
    "GMT",
    "UTC",
    "IST (India Standard Time)",
    "EST (Eastern Standard Time)",
    "CST (Central Standard Time)",
    "PST (Pacific Standard Time)",
    "CET (Central European Time)",
    "AEST (Australian Eastern Standard Time)",
];

const TimeZoneDropDown = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState("");
    const { handlePreferredTimezone } = useVerification();
    const [isSaving, setIsSaving] = useState(false);

    const toast = useToast();

    const submitTimeZone = async () => {
        try {
            setIsSaving(true);
            const response = await handlePreferredTimezone(selectedItem);

            if (response?.status) {
                toast({
                    title: "Success",
                    description: response.message || "timezone updated successfully!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                });
            } else {
                toast({
                    title: "Failed",
                    description: "timezone update failed!",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                });
            }
        } catch (error) {
            console.error("Error updating bio:", error);
            toast({
                title: "Error",
                description: "An error occurred while updating timezone.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        }
        finally {
            setIsSaving(false);
        }
    };


    return (
        <Box w={"100%"} display={"flex"} flexDirection={"column"} gap={3}>
            <Heading size={"sm"}>Time Zone</Heading>

            {/* Dropdown Menu */}
            <Menu>
                <MenuButton
                    as={Button}
                    variant={"outline"}
                    _hover={{ bg: "none" }}
                    w="full"
                    rightIcon={<MdKeyboardArrowDown />}
                >
                    {selectedItem || "Select Time Zone"}
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

                    {/* Filtered Items */}
                    {timeZones
                        .filter((item) =>
                            item.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((item) => (
                            <MenuItem
                                key={item}
                                onClick={() => setSelectedItem(item)}
                            >
                                {item}
                            </MenuItem>
                        ))}
                </MenuList>
            </Menu>

            <Button colorScheme="blue" isLoading={isSaving}
                loadingText="Saving..." onClick={submitTimeZone}>Save Time Zone</Button>
        </Box>
    );
};

export default TimeZoneDropDown;
