import React from 'react'
import { Avatar, Box, Button, Card, CircularProgress, Divider, Flex, Grid, GridItem, Heading, Icon, Image, Link, Tag, Text, Tooltip, useColorModeValue } from '@chakra-ui/react'
import { MdOutlineContentCopy } from "react-icons/md";
import { LuUpload } from "react-icons/lu";
import UserDrware from '../../Drwares/UserDrware';
import { gradientButtonStyle } from '../../Wallet/CreateWallet';
import { useNavigate } from 'react-router-dom';

import { useEffect, useRef, useState } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BsExclamationCircle, BsEye } from "react-icons/bs";
import { MdKeyboardArrowDown, MdKeyboardArrowRight, MdOutlineLocalOffer } from "react-icons/md";
import { useOffer } from "../../../Context/OfferContext";
import { id } from "ethers/lib/utils";
import { grayGradient } from "../../../Styles/Gradient";
import { useTradeProvider } from "../../../Context/TradeContext";
import { useOtherDetail } from "../../../Context/otherContext";
import { MdOutlineSettings } from "react-icons/md";
import CryptoUpdateRequest from "../../../Modals/CryptoUpdateRequest";
import PaginatedList from "../../Pagination/Pagination";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
import MyOfferRequest from "../../../Modals/MyOfferRequest";
import { ChevronDownIcon } from '@chakra-ui/icons';
dayjs.extend(relativeTime);

const TradeHistoryNew = () => {
    const bgcolor = useColorModeValue('gray.100', 'gray.700');
    const bgColor = useColorModeValue('gray.200', 'gray.700');
    const bgColor_1 = useColorModeValue('gray.50', 'gray.700');
    const spinnerColor = useColorModeValue('whiteAlpha.800', 'gray.500');
    const bgColor_tags = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('#000', '#fff');
    const textColor_1 = useColorModeValue('red.400', 'pink');

    const [status, setStatus] = useState(true);
    const [isActive, setIsActive] = useState(null);
    const { myBuyOffer, mySellOffer, handleGetMyOffer, myOfferAnalytics, handlechangeAllActiveStatus, pagination } = useOffer();
    const { handleAuthenticatedTradeHistory, runningOffers } = useTradeProvider();
    const [isSellOffer, setSellOffer] = useState(true);
    const { handleTradeHistory } = useTradeProvider();
    const [changeErrors, setChangeErrors] = useState({});
    const { handlechangeActiveStatus } = useOffer()
    const [toggleStatesSell, setToggleStatesSell] = useState({});
    const [toggleStatesBuy, setToggleStatesBuy] = useState({});
    const [isloading, setIsLoading] = useState(true);
    const activetradecolor = useColorModeValue('green.300', 'gray.500');
    const navigate = useNavigate()
    useEffect(() => {
        const activeStatusMapSell = {};
        const activeStatusMapBuy = {};
        mySellOffer?.forEach(item => {
            activeStatusMapSell[item.crypto_ad_id] = item.is_active;
        });
        setToggleStatesSell(activeStatusMapSell);
        myBuyOffer?.forEach(item => {
            activeStatusMapBuy[item.crypto_ad_id] = item.is_active;
        });
        setToggleStatesBuy(activeStatusMapBuy);
    }, [mySellOffer, myBuyOffer]);


    const handleBuySellOfferShow = async (offerType) => {
        if (offerType === 'sell') {
            setSellOffer(true);
            const req = new MyOfferRequest();
            req.txn_type = 'sell'
            await handleGetMyOffer(req);

        }
        else {
            setSellOffer(false);
            const req = new MyOfferRequest();
            req.txn_type = 'buy'
            await handleGetMyOffer(req);
        }

    }
    useEffect(() => {
        const req = new MyOfferRequest();
        handleGetMyOffer(req);
        handleTradeHistory(null);
        handleAuthenticatedTradeHistory();
    }, []);


    const handleActive = async () => {
        const req = new MyOfferRequest();

        setIsActive(true);
        await handlechangeAllActiveStatus(true);
        handleGetMyOffer(req);


    }
    const handleInActive = async () => {
        const req = new MyOfferRequest();

        setIsActive(false);
        await handlechangeAllActiveStatus(false);
        handleGetMyOffer(req);

    }
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000)
    })


console.log("history",runningOffers)

    return (
        <>
            <Flex direction={'column'} borderRadius={5} gap={4} bg={'transparent'} width={'100%'} >
                <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }} gap={4}>


                    {/* First card */}
                    <GridItem>
                        <Card border={'1px solid #dcdcdc'} p={4} h={'100%'}>
                            <Flex direction={'column'} alignItems={'start'} gap={4}>
                                <Heading size={'sm'}>Wallet</Heading>
                                <Flex direction={'column'} gap={0}>

                                    <Box fontSize={'14px'}>Total Balance</Box>
                                    <Box fontWeight={500}>475145.25 <Box as='span' fontSize={'12px'}>INR</Box></Box>
                                </Flex>
                                <Flex gap={5}>
                                    {cryptoOption.map((data, index) => (
                                        <>

                                            <Image src={data.logo} boxSize={5} mt={1} key={index}></Image>
                                        </>
                                    ))}
                                </Flex>
                                <Flex w={'full'} justifyContent={'center'} alignItems={'center'} mt={5}>

                                    <Button w={'full'} sx={gradientButtonStyle} size={'sm'} onClick={() => navigate('/wallet')}> Go to Wallet</Button>
                                </Flex>
                            </Flex>

                        </Card>
                    </GridItem>
                    {/* Second Card */}
                    <GridItem>
                        <Card border={'1px solid #dcdcdc'} p={4} h={'100%'}>
                            <Flex direction={'column'} alignItems={'start'} gap={4}>
                                <Heading size={'sm'}>Explore P2P Marketplace</Heading>
                                <Flex direction={'column'} gap={0}>

                                    <Box >Online users: <Box as='span' fontWeight={500}>40256</Box></Box>
                                    <Box >Users offers: <Box as='span' fontWeight={500}>464001</Box></Box>
                                    <Box >Trade 24h volume: <Box as='span' fontWeight={500}>40256 USD</Box></Box>
                                    <Box >Total liquidity: <Box as='span' fontWeight={500}>40256 USD</Box></Box>
                                </Flex>

                                <Flex w={'full'} justifyContent={'space-between'} alignItems={'center'} mt={5}>

                                    <Button sx={gradientButtonStyle} colorScheme='orange' size={'sm'} onClick={() => navigate('/buy')}> Buy Crypto</Button>
                                    <Button sx={gradientButtonStyle} colorScheme='orange' size={'sm'} onClick={() => navigate('/sell')}> Sell Crypto</Button>
                                </Flex>
                            </Flex>

                        </Card>
                    </GridItem>
                    {/* Third Card */}
                    <GridItem colSpan={{ base: 1, lg: 2, xl: '1' }}>
                        <Card border={'1px solid #dcdcdc'} p={4} h={'100%'}>
                            <Flex direction={'column'} alignItems={'start'} gap={4}>
                                <Flex justifyContent={'space-between'} alignItems={'center'} w={'full'}>

                                    <Heading size={'sm'}>My Badges</Heading>
                                    <Heading size={'sm'} color={'gray'}>No Badges</Heading>
                                </Flex>
                                <Flex direction={'column'} gap={5}>
                                    {
                                        badge.map((data, index) => (


                                            <Flex key={index} gap={5}>
                                                <Image boxSize={5} src={data.logo}></Image>
                                                <Box>{data.name}</Box>
                                            </Flex>
                                        ))
                                    }



                                </Flex>

                                <Flex w={'full'} justifyContent={'end'} alignItems={'end'} mt={5}>

                                    <Button w={'full'} sx={gradientButtonStyle} size={'sm'}> View your badges</Button>
                                </Flex>
                            </Flex>

                        </Card>
                    </GridItem>
                </Grid>
                <Flex gap={5} direction={{ base: 'column', md: 'row' }}>
                    <Flex flex={1}>
                        <Card w={'full'}>
                            <Flex direction={'column'} justifyContent={'space-between'} h={'100%'}>

                                <Flex w={'full'} justifyContent={'space-between'} p={4}>

                                    <Heading size={'sm'}>My Offers</Heading>
                                    <Heading size={'sm'}>Active Offers: 5</Heading>
                                </Flex>

                                <Flex w={'full'} justifyContent={'space-between'} p={4}>
                                    <Image width={20} height={16} src='/imagelogo/cryptico.png'></Image>
                                    <Flex alignItems={'end'}>

                                        <Button sx={gradientButtonStyle} size={'sm'}> View all offers</Button>
                                    </Flex>
                                </Flex>
                            </Flex>

                        </Card>
                    </Flex>
                    <Flex flex={1}>
                        <Card w={'full'}>
                            <Flex w={'full'} justifyContent={'space-between'} p={4}>

                                <Heading size={'sm'}>Rewards</Heading>
                                <Heading size={'sm'}>254781 Seats</Heading>
                            </Flex>

                            <Flex w={'full'} justifyContent={'space-between'} p={4} wrap={'wrap'} gap={2}>
                                <Flex gap={2}>
                                    <Image boxSize={20} src='https://www.bybitglobal.com/common-static/fhs/bybit-home-new/qrCode.png?quality=70&format=webp&resize=width/150'></Image>
                                    <Flex >
                                        invite a friend using this link and get revenue share  and bonuses.

                                    </Flex>
                                </Flex>
                                <Flex alignItems={'end'}>
                                    <Button sx={gradientButtonStyle} size={'sm'}> View all Rewards</Button>
                                </Flex>
                            </Flex>


                        </Card>
                    </Flex>

                </Flex>

                <Card w="full">
                    <Heading size="lg" fontWeight={700} p={4}>
                        Trade History
                    </Heading>
                    {runningOffers?.data?.map((offer, index) => {
                        const lastSeen = offer?.partner_details?.last_seen_at
                            ? (offer?.partner_details?.last_seen_at).toLocaleString()
                            : "N/A";

                        return (
                            <Box
                                key={index}
                                border="1px solid #E2E8F0"
                                borderRadius="md"
                                p={4}
                                m={4}
                                boxShadow="sm"
                                bg="white"
                            >
                                <Flex
                                    direction={{ base: "column", md: "row" }}
                                    justify="space-between"
                                    align={{ base: "flex-start", md: "center" }}
                                    gap={{ base: 3, md: 4 }}
                                >
                                    {/* Left side */}
                                    <Flex align="center" gap={3} w="full">
                                        {/* Single Avatar */}
                                        <Tooltip
                                            label={`Last seen: ${lastSeen}`}
                                            hasArrow
                                            placement="bottom"
                                            bg="white"
                                            color="black"
                                            fontSize="xs"
                                            p={2}
                                            borderRadius="md"
                                            openDelay={200}
                                        >
                                            <Avatar
                                                src={offer?.partner_details?.profile_image_url}
                                                name={offer?.partner_details?.username || "User"}
                                                size="sm"
                                                cursor="pointer"
                                            />
                                        </Tooltip>

                                        <Box>
                                            {/* Name beside avatar */}
                                            <Flex gap={2} align="center">
                                                <Text fontWeight="semibold" cursor="pointer"
                                                    fontSize={{ base: "sm", md: "md" }} onClick={() => navigate(`/trade-partner-profile/${offer?.partner_details?.user_id || 0}`)}
                                                >
                                                    {offer?.partner_details?.username || "Unknown"}
                                                </Text>
                                                <Text fontWeight="semibold" fontSize={{ base: "sm", md: "md" }} color="gray.500">
                                                    | {offer?.payment?.payment_type || "Unknown"}
                                                </Text>
                                            </Flex>



                                            {/* Mobile-only last seen text */}
                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                                display={{ base: "block", md: "none" }}
                                            >
                                                Last seen: {lastSeen}
                                            </Text>

                                            {/* Below details */}
                                            <Flex
                                                direction="row"
                                                wrap="wrap"
                                                gap={2}
                                                fontSize={{ base: "xs", md: "sm" }}
                                                color="gray.600"
                                            >
                                                <Image boxSize={5} mt="2px" src={crypto_logo[offer?.asset]} />
                                                <Text fontWeight={'bold'}>
                                                    {offer?.trade_type} {shortName[offer.asset]}
                                                </Text>
     <Flex
  align="center"
  gap={2}
  cursor="pointer"
  onClick={() => {
    if (offer.trade_type === "buy") {
      navigate(`/tradeStart/${offer.trade_id}/buy_trade`);
    } else {
      navigate(`/tradeStart/${offer.trade_id}/sell_trade`);
    }
  }}
>
  <Text color="blue.600" fontWeight="medium" _hover={{ textDecoration: "underline" }}>
    {offer?.trade_id}
  </Text>
</Flex>


                                                <Text>{new Date(offer?.created_at).toLocaleString()}</Text>
                                            </Flex>
                                        </Box>
                                    </Flex>

                                    {/* Right side */}
                                    <Flex
                                        direction="row"
                                        align="center"
                                        justify="space-between"
                                        wrap="wrap"
                                        gap={3}
                                        w="full"
                                    >
                                        {/* Amount + Rate */}
                                        <Box>
                                            <Flex gap={2} align="baseline" wrap="wrap">
                                                <Text fontWeight="bold" fontSize="sm">
                                                    {Number(offer?.buy_amount).toFixed(2)} INR
                                                </Text>
                                                <Text fontSize="xs" color="gray">
                                                    {Number(offer?.buy_value).toFixed(8)} {shortName[offer.asset]}
                                                </Text>
                                            </Flex>
                                            <Text fontSize="xs" color="gray.600">
                                                Rate: {Number(offer?.price || 0).toLocaleString()} {offer?.partner_details?.preferred_currency} / {shortName[offer.asset]}
                                            </Text>
                                        </Box>

                                        {/* Button */}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            isDisabled
                                            color="black"
                                            backgroundColor="gray.200"
                                            p="8px"
                                        >
                                            {offer?.trade_status === "cancel"
                                                ? "Cancelled"
                                                : offer?.trade_status}
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Box>
                        );
                    })}




                </Card>


            </Flex>
        </>

    )
}
const shortName = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'binance': 'BNB',
    'tether': 'USDT',
}
const crypto_logo = {
    'bitcoin': '/imagelogo/bitcoin-btc-logo.png',
    'ethereum': '/imagelogo/ethereum-eth-logo.png',
    'binance': '/imagelogo/bnb-bnb-logo.png',
    'tether': '/imagelogo/tether-usdt-logo.png',
}

const cryptoOption = [
    { name: 'Bitcoin', logo: '/imagelogo/bitcoin-btc-logo.png' },
    { name: 'Ethereum', logo: 'imagelogo/ethereum-eth-logo.png' },
    { name: 'BNB', logo: 'imagelogo/bnb-bnb-logo.png' },
    { name: 'Tether', logo: '/imagelogo/tether-usdt-logo.png' },
]
const badge = [
    { name: 'Vendor', logo: '/imagelogo/businessman.png' },
    { name: 'Power Trader', logo: '/imagelogo/flash.png' },
    { name: 'Expert Trader', logo: '/imagelogo/badge.png' },
]


export default TradeHistoryNew