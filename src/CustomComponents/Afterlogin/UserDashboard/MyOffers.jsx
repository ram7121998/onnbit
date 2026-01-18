import {
    Box, Button, Card, Divider, Flex, Heading, Image, SlideFade, Switch, Tag, Text, useDisclosure,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    useToast,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    CircularProgress,
    useColorModeValue,

} from "@chakra-ui/react";
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
import { useNavigate } from "react-router-dom";
dayjs.extend(relativeTime);

const MyOffers = () => {
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
    return (
        <Card w={'full'}>

            <Heading size={'lg'} fontWeight={700} p={4}>Active Trades
                {/* <Tag size={'lg'} bg={activetradecolor}>3</Tag> */}
            </Heading>
            <Flex direction={'column'} justifyContent={{ base: 'space-between', sm: 'none' }} borderRadius="md" overflow="hidden" w={'full'} gap={{ base: 10, sm: 8 }} p={4}>

                {/* Table Header */}
                <Flex bg={bgColor} p={3} fontWeight="bold" w={'full'} gap={4} direction={{ base: 'column', sm: 'row' }} display={{ base: 'none', md: 'flex' }} border={'1px solid #dcdcdc'} borderTopRadius={5}>
                    <Box flex=".5" textAlign="start">Trade</Box>
                    <Box flex="1.4" textAlign="start">Amount</Box>
                    <Box flex="1.3" textAlign="start">Method</Box>
                    <Box flex="1.3" textAlign="start">Partner</Box>
                    <Box flex="1" textAlign="start" display={{ base: 'none', lg: 'flex' }}>Started</Box>
                    <Box flex="1" textAlign="start" display={{ base: 'none', xl: 'flex' }} >Status</Box>
                    <Box flex=".5" textAlign="start">Others</Box>
                </Flex>
                <Flex w={'full'} direction={'column'} gap={2} display={{ base: 'none', md: 'flex' }}>


                    {/* Table Rows (Example Data) */}
                    {
                        isloading ?
                            <Box
                                w="100%"
                                h="100%"
                                bg={spinnerColor}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                            >
                                {/* <Spinner mb={10} size="xl" color="blue.500" /> */}
                                <CircularProgress isIndeterminate color="orange.500" size="60px" />
                            </Box>
                            :

                            runningOffers?.data?.map((item, index) => (
                                <Flex key={index} p={3} bg={bgColor_1} w={'full'} fontWeight={500} gap={5} direction={{ base: 'column', sm: 'row' }}  >
                                    <Box flex=".5" textAlign="start" fontWeight={600}>{item.trade_type}</Box>
                                    <Flex flex="1.4" textAlign="start" direction={'column'} gap={2}>
                                        {Number(item.buy_amount).toFixed(2)}&nbsp;INR
                                        <Flex gap={2} flexWrap={'wrap'}>
                                            <Image boxSize={5} src={crypto_logo[item?.asset]}></Image>
                                            <Text fontSize={'sm'} >{Number(item?.buy_value).toFixed(7)}&nbsp;{shortName[item.asset]}</Text>
                                        </Flex>
                                    </Flex>
                                    <Box flex="1.3" textAlign="start">{item?.payment?.payment_method?.payment_method}</Box>
                                    <Box flex="1.3" textAlign="start" color={'#ad6d29'} >{item?.partner_details?.username}</Box>
                                    <Flex direction={'column'} flex={1} display={{ base: 'none', lg: 'flex' }}>

                                        <Box flex="1" textAlign="start" color={'gray'}>{dayjs(item?.created_at).fromNow()}</Box>
                                        <Box flex="1" textAlign="start" color={getStatusColorText(item.buyer_status)} display={{ base: 'flex', xl: 'none' }} >{item.buyer_status}</Box>
                                    </Flex>

                                    <Box flex="1" textAlign="start" color={getStatusColorText(item.buyer_status)} display={{ base: 'none', xl: 'flex' }} >{item.buyer_status}</Box>
                                    <Box flex=".5" textAlign="start" color="blue.500" cursor="pointer" display={{ base: 'none', lg: 'flex' }} onClick={() => {
                                        if (item.trade_type === "buy") {
                                            navigate(`/tradeStart/${item.trade_id}/buy_trade`);
                                        } else if (item.trade_type === "sell") {
                                            navigate(`/tradeStart/${item.trade_id}/sell_trade`);
                                        }
                                    }}

                                    >view</Box>


                                    {/* For small Screen */}
                                    <Flex direction={'column'} display={{ base: 'flex', lg: 'none' }} alignItems={'end'}>

                                        <Box textAlign="end" color={'gray'} >{dayjs(item?.created_at).fromNow()}</Box>
                                        <Box textAlign="end" color={getStatusColorText(item.buyer_status)} display={{ base: 'flex', xl: 'none' }} >{item.buyer_status}</Box>
                                        <Box textAlign="end" color="blue.500" cursor="pointer"
                                        >view</Box>

                                    </Flex>
                                </Flex>
                            ))}
                </Flex>

                <MobileActiveOffer isloading={isloading} />
                {/* pagination code */}

                <Flex justifyContent={'space-between'} direction={{ base: 'column', md: 'row' }} alignItems={'center'} px={8}  >
                    {
                        runningOffers?.data?.length > 0 &&
                        <Flex direction={'column'} textAlign={{ base: 'center', md: 'start' }}>
                            <Box size={'md'} color={'orange.500'} fontWeight={600}>Total Active Trade : <Box fontWeight={600} as={'span'} color={textColor}> {runningOffers?.pagination?.total}</Box> </Box>
                            <Box size={'md'} color={'orange.500'} fontWeight={600}> Pages : <Box fontWeight={600} as={'span'} color={textColor}> {runningOffers?.pagination?.last_page}</Box></Box>
                        </Flex>
                    }
                    <PaginatedList detail={runningOffers?.pagination} setIsLoading={setIsLoading} type='trade_history' />
                </Flex>

                <Divider />



                <Flex direction={'column'} gap={3} mt={{ base: 0, md: 8 }}>

                    <Flex direction={'column'} mb={0}>
                        <Flex direction={{ base: 'column-reverse', sm: 'row' }} justifyContent={'space-between'} gap={2}>
                            <Flex direction={{ base: 'column-reverse', sm: 'row' }} justifyContent={'space-between'} gap={4}>

                                <Button
                                    variant={'outline'}
                                    bg={isSellOffer ? 'gray.200' : 'transparent'}
                                    borderTopRadius={5}
                                    borderBottomRadius={0}
                                    // borderBottom={{ base: 'none', md: '1px solid #dcdcdc' }}
                                    _hover={{ bg: 'gray.100', }}
                                    onClick={() => handleBuySellOfferShow('sell')}
                                    _active={{ borderBottom: '1px solid black' }}
                                    rightIcon={<Tag bg={bgColor_tags} >{myOfferAnalytics?.totalUserSellAds}</Tag>}
                                >
                                    Offers to sell
                                </Button>
                                <Button
                                    variant={'outline'}
                                    bg={!isSellOffer ? 'gray.200' : ''}
                                    borderTopRadius={5}
                                    borderBottomRadius={0}

                                    _hover={{ bg: 'gray.100' }}

                                    onClick={() => handleBuySellOfferShow('buy')}
                                    _active={{ borderBottom: '1px solid black' }}
                                    rightIcon={<Tag bg={bgColor_tags}>{myOfferAnalytics?.totalUserBuyAds}</Tag>}
                                >
                                    Offers to buy
                                </Button>

                            </Flex>
                            <Flex gap={2} alignSelf={'start'}>
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        icon={<MdOutlineSettings />}
                                        variant="outline"
                                        colorScheme="orange"
                                        aria-label="Options"
                                        borderRadius="full"
                                    />
                                    <MenuList>
                                        <MenuItem fontWeight={600} onClick={handleActive}>Turn On All Offers</MenuItem>
                                        <MenuItem onClick={handleInActive}>Turn Off All Offers</MenuItem>
                                    </MenuList>
                                </Menu>
                            </Flex>


                        </Flex>
                        <Divider display={{ base: 'flex', md: 'none' }} />
                    </Flex>
                    {
                        isSellOffer ?
                            mySellOffer?.length > 0 ?
                                mySellOffer.map((data, index) => (
                                    <MobileAllOffers key={data.crypto_ad_id} data={data} isActive={isActive} setIsActive={setIsActive} handlechangeActiveStatus={handlechangeActiveStatus} changeErrors={changeErrors} toggleStatesSell={toggleStatesSell} setToggleStatesSell={setToggleStatesSell} setChangeErrors={setChangeErrors} />
                                ))
                                :
                                <Box
                                    w="100%"
                                    h="100%"
                                    bg={spinnerColor}
                                    display={{ base: 'flex', md: 'none' }}
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    {/* <Spinner mb={10} size="xl" color="blue.500" /> */}
                                    <CircularProgress isIndeterminate color="orange.500" size="60px" />
                                </Box>

                            :
                            myBuyOffer?.length > 0 ?
                                myBuyOffer.map((data, index) => (
                                    <MobileAllOffers key={data.crypto_ad_id} data={data} isActive={isActive} setIsActive={setIsActive} handlechangeActiveStatus={handlechangeActiveStatus} changeErrors={changeErrors} toggleStatesBuy={toggleStatesBuy} setToggleStatesBuy={setToggleStatesBuy} setChangeErrors={setChangeErrors} />
                                ))
                                :
                                <Box
                                    w="100%"
                                    h="100%"
                                    bg={spinnerColor}
                                    display={{ base: 'flex', md: 'none' }}

                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    {/* <Spinner mb={10} size="xl" color="blue.500" /> */}
                                    <CircularProgress isIndeterminate color="orange.500" size="60px" />
                                </Box>


                    }

                    <Flex direction={'column'}>
                        <AllOffers isActive={isActive} setIsActive={setIsActive} mySellOffer={mySellOffer} myBuyOffer={myBuyOffer} isSellOffer={isSellOffer} />
                    </Flex>
                    {
                        isSellOffer ?
                            <Flex justifyContent={'space-between'} direction={{ base: 'column', md: 'row' }} alignItems={'center'} px={8}  >


                                <Flex direction={'column'} textAlign={{ base: 'center', md: 'start' }}>
                                    <Box size={'md'} color={'orange.500'} fontWeight={600}>Total Sell Offers : <Box fontWeight={600} as={'span'} color={textColor}> {myOfferAnalytics?.totalUserSellAds}</Box> </Box>
                                    <Box size={'md'} color={'orange.500'} fontWeight={600}> Pages : <Box fontWeight={600} as={'span'} color={textColor}> {pagination?.last_page}</Box></Box>
                                </Flex>

                                <PaginatedList detail={pagination} setIsLoading={setIsLoading} type='mySellOffer' />
                            </Flex>
                            :
                            <Flex justifyContent={'space-between'} direction={{ base: 'column', md: 'row' }} alignItems={'center'} px={8}  >


                                <Flex direction={'column'} textAlign={{ base: 'center', md: 'start' }}>
                                    <Box size={'md'} color={'orange.500'} fontWeight={600}>Total buy Offers : <Box fontWeight={600} as={'span'} color={textColor}> {myOfferAnalytics?.totalUserBuyAds}</Box> </Box>
                                    <Box size={'md'} color={'orange.500'} fontWeight={600}> Pages : <Box fontWeight={600} as={'span'} color={textColor}> {pagination?.last_page}</Box></Box>
                                </Flex>
                                <PaginatedList detail={pagination} setIsLoading={setIsLoading} type='myBuyOffer' />
                            </Flex>
                    }
                </Flex>
            </Flex>
        </Card>
    );
};

const AllOffers = ({ isActive, setIsActive, mySellOffer, myBuyOffer, isSellOffer }) => {

    const toast = useToast();
    const [changeErrors, setChangeErrors] = useState({});
    const { handlechangeActiveStatus } = useOffer()
    const [toggleStatesSell, setToggleStatesSell] = useState({});
    const [toggleStatesBuy, setToggleStatesBuy] = useState({});
    const [isloading, setIsLoading] = useState(true);
    const { priceRef } = useOtherDetail();
    const bgColor = useColorModeValue('gray.200', 'gray.500');
    const bgColor_1 = useColorModeValue('gray.50', 'gray.700');
    const bgColor_tags = useColorModeValue('gray.200', 'gray.600');
    const spinnerColor = useColorModeValue('whiteAlpha.800', 'gray.500');
    const textColor = useColorModeValue('gray.500', 'white');
    const switchColorScheme = useColorModeValue('blue', 'orange');
    const textColor_1 = useColorModeValue('brown', 'pink');
    const navigate = useNavigate()





    setTimeout(() => {
        setIsLoading(false);
    }, 3000);

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
    console.log("mySellOffermySellOffervew", mySellOffer)
    console.log("myBuyOffer", myBuyOffer)

    return (
        <Flex direction={'column'} display={{ base: 'none', md: 'flex' }}>
            {/* Heading ---------------------------- */}
            <Flex px={3} py={6} fontWeight="bold" w={'full'} gap={4} direction={{ base: 'column', sm: 'row' }} border={'1px solid #dcdcdc'} borderTopRadius={5} fontSize="14px"   // 👈 yahan font size kam kiya
            >
                <Box flex="1" textAlign="start">
                    Highlight offers
                </Box>
                <Box flex="1.2" textAlign={{ lg: 'center', xl: "start" }}>Rate</Box>
                <Box flex="1.2" textAlign="start">Min-Max amount</Box>
                <Box flex="1.2" textAlign="start">Payment method</Box>
                <Box flex=".4" textAlign="start">Offer Views</Box>
            </Flex>
            {/* Data -------------------- */}


            {/* Offert To sell/buy */}
            {
                isloading ?
                    <Box
                        w="100%"
                        h="100%"
                        bg={spinnerColor}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        mt={10}
                    >
                        {/* <Spinner mb={10} size="xl" color="blue.500" /> */}
                        <CircularProgress isIndeterminate color="orange.500" size="60px" />
                    </Box>
                    :
                    (

                        isSellOffer ?
                            mySellOffer?.length > 0 ?
                                mySellOffer.map((data) => (

                                    <Flex key={data.crypto_ad_id} direction={'column'} border={'1px solid #dcdcdc'} bg={bgColor_1} gap={6} py={6} px={3}>

                                        {/* FirstRow */}
                                        <Flex fontWeight="bold" w={'full'} gap={4} direction={{ base: 'column', sm: 'row' }} >
                                            <Flex flex="1" textAlign="start" direction={'column'} gap={5}>
                                                <Flex gap={5}>
                                                    <Switch
                                                        size={'md'}
                                                        isChecked={toggleStatesSell[data.crypto_ad_id]}

                                                        onChange={async () => {
                                                            // 1. Toggle local state immediately
                                                            setToggleStatesSell(prev => ({
                                                                ...prev,
                                                                [data.crypto_ad_id]: !prev[data.crypto_ad_id]
                                                            }));

                                                            // 2. Send to API
                                                            const request = {
                                                                id: data.crypto_ad_id,
                                                                is_active: !toggleStatesSell[data.crypto_ad_id],
                                                            };

                                                            setIsActive(!toggleStatesSell[data.crypto_ad_id]);
                                                            try {

                                                                await handlechangeActiveStatus(request);
                                                            }
                                                            catch (error) {
                                                                console.log(error);
                                                                toast({
                                                                    title: "Error",
                                                                    description: error?.message,
                                                                    status: "info",
                                                                    duration: 2000,
                                                                    position: 'top-right'

                                                                })
                                                                setChangeErrors(prev => ({
                                                                    ...prev,
                                                                    [data.crypto_ad_id]: error?.errors || "Something went wrong"
                                                                }));
                                                                setToggleStatesSell(prev => ({
                                                                    ...prev,
                                                                    [data.crypto_ad_id]: true
                                                                }));

                                                            }
                                                        }}
                                                        colorScheme="orange"
                                                    />
                                                    <Image boxSize={5} src={crypto_logo[data.cryptocurrency]}></Image>


                                                </Flex>
                                                <Flex gap={5} >
                                                    <Button size={'sm'} onClick={() =>
                                                            navigate('/BuyOfferCard', { state: { data } })

                                                    }
                                                    >View</Button>
                                                    <Button size={'sm'} onClick={() =>
                                                        navigate(`/offer-manager/${data.crypto_ad_id}`, {
                                                            state: { offerData: data }
                                                        })} >Edit</Button>

                                                </Flex>

                                            </Flex>

                                            <Flex flex="1.2" textAlign="end" gap={2} flexWrap={'wrap'} color={toggleStatesSell[data.crypto_ad_id] ? " blackAlpha.800" : " blackAlpha.600"}  >
                                                {((priceRef?.current?.[data?.cryptocurrency === 'binance' ? 'binancecoin' : data?.cryptocurrency]?.inr * (Number(data?.offer_margin) + 100)) / 100).toFixed(2)}<Box fontSize={'10px'} mt={1}>INR</Box>
                                                <Changemargin color={toggleStatesSell[data.crypto_ad_id] ? "black" : " blackAlpha.600"}
                                                    margin={data?.offer_margin} id={data?.crypto_ad_id} />
                                            </Flex>
                                            <Flex gap={1} flex="1.2" textAlign="start" flexWrap={'wrap'}>

                                                <Minmaxmodal
                                                    min={data?.min_trade_limit}
                                                    max={data?.max_trade_limit}
                                                    id={data?.crypto_ad_id}
                                                    boxStyle={{
                                                        border: "1px solid",
                                                        borderColor: toggleStatesSell?.[data.crypto_ad_id] ? "#b7eb00" : "transparent",

                                                        borderRadius: "8px",
                                                        bg: toggleStatesSell?.[data.crypto_ad_id] ? "#fcfff5" : "#ebeef3ff",
                                                        color: "black",
                                                        px: 3,
                                                        py: 1,
                                                        fontSize: "14px",
                                                        fontWeight: 500,
                                                        w: "fit-content"

                                                    }}
                                                />

                                            </Flex>
                                            <Flex flex="1.2" direction="column" textAlign="start" gap={1}>
                                                {/* Title */}
                                                <Box
                                                    color={toggleStatesSell[data.crypto_ad_id] ? "black" : "blackAlpha.600"}
                                                    fontWeight="700"
                                                    fontSize="14px"
                                                    lineHeight="20px"
                                                >
                                                    {JSON.parse(data?.payment_method)?.payment_method}
                                                </Box>

                                                {/* Sub Title */}
                                                <Box
                                                    color="gray"
                                                    fontSize="13px"
                                                    lineHeight="20px"
                                                >
                                                    {data?.offer_label}
                                                </Box>

                                                {/* Tags */}
                                                <Flex gap={2} flexWrap="wrap" py={1}>
                                                    {data?.offer_tags.length > 0 &&
                                                        data?.offer_tags.map((tag, index) => (
                                                            <Box
                                                                key={index}
                                                                fontSize="12px"
                                                                fontWeight="500"
                                                                borderRadius="5"
                                                                px={2}
                                                                py={1}
                                                                border="1px solid"

                                                                borderColor={toggleStatesSell[data.crypto_ad_id] ? "#b7eb00" : "transparent"}

                                                                bg={toggleStatesSell[data.crypto_ad_id] ? "#fcfff5" : "rgba(255,255,255,0.6)"}
                                                                w="fit-content"
                                                                transition="background-color 0.3s ease"
                                                            >
                                                                {tag}
                                                            </Box>
                                                        ))}
                                                </Flex>
                                            </Flex>

                                            {/* Right side icons */}
                                            <Flex
                                                flex=".4"
                                                justifyContent="end"
                                                alignItems="center"
                                                gap={2}
                                                color={toggleStatesSell[data.crypto_ad_id] ? "blackAlpha.900" : "blackAlpha.600"}
                                            >
                                                <Box fontSize="14px">1</Box>
                                                <Box fontSize="14px" color={toggleStatesSell[data.crypto_ad_id] ? "blackAlpha.900" : "blackAlpha.600"}
                                                >
                                                    <BsEye />
                                                </Box>
                                            </Flex>

                                        </Flex>


                                        {/* second Row */}
                                        <Flex direction={'column'} gap={2} color={textColor_1} marginTop="-4" fontSize="14px" >
                                            <Flex gap={2}>
                                                <Box color={toggleStatesSell[data.crypto_ad_id] ? '' : 'inherit'}
                                                    opacity={toggleStatesSell[data.crypto_ad_id] ? 1 : 0.4} mt={1}><BsExclamationCircle /></Box>
                                                <Box color={toggleStatesSell[data.crypto_ad_id] ? '' : 'inherit'}
                                                    opacity={toggleStatesSell[data.crypto_ad_id] ? 1 : 0.4}  >
                                                    We've updated the maximum amount
                                                    for this offer according to your current balance
                                                    , deposit more Bitcoin to raise it
                                                </Box>
                                            </Flex>
                                            <Flex gap={2}>
                                                <Box color={toggleStatesSell[data.crypto_ad_id] ? '' : 'inherit'}
                                                    opacity={toggleStatesSell[data.crypto_ad_id] ? 1 : 0.4} mt={1}><BsExclamationCircle /></Box>
                                                <Box color={toggleStatesSell[data.crypto_ad_id] ? '' : 'inherit'}
                                                    opacity={toggleStatesSell[data.crypto_ad_id] ? 1 : 0.4}>
                                                    To make your offer public, make sure you have crypto worth at least 500.00 INR in your wallet.
                                                </Box>
                                            </Flex>

                                        </Flex>
                                        {changeErrors[data.crypto_ad_id] && (
                                            <Heading
                                                key={data.crypto_ad_id}
                                                size="sm"
                                                color={'red'}
                                                fontWeight={500}
                                            >
                                                {changeErrors[data.crypto_ad_id]}
                                            </Heading>
                                        )}
                                    </Flex>
                                ))
                                :
                                <Heading fontSize={'lg'} textAlign={'center'} p={5} color={textColor}>No Active Sell Offers</Heading>
                            :
                            myBuyOffer?.length > 0 ?
                                myBuyOffer.map((data, index) => (

                                    <Flex direction={'column'} key={index} border={'1px solid #dcdcdc'} bg={bgColor_1} gap={6} py={6} px={3}>

                                        {/* FirstRow */}
                                        <Flex fontWeight="bold" w={'full'} gap={4} direction={{ base: 'column', sm: 'row' }} >
                                            <Flex flex="1" textAlign="start" direction={'column'} gap={5}>
                                                <Flex gap={5}>
                                                    <Switch
                                                        size={'md'}
                                                        isChecked={toggleStatesBuy[data.crypto_ad_id]}
                                                        onChange={async () => {
                                                            // 1. Toggle local state immediately
                                                            setToggleStatesBuy(prev => ({
                                                                ...prev,
                                                                [data.crypto_ad_id]: !prev[data.crypto_ad_id]
                                                            }));

                                                            // 2. Send to API
                                                            const request = {
                                                                id: data.crypto_ad_id,
                                                                is_active: !toggleStatesBuy[data.crypto_ad_id],
                                                            };

                                                            setIsActive(!toggleStatesBuy[data.crypto_ad_id]);
                                                            try {

                                                                await handlechangeActiveStatus(request);
                                                            }
                                                            catch (error) {
                                                                toast({
                                                                    title: "Error",
                                                                    description: error?.message,
                                                                    status: "info",
                                                                    duration: 2000,
                                                                    position: 'top-right'

                                                                })
                                                                setChangeErrors(prev => ({
                                                                    ...prev,
                                                                    [data.crypto_ad_id]: error?.errors || "Something went wrong"
                                                                }));
                                                                setToggleStatesBuy(prev => ({
                                                                    ...prev,
                                                                    [data.crypto_ad_id]: true
                                                                }));

                                                            }
                                                        }}
                                                        colorScheme="orange"
                                                    />
                                                    <Image boxSize={5} src={crypto_logo[data.cryptocurrency]}></Image>


                                                </Flex>
                                                <Flex gap={5} >
                                                    <Button size={'sm'} onClick={() =>
                                                        navigate(`/BuyOfferCard/${data.user_id}/${data.crypto_ad_id}`)
                                                    } >View</Button>
                                                    <Button size={'sm'} onClick={() =>
                                                        navigate(`/offer-manager/${data.crypto_ad_id}`, {
                                                            state: { offerData: data }
                                                        })} >Edit</Button>

                                                </Flex>

                                            </Flex>

                                            <Flex flex="1.2" textAlign="end" gap={1} flexWrap={'wrap'}
                                                color={toggleStatesBuy[data.crypto_ad_id] ? " blackAlpha.800" : " blackAlpha.600"}  >
                                                {((priceRef?.current?.[data?.cryptocurrency === 'binance' ? 'binancecoin' : data?.cryptocurrency]?.inr * (Number(data?.offer_margin) + 100)) / 100).toFixed(2)}<Box fontSize={'10px'} mt={1}>INR</Box>
                                                <Changemargin margin={data?.offer_margin} id={data?.crypto_ad_id} />
                                            </Flex>
                                            <Flex gap={1} flex="1.2" textAlign="start" flexWrap={'wrap'}>

                                                <Minmaxmodal min={data?.min_trade_limit} max={data?.max_trade_limit} id={data?.crypto_ad_id} boxStyle={{
                                                    border: "1px solid",
                                                    borderColor: toggleStatesBuy?.[data.crypto_ad_id] ? "#b7eb00" : "transparent",

                                                    borderRadius: "8px",
                                                    bg: toggleStatesBuy?.[data.crypto_ad_id] ? "#fcfff5" : "#ebeef3ff",
                                                    color: "black",
                                                    px: 3,
                                                    py: 1,
                                                    fontSize: "14px",
                                                    fontWeight: 500,
                                                    w: "fit-content"

                                                }} />

                                            </Flex>
                                            <Flex flex="1.2" textAlign="start" direction={'column'}>

                                                <Box

                                                    color={toggleStatesBuy[data.crypto_ad_id] ? "black" : "blackAlpha.600"}
                                                    px={2}
                                                    py={1}
                                                    borderRadius={4}
                                                    w="fit-content" // background only text width
                                                    transition="background-color 0.3s ease"
                                                >
                                                    {JSON.parse(data?.payment_method)?.payment_method}
                                                </Box>


                                                <Box
                                                    color="gray"
                                                >
                                                    {data?.offer_label}
                                                </Box>
                                                {/* <Box color={'gray'} fontSize={'12px'} my={2}>All Payment Accepted</Box> */}
                                                <Flex gap={2} flexWrap={'wrap'} mt={2}>
                                                    {
                                                        data?.offer_tags.length > 0 && data?.offer_tags.map((tag, index) => (

                                                            <Box
                                                                border="1px solid"

                                                                borderColor={toggleStatesBuy[data.crypto_ad_id] ? "#b7eb00" : "transparent"}

                                                                bg={toggleStatesBuy[data.crypto_ad_id] ? "#fcfff5" : "rgba(255,255,255,0.6)"} px={2}
                                                                py={1}
                                                                borderRadius={4}
                                                                w="fit-content" // background only text width
                                                                transition="background-color 0.3s ease"
                                                                p={2}
                                                                key={index}
                                                                fontSize={'12px'}
                                                                fontWeight={500}
                                                            >{tag}</Box>
                                                        ))
                                                    }

                                                </Flex>


                                            </Flex>
                                            <Flex flex=".4" justifyContent={'end'} gap={2}
                                                color={toggleStatesBuy[data.crypto_ad_id] ? "black" : "blackAlpha.600"}

                                            >1
                                                <Box mt={1} color={toggleStatesBuy[data.crypto_ad_id] ? "black" : "blackAlpha.600"}
                                                ><BsEye /></Box>
                                            </Flex>
                                        </Flex>


                                        {/* second Row */}
                                        <Flex direction={'column'} gap={2} color={textColor_1} pl={3} marginTop="-4" fontSize="14px">
                                            <Flex gap={2}>
                                                <Box color={toggleStatesBuy[data.crypto_ad_id] ? '' : 'inherit'}
                                                    opacity={toggleStatesBuy[data.crypto_ad_id] ? 1 : 0.4} mt={1}><BsExclamationCircle /></Box>
                                                <Box color={toggleStatesBuy[data.crypto_ad_id] ? '' : 'inherit'}
                                                    opacity={toggleStatesBuy[data.crypto_ad_id] ? 1 : 0.4}>
                                                    We've updated the maximum amount
                                                    for this offer according to your current balance
                                                    , deposit more Bitcoin to raise it
                                                </Box>
                                            </Flex>
                                            <Flex gap={2}>
                                                <Box color={toggleStatesBuy[data.crypto_ad_id] ? '' : 'inherit'}
                                                    opacity={toggleStatesBuy[data.crypto_ad_id] ? 1 : 0.4} mt={1}><BsExclamationCircle /></Box>
                                                <Box color={toggleStatesBuy[data.crypto_ad_id] ? '' : 'inherit'}
                                                    opacity={toggleStatesBuy[data.crypto_ad_id] ? 1 : 0.4}>
                                                    To make your offer public, make sure you have crypto worth at least 500.00 INR in your wallet.
                                                </Box>
                                            </Flex>
                                        </Flex>
                                        {changeErrors[data.crypto_ad_id] && (
                                            <Heading
                                                key={data.crypto_ad_id}
                                                size="sm"
                                                color={'red'}
                                                fontWeight={500}
                                            >
                                                {changeErrors[data.crypto_ad_id]}
                                            </Heading>
                                        )}
                                    </Flex>
                                ))
                                :
                                <Heading fontSize={'lg'} textAlign={'center'} p={5} color={textColor}>No Active Buy Offers</Heading>
                    )
            }
        </Flex>
    )
}

const MobileAllOffers = ({ isActive, setIsActive, toggleStatesSell, toggleStatesBuy, changeErrors, handlechangeActiveStatus, data, setToggleStatesBuy, setToggleStatesSell, setChangeErrors }) => {
    const [isShow, setIsShow] = useState(false);
    const toast = useToast();
    const { priceRef } = useOtherDetail();
    const bgColor = useColorModeValue('gray.200', 'gray.500');
    const bgColor_1 = useColorModeValue('gray.50', 'gray.700');
    const textColor = useColorModeValue('gray.500', 'white');
    const bgColor_tags = useColorModeValue('gray.200', 'gray.600');
    const spinnerColor = useColorModeValue('whiteAlpha.800', 'gray.500');
    const textColor_1 = useColorModeValue('brown', 'pink');
    const navigate = useNavigate()

    const parsedData = JSON.parse(data?.payment_method);




    return (
        <>
            <Flex w={'full'} direction={'column'} gap={5} p={3} border={'1px solid #dcdcdc'} bg={bgColor_1} display={{ base: 'flex', md: 'none' }}>
                <Flex justifyContent={'space-between'} w={'full'}>
                    <Flex direction={'column'}>
                        <Box fontSize={'14px'} fontWeight={500} color={textColor}>{parsedData?.payment_method}</Box>
                    </Flex>
                    <Box>
                        {/* switch sell */}
                        {data.transaction_type === 'sell' &&
                            <Switch
                                size={'md'}
                                isChecked={toggleStatesSell[data.crypto_ad_id]}

                                onChange={async () => {
                                    // 1. Toggle local state immediately
                                    setToggleStatesSell(prev => ({
                                        ...prev,
                                        [data.crypto_ad_id]: !prev[data.crypto_ad_id]
                                    }));

                                    // 2. Send to API
                                    const request = {
                                        id: data.crypto_ad_id,
                                        is_active: !toggleStatesSell[data.crypto_ad_id],
                                    };

                                    setIsActive(!toggleStatesSell[data.crypto_ad_id]);
                                    try {

                                        await handlechangeActiveStatus(request);
                                    }
                                    catch (error) {
                                        console.log(error);
                                        toast({
                                            title: "Error",
                                            description: error?.message,
                                            status: "info",
                                            duration: 2000,
                                            position: 'top-right'

                                        })
                                        setChangeErrors(prev => ({
                                            ...prev,
                                            [data.crypto_ad_id]: error?.errors || "Something went wrong"
                                        }));
                                        setToggleStatesSell(prev => ({
                                            ...prev,
                                            [data.crypto_ad_id]: true
                                        }));

                                    }
                                }}
                                colorScheme="orange"
                            />
                        }
                        {/* switch buy */}
                        {data.transaction_type === 'buy' &&
                            <Switch
                                size={'md'}
                                isChecked={toggleStatesBuy[data.crypto_ad_id]}
                                onChange={async () => {
                                    // 1. Toggle local state immediately
                                    setToggleStatesBuy(prev => ({
                                        ...prev,
                                        [data.crypto_ad_id]: !prev[data.crypto_ad_id]
                                    }));

                                    // 2. Send to API
                                    const request = {
                                        id: data.crypto_ad_id,
                                        is_active: !toggleStatesBuy[data.crypto_ad_id],
                                    };

                                    setIsActive(!toggleStatesBuy[data.crypto_ad_id]);
                                    try {

                                        await handlechangeActiveStatus(request);
                                    }
                                    catch (error) {
                                        toast({
                                            title: "Error",
                                            description: error?.message,
                                            status: "info",
                                            duration: 2000,
                                            position: 'top-right'

                                        })
                                        setChangeErrors(prev => ({
                                            ...prev,
                                            [data.crypto_ad_id]: error?.errors || "Something went wrong"
                                        }));
                                        setToggleStatesBuy(prev => ({
                                            ...prev,
                                            [data.crypto_ad_id]: true
                                        }));

                                    }
                                }}
                                colorScheme="orange"
                            />

                        }
                    </Box>
                </Flex>
                <Flex justifyContent={'space-between'} w={'full'}>
                    <Box fontSize={'12px'} fontWeight={500} color={textColor}>Rate</Box>
                    <Flex gap={2} >
                        <Flex fontSize={'12px'} fontWeight={500} color={textColor}>

                            {((priceRef?.current?.[data?.cryptocurrency === 'binance' ? 'binancecoin' : data?.cryptocurrency]?.inr * (Number(data?.offer_margin) + 100)) / 100).toFixed(2)}<Box color={textColor} fontSize={'10px'} mt={0.5}>&nbsp;INR</Box>
                        </Flex>
                        <Changemargin margin={data?.offer_margin} id={data?.crypto_ad_id} />
                    </Flex>

                </Flex>
                <Flex>
                    <Box flex="1.2" fontSize={'12px'} fontWeight={500} textAlign="start" color={textColor}>Limit</Box>
                    <Minmaxmodal min={data?.min_trade_limit} max={data?.max_trade_limit} id={data?.crypto_ad_id} boxStyle={{
                        border: "1px solid",
                        borderColor: toggleStatesBuy?.[data.crypto_ad_id] ? "#b7eb00" : "transparent",

                        borderRadius: "8px",
                        bg: toggleStatesSell?.[data.crypto_ad_id] ? "#fcfff5" : "#ebeef3ff",
                        color: "black",
                        px: 3,
                        py: 1,
                        fontSize: "14px",
                        fontWeight: 500,
                        w: "fit-content"

                    }} />
                </Flex>
                <Flex justifyContent={'space-between'} w={'full'}>
                    <Box fontSize={'12px'} fontWeight={500} color={textColor} onClick={() =>
                        navigate(`/BuyOfferCard/${data.user_id}/${data.crypto_ad_id}`)
                    }> Views</Box>
                    <Flex flex=".4" justifyContent={'end'} gap={2} >1
                        <Box mt={1} color={'gray'}><BsEye /></Box>
                    </Flex>
                </Flex>
                <Flex justifyContent={'space-between'} w={'full'} alignItems={'center'}>
                    <Image boxSize={5} src={crypto_logo[data.cryptocurrency]}></Image>
                    <Button size={'sm'} bg={'transparent'} onClick={() => setIsShow((prev) => !prev)} rightIcon={isShow ? <MdKeyboardArrowDown /> : <MdKeyboardArrowRight />}>{isShow ? 'Show less' : 'See more'}</Button>
                </Flex>
                {
                    isShow &&

                    <Flex direction={'column'} gap={4}>
                        <Flex justifyContent={'space-between'} w={'full'} >
                            <Box fontSize={'12px'} fontWeight={500} color={textColor}>Tags:</Box>
                            <Flex justifyContent={'end'} gap={2} flexWrap={'wrap'} >
                                {
                                    data?.offer_tags.length > 0 && data?.offer_tags.map((tag, index) => (

                                        <Box
                                            p={1}
                                            key={index}
                                            fontSize={'12px'}
                                            borderRadius={5}
                                            bg={bgColor_tags}
                                        >{tag}</Box>
                                    ))
                                }

                            </Flex>
                        </Flex>
                        <Flex justifyContent={'space-between'} w={'full'}>
                            <Box fontSize={'12px'} fontWeight={500} color={textColor}>Speed:</Box>
                            <Button size={'xs'} bg={'transparent'}>New</Button>
                        </Flex>
                        <Flex justifyContent={'space-between'} w={'full'}>
                            <Box fontSize={'12px'} fontWeight={500} color={textColor}>Lable:</Box>
                            <Box>{data?.offer_label}</Box>

                        </Flex>

                        <Flex direction={'column'} gap={4}>
                            <Button variant={'outline'} onClick={() =>
                                navigate(`/BuyOfferCard/${data.user_id}/${data.crypto_ad_id}`)
                            }>View</Button>
                            <Button variant={'outline'} onClick={() =>
                                navigate(`/offer-manager/${data.crypto_ad_id}`, {
                                    state: { offerData: data }
                                })} >Edit</Button>
                        </Flex>
                    </Flex>
                }
                {/* second Row */}
                <Flex direction={'column'} gap={2} color={textColor_1} pl={3} fontSize={'10px'}>
                    <Flex gap={2}>
                        <Box mt={1}><BsExclamationCircle /></Box>
                        <Box>
                            We've updated the maximum amount
                            for this offer according to your current balance
                            , deposit more Bitcoin to raise it
                        </Box>
                    </Flex>
                    <Flex gap={2} fontSize={'10px'}>
                        <Box mt={1}><BsExclamationCircle /></Box>
                        <Box>
                            To make your offer public, make sure you have crypto worth at least 500.00 INR in your wallet.
                        </Box>
                    </Flex>
                </Flex>
                {/* Errro showing */}
                {changeErrors[data.crypto_ad_id] && (
                    <Heading
                        bg={'red.50'}
                        borderRadius={5}
                        p={4}
                        key={data.crypto_ad_id}
                        size="sm"
                        color={'red.500'}
                        fontWeight={500}
                    >
                        {changeErrors[data.crypto_ad_id]}
                    </Heading>
                )}

            </Flex>
        </>
    )
}
const getStatusColor = (status) => {
    switch (status) {
        case "Active":
            return "green.50";  // Active → Green
        case "Disputed":
            return "red.50";    // Disputed → Red
        case "Pending":
            return "orange.50"; // Pending → Yellow
        default:
            return "gray.50";   // Default Gray
    }
};
const getStatusColorText = (status) => {
    switch (status) {
        case "success":
            return "green.500";  // Active → Green
        case "pending":
            return "red.500";    // Disputed → Red
        case "processing":
            return "yellow.500"; // Pending → Yellow
        default:
            return "gray.500";   // Default Gray
    }
};

const Minmaxmodal = ({ min, max, id, boxStyle }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [minimum, setMinimum] = useState();
    const [maximum, setMaximum] = useState();
    const toast = useToast()

    const initialRef = useRef(null)
    const finalRef = useRef(null)
    const { handleUpdateCryptoAd, handleGetMyOffer } = useOffer();
    const updateCryptoMinMax = async () => {
        const req = new CryptoUpdateRequest();
        const req1 = new MyOfferRequest();
        req.cryptoAd_id = id;
        req.min_trade_limit = Number(minimum) || Number(min);
        req.max_trade_limit = Number(maximum) || Number(max);
        const res = await handleUpdateCryptoAd(req);
        req1.txn_type = '';
        handleGetMyOffer(req1);
        if (res?.data?.status === true) {
            onClose();

            toast({
                title: "Success",
                description: res?.data?.message,
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "bottom",
            })
        }
    }



    return (
        <>
            <Button
                onClick={onOpen}
                bg="transparent"
                _hover={{ bg: 'transparent' }}
                size="xs"
                p={0}
                display="flex"
                alignItems="center"
                gap={1}
            >
                {/* Min Value */}
                <Box
                    {...boxStyle}
                    px={2}
                    py="1px"
                    fontSize="12px"
                    fontWeight={500}
                    border="1px solid"
                    borderRadius="4px"

                    w="fit-content"
                    lineHeight="2"
                    display="inline-flex"
                    alignItems="center"
                >
                    {min}
                </Box>

                {/* Separator */}
                <Box fontSize="12px" fontWeight={500} color="black" lineHeight="1">-</Box>

                {/* Max Value */}
                <Box
                    {...boxStyle}

                    px={2}
                    py="1px"
                    fontSize="12px"
                    fontWeight={500}
                    border="1px solid"
                    borderRadius="4px"
                    w="fit-content"
                    lineHeight="2"
                    display="inline-flex"
                    alignItems="center"
                >
                    {max}
                </Box>

                {/* Currency */}
                <Box fontSize="12px" fontWeight={500} color="black" lineHeight="1">INR</Box>
            </Button>

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader color={'#757576'}>Quick Edit</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Box mb={4}>Select the amount you want to trade.</Box>
                            <FormLabel>Minimum</FormLabel>
                            <Input ref={initialRef} defaultValue={min} onChange={(e) => setMinimum(e.target.value)} />
                            <Flex alignItems={'center'} mt={1} gap={3}><AiOutlineExclamationCircle /> Minimum must be at least {min} INR.</Flex>
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Maximum</FormLabel>
                            <Input defaultValue={max} onChange={(e) => setMaximum(e.target.value)} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant={'outline'} color={'#757576'} onClick={onClose} mr={3}>
                            Close
                        </Button>
                        <Button colorScheme="orange" variant={'outline'} onClick={updateCryptoMinMax} >Apply</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

const Changemargin = ({ margin, id }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [marginValue, setMarginValue] = useState(margin);
    const { handleUpdateCryptoAd, handleGetMyOffer } = useOffer();
    const toast = useToast();


    const initialRef = useRef(null);
    const finalRef = useRef(null);
    const updateCryptoOfferMargin = async () => {
        const req = new CryptoUpdateRequest();
        const req1 = new MyOfferRequest();
        req.cryptoAd_id = id;
        req.offer_margin = Number(marginValue) || Number(margin);
        const res = await handleUpdateCryptoAd(req);
        req1.txn_type = '';
        handleGetMyOffer(req1);

        if (res?.data?.status === true) {
            onClose();

            toast({
                title: "Success",
                description: res?.data?.message,
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "bottom",
            })
        }
    }

    return (
        <>
            <Button onClick={onOpen} size={'xs'}>+{margin}</Button>

            {/* </Button> */}



            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader color={'#757576'}>Change Margin</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody >
                        <FormControl>
                            <Input defaultValue={margin} onChange={(e) => setMarginValue(e.target.value)} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant={'outline'} color={'#757576'} onClick={onClose} mr={3}>
                            Close
                        </Button>
                        <Button colorScheme="orange" variant={'outline'} onClick={updateCryptoOfferMargin}>Apply</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
const MobileActiveOffer = ({ isloading }) => {
    const { runningOffers } = useTradeProvider();
    const spinnerColor = useColorModeValue('whiteAlpha.800', 'gray.500');
    const bgColor_1 = useColorModeValue('gray.50', 'gray.700');
    const navigate = useNavigate()
    return (
        <Flex direction="column" gap={2}>
            {isloading ? (
                <Flex
                    w="100%"
                    h="100%"
                    bg={spinnerColor}
                    justify="center"
                    align="center"
                    display={{ base: 'flex', md: 'none' }}
                >
                    <CircularProgress isIndeterminate color="orange.500" size="60px" />
                </Flex>
            ) : (
                runningOffers?.data?.map((item, index) => (
                    <Flex
                        key={index}
                        direction="column"
                        gap={1}
                        bg={bgColor_1}
                        p={3}
                        w="100%"
                        border="1px solid #dcdcdc"
                        fontWeight={500}
                        display={{ base: 'flex', md: 'none' }}
                        borderRadius={5}
                    >
                        {/* Top Row: Partner & Status */}
                        <Flex justify="space-between">
                            <Flex direction="column">
                                <Box color="#ad6d29" w="100px">{item?.partner_details?.username}</Box>
                                <Box fontSize="12px">{dayjs(item?.created_at).fromNow()}</Box>
                            </Flex>

                            <Flex direction="column" alignItems="end">
                                <Box color={getStatusColorText(item?.buyer_status)} textAlign="end">{item?.buyer_status}</Box>
                                <Box color="gray">{item?.trade_type}</Box>
                            </Flex>
                        </Flex>

                        {/* Amount Row */}
                        <Flex justify="space-between">
                            <Flex direction="row" gap={1}>
                                <Image boxSize={5} src={crypto_logo[item?.asset]} />
                                <Text fontSize="sm" fontWeight="medium">
                                    {Number(item?.buy_value).toFixed(2)} {shortName[item.asset]}
                                </Text>
                            </Flex>

                            <Flex gap={2} flexWrap="wrap" alignItems="center">
                                <Box fontWeight={600}>{Number(item?.amount).toFixed(2)} INR</Box>

                            </Flex>
                        </Flex>

                        {/* Payment Method & View Button */}
                        <Flex justify="space-between" alignItems="center">
                            <Box>{item?.payment?.payment_method?.payment_method}</Box>
                            <Box
                                color="blue.500"
                                cursor="pointer"
                                fontWeight={600}
                                onClick={() => {
                                    if (item.trade_type === "buy") {
                                        navigate(`/tradeStart/${item.trade_id}/buy_trade`);
                                    } else if (item.trade_type === "sell") {
                                        navigate(`/tradeStart/${item.trade_id}/sell_trade`);
                                    }
                                }}
                            >
                                View
                            </Box>
                        </Flex>
                    </Flex>
                ))
            )}
        </Flex>
    );
};



const TradeList = [
    { trade: "Sell", amount: "2541365.35 INR", method: "PayTm Online wallet", partner: "ranchor das chanchah", started: "12 second ago", status: "Pending", others: "View" },
    { trade: "Sell", amount: "2541365.35 INR", method: "Bank Transfer", partner: "ranchor das chanchah", started: "12 second ago", status: "Disputed", others: "View" },
    { trade: "Sell", amount: "2541365.35 INR", method: "Phone Pay", partner: "ranchor das chanchah", started: "12 second ago", status: "Active", others: "View" },
]

const cryptoOption = [
    { shrotName: 'BTC', name: 'bitcoin', logo: 'https://cryptologos.cc/logos/thumbs/bitcoin.png?v=040', pricePerCoin: '1 BTC = 8,448,496.2999 INR', blc: 0, INR: '0.00', table: 'true' },
    { shrotName: 'ETH', name: 'ethereum', logo: 'https://cryptologos.cc/logos/thumbs/ethereum.png?v=040', pricePerCoin: '1 ETH = 8,448,496.2999 INR', blc: 0, INR: '0.00' },
    { shrotName: 'BNB', name: 'binance', logo: 'https://cryptologos.cc/logos/thumbs/usd-coin.png?v=040', pricePerCoin: '1 USDC = 8,448,496.2999 INR', blc: 0, INR: '0.00' },
    { shrotName: 'USDT', name: 'tether', logo: 'https://cryptologos.cc/logos/thumbs/tether.png?v=040', pricePerCoin: '1 USDT = 8,448,496.2999 INR', blc: 0, INR: '0.00' },
]
 export const crypto_logo = {
    'bitcoin': '/imagelogo/bitcoin-btc-logo.png',
    'ethereum': '/imagelogo/ethereum-eth-logo.png',
    'binance': '/imagelogo/bnb-bnb-logo.png',
    'tether': '/imagelogo/tether-usdt-logo.png',
}
const shortName = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'binance': 'BNB',
    'tether': 'USDT',
}
export const queryParams = {
    txn_type: '',
    is_active: '',
    cryptocurrency: '',
    per_page: 10
};
export default MyOffers;
