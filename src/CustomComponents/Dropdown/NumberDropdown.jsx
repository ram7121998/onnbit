import React from 'react'
import {
    Flex,
    Heading,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
   
    Box,
    Button,
    Image,
    
    Input,
    InputGroup,
    InputRightElement,
    InputLeftElement,
    VStack,
    FormControl,
    FormLabel,
    HStack,
    PinInput,
    PinInputField,


  
} from '@chakra-ui/react'

import { useState } from "react";

import { MdKeyboardArrowDown } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import { useOtherDetail } from "../../Context/otherContext";
import CountryCodeDropdown from '../Dropdown/CountryCodeDropdown'

const NumberDropdown = () => {
 const [isShow, setShow] = useState(false);
    const [phone, setPhone] = useState();
    const [user, setUser] = useState(null);
    const [otp, setOtp] = useState(null);
    const [countryCode, setCountryCode] = useState(null);
    const [fullPhone, setFullPhone] = useState(null);
    const [isotpsend, setIsOtpSend] = useState(false);    

     const sendOtp = async () => {
            console.log('Sending OTP to:', fullPhone);
            try {
    
                const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
                    size: 'invisible',
                    callback: (response) => {
                        console.log('reCAPTCHA verified!');
                    },
                    'expired-callback': () => {
                        console.log('reCAPTCHA expired. Please solve again.');
                    }
                })
    
                const confirmation = await signInWithPhoneNumber(auth, fullPhone, recaptchaVerifier);
                console.log(confirmation);
                setUser(confirmation);
            } catch (error) {
                console.log('Error sending OTP:', error);
            }
        };
    

    return (
        <Flex w={'100%'} direction={'column'} gap={1}>
            <Heading size={'sm'}>Phone</Heading>

            <Flex justifyContent={'space-between'} alignItems={'center'} borderRadius={5} border={'1px solid #dcdcdc'} >
                <InputGroup>

                    <Input placeholder='Enter phone number'
                        border={'none'}
                        _hover={{ border: "none" }}
                        _focus={{ boxShadow: "none", border: "none" }}

                    ></Input>
                    {
                        false &&
                        <InputRightElement>
                            <Button><MdKeyboardArrowDown /></Button>
                        </InputRightElement>
                    }
                </InputGroup>
                <NumberDropdownNew />
            </Flex>
            <Button onClick={() => setShow(!isShow)} textDecoration={'underline'} p={0} size={'sm'} bg={'transparent'} alignSelf={'start'}>Change Number</Button>
             {
                    isShow &&
                    <Flex pt={4} direction={'column'} gap={5} borderTop={'1px solid #dcdcdc'} width="400px" >
                        <Flex direction={'column'} gap={2} w={{ base: '100%', md: '50%' }}>
                            {
                                isotpsend ?


                                    <FormControl isRequired >
                                        <FormLabel>OTP</FormLabel>

                                        {/* <Flex direction={'column'} gap={2}> */}

                                        <HStack>
                                            <PinInput

                                                value={otp}
                                                onChange={setOtp} // Update state when user types
                                            // onComplete={verifyOtp}
                                            >
                                                <PinInputField/>
                                                <PinInputField />
                                                <PinInputField />
                                                <PinInputField />
                                                <PinInputField />
                                                <PinInputField />
                                            </PinInput>
                                        </HStack>
                                        {/* </Flex> */}
                                    </FormControl>
                                    :
                                    <FormControl>
                                        <FormLabel>Phone</FormLabel>
                                        <Flex border={'1px solid #dcdcdc'} p={2} gap={2} borderRadius={5} flexWrap={'nowrap'}   width="400px"  // yaha apni desired width do
>
                                            <Box>
                                                <CountryCodeDropdown setCountryCode={setCountryCode} />
                                            </Box>

                                            <Input size={'sm'} borderLeftRadius={0} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='Enter your Number'></Input>

                                        </Flex>
                                    </FormControl>
                            }


                            {
                                isotpsend ? ""
                                    :
                                    <FormControl>
                                        <Flex>
                                            <Button colorScheme='gray' onClick={() => {
                                                sendOtp();
                                                setIsOtpSend(true);
                                            }}
                                                variant={'outline'}
                                                size={'sm'}
                                                alignSelf={'end'}
                                            >
                                                Send OTP
                                            </Button>
                                        </Flex>

                                    </FormControl>
                            }
                        </Flex>
                        <Box alignSelf={'center'} id="recaptcha" style={{ display: 'block' }}></Box>

                    </Flex>

                }
        </Flex>
        
        
    )
}

const NumberDropdownNew = () => {

    const { handleCountryCode, CountryCode } = useOtherDetail();

    const [searchTerm, setSearchTerm] = useState("");
    const [option, setOption] = useState("India");

    const filteredItems = (CountryCode || []).filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <>
            <Menu placement="bottom-end">
                <MenuButton
                    as={Button}
                    bg={'transparent'}
                    borderRadius={5}
                    _hover={{ bg: "transparent" }}
                    size={'sm'}
                    minW={{ base: "auto", md: "100px" }} // Ensures it doesn't shrink too much
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    rightIcon={<MdKeyboardArrowDown />}
                    _focus={{ boxShadow: "none" }}
                    _active={{ bg: "transparent" }}
                    onClick={handleCountryCode}

                >

                    {option}
                </MenuButton>

                <MenuList p={2} borderRadius={0}

                    maxHeight="300px" // Limit height
                    overflowY="auto" // Enable scrolling
                    zIndex={1000}

                >

                    <InputGroup mb={2}>
                        <InputLeftElement pointerEvents="none" pb={'6px'}>
                            <IoMdSearch color="gray.500" />
                        </InputLeftElement>
                        <Input
                            placeholder="Search..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            size="sm"
                        />
                    </InputGroup>



                    {/* Menu Items */}
                    <VStack align="stretch" spacing={1}>
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item, index) => (
                                <MenuItem key={index} _hover={{ bg: "blue.100" }}
                                    onClick={() => {
                                        setOption(item.code);
                                    }}>
                                    <Flex justifyContent={'space-between'} w={'full'}>

                                        <Flex justifyContent={'space-between'} alignItems={'center'} w={'full'} gap={5} borderBottom={'1px solid #f5f7fa'}>
                                            <Image boxSize={5} src={item.flag_url}></Image>

                                            {item.dialing_code}
                                        </Flex>
                                        <Box mr={3}>{item.currency_symbol}</Box>
                                    </Flex>
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem isDisabled>No results found</MenuItem>
                        )}
                    </VStack>
                </MenuList>
            </Menu>

        </>
    );
};

export default NumberDropdown