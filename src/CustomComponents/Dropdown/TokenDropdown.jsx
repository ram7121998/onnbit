import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Image } from '@chakra-ui/react';
import { MdKeyboardArrowDown } from "react-icons/md";
import { useOffer } from '../../Context/OfferContext';
import { useSearchParams, useLocation } from 'react-router-dom';

const TokenDropdown = ({ index, setIndex }) => {
    const { setQueryParams } = useOffer();
    const option = cryptoOption[index]?.name || cryptoOption[0].name;
    const logo = cryptoOption[index]?.logo || cryptoOption[0].logo;

    const handleSelect = (newIndex) => {
        setIndex(newIndex);
        setQueryParams(prev => ({
            ...prev,
            cryptocurrency: cryptoOption[newIndex].name.toLowerCase()
        }));
        const url = new URL(window.location.href);
        url.searchParams.set("index", newIndex);
        window.location.href = url.toString();
    };


    return (
        <Menu matchWidth>
            <MenuButton as={Button} w="full" variant="outline" borderRadius={5} border="1px solid #dcdcdc" rightIcon={<MdKeyboardArrowDown />} _hover={{ bg: 'transparent' }}>
                <Flex gap={2}>
                    <Image boxSize={5} src={logo} alt={option} />
                    {option}
                </Flex>
            </MenuButton>
            <MenuList borderRadius={0} p={2}>
                {cryptoOption.map((data, idx) => (
                    <MenuItem key={idx} onClick={() => handleSelect(idx)} gap={3} _hover={{ bg: "blue.100" }}>
                        <Image boxSize={5} src={data.logo} alt={data.name} />
                        {data.name}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
};



const cryptoOption = [
    { name: 'Bitcoin', logo: '/imagelogo/bitcoin-btc-logo.png' },
    { name: 'Ethereum', logo: '/imagelogo/ethereum-eth-logo.png' },
    { name: 'Binance', logo: '/imagelogo/bnb-bnb-logo.png' },
    { name: 'Tether', logo: '/imagelogo/tether-usdt-logo.png' },
];

export default TokenDropdown;
