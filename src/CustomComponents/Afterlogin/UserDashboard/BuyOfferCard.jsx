import {
  Box, Flex, Text, Input, InputGroup, InputRightAddon, Alert, AlertIcon, Link, Grid, GridItem,
  Heading, Avatar, Badge, List, ListItem, Button, Divider,
  ButtonGroup,
  Collapse,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Tag,
  AvatarBadge,
  Spinner
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaCheck } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useOffer } from "../../../Context/OfferContext";
import { motion } from "framer-motion";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { BiDislike, BiLike } from "react-icons/bi";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { AssetNameMap, FeedbackUser, OfferTerms, timeAgo } from "../../Buy&Sell/BuyOffer";
import { MdCheck, MdStarOutline } from "react-icons/md";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { useUser } from "../../../Context/userContext";

export default function BuyOfferCard() {
  const location = useLocation();
  const data = location.state?.data;
  const { user } = useUser();
  const navigate = useNavigate()

  console.log("Viewdata",data)

  return (
    <Flex
      direction="column"
      py={10}
      px={4}
      align="center"
      marginTop={'74px'}
      w="100%"
    >
      {/* Card */}
      <Box
        bg="white"
        maxW="1200px"
        w="100%"
        rounded="md"
        shadow="md"
        p={8}
        mb={10}
        mx="auto"
      >
        <Text fontSize="lg" fontWeight="semibold" mb={6}>
          How much do you want to Buy?
        </Text>

        {/* Input Row */}
        <Flex
          gap={4}
          mb={6}
          flexWrap="wrap"
          direction={{ base: "column", md: "row" }}
        >
          <InputGroup flex="1">
            <Input placeholder="Enter amount" disabled value={data?.min_trade_limit} />
            <InputRightAddon children="INR" />
          </InputGroup>

          <InputGroup flex="1">
            <Input placeholder="0.00" isReadOnly disabled />
            <InputRightAddon children={AssetNameMap[data?.cryptocurrency]}
/>
          </InputGroup>
        </Flex>

        <Text fontSize="sm" color="gray.500" mb={4}>
          Enter amount to get started
        </Text>

        <Alert status="warning" mb={3}>
          <AlertIcon />
          <Flex
            direction={{ base: "column", sm: "row" }}
            flexWrap="wrap"
            align="center"
            gap={1}
            w="100%"
          >
            <Text wordBreak="break-word">
              Oops! You can’t start a trade on your own offer.
            </Text>

          </Flex>
        </Alert>

        <Alert status="error">
          <AlertIcon />
          <Text wordBreak="break-word">
            Offer is not active anymore. Please browse other offers for Bank Transfer.
          </Text>
        </Alert>
      </Box>

      {/* Info Grid */}
      <Grid
        templateColumns={{ base: '1fr', xl: '1fr 1fr' }}
        gap={5}
        w="100%"
        maxW="1200px"
        mx="auto"
      >
        {/* About this offer */}
        <Flex direction={'column'} gap={4} w={'full'}>
          <Heading size={'md'}>
            About this offer
          </Heading>
          <Flex border={'1px solid #ffedd5'} boxShadow={'lg'} direction={'column'} bg={'white'} borderRadius={4} >
            <Flex direction={'column'} w={'full'} p={4} >
              <Flex alignItems={'center'} gap={2} color={'#757576'} >

                Seller rate
                <MdStarOutline />
              </Flex>
              <Box fontSize={'18px'} fontWeight={700}>8,078,400.587 INR <Box as='span' color={'gray'}>•12% above market</Box> </Box>
            </Flex>

            <Flex direction={'column'} w={'full'} bg={'orange.50'} p={4}>
              <Flex alignItems={'center'} gap={2} color={'#757576'}>

                Buy limits
                <MdStarOutline />
              </Flex>
              <Box fontSize={'18px'} fontWeight={700}><Box as='span' color={'gray'}>Min</Box>{data?.min_trade_limit}- <Box as='span' color={'gray'}>Max</Box>  {data?.max_trade_limit} </Box>
            </Flex>

            <Flex>

              <Flex direction={'column'} p={4} >
                <Flex alignItems={'center'} gap={2} color={'#757576'}>

                  Trade time limit
                  <AiOutlineQuestionCircle />
                </Flex>
                <Box fontSize={'18px'} fontWeight={700}>{data?.offer_time_limit} min</Box>
              </Flex>
              <Flex direction={'column'} p={4} >
                <Flex alignItems={'center'} gap={2} color={'#757576'}>

                  Cryptico fee
                  <AiOutlineQuestionCircle />
                </Flex>
                <Box fontSize={'18px'} fontWeight={700}> {data?.offer_margin}</Box>
              </Flex>

            </Flex>


          </Flex>
        </Flex>


        {/* About this seller */}
        <Flex direction={'column'} gap={4} w={'full'}>
          <Heading size={'md'}>
            About this seller
          </Heading>
          <Flex border={'1px solid #ffedd5'} boxShadow={'lg'} direction={'column'} bg={'white'} borderRadius={4}>
            <Flex w={'full'} p={4} gap={4} >
              <Flex alignItems={'center'} gap={2}>

                {
                  user ?
                    <Avatar border={'1px solid #dcdcdc'} name={user?.name ? user?.name : user?.email} src={user?.profile_image_url || undefined} size={'md'}>
                      <AvatarBadge boxSize='1em' bg={user?.login_status === 'login' ? 'green.200' : 'orange.200'} ></AvatarBadge>
                    </Avatar>
                    :
                    <Spinner size={'xl'} />
                }


              </Flex>
              <Flex direction={'column'}>

                <Flex onClick={() => navigate(`/trade-partner-profile/${user?.user_id}`)}
                  alignItems={'center'} cursor={'pointer'} gap={2}>{user?.username} <LuSquareArrowOutUpRight /></Flex>
                <Flex gap={2} flexWrap={'wrap'} justifyContent={'space-between'}>
                  {
                    user?.login_status === 'login' ?
                      <Box fontWeight={500} fontSize={'16px'} color={'green'}>{user?.last_seen_at}</Box>
                      :
                      <Box color={'gray'}>{timeAgo(user?.last_login)}</Box>
                  }
                  <Box px={2} bg={'orange.300'} w={'60px'} borderRadius={5} fontSize={'14px'}>badge</Box>
                </Flex>
              </Flex>
            </Flex>


            <Flex bg={'orange.50'}>

              <Flex direction={'column'} p={4} >
                <Heading size={'sm'} fontWeight={400} color={'#757576'}>Negative Feedback</Heading>
                <Flex alignItems={'center'} gap={2}>

                  <BiDislike color='red' />
                  45
                </Flex>
              </Flex>
              <Flex direction={'column'} p={4} >
                <Heading fontWeight={400} size={'sm'} color={'#757576'}>Negative Feedback</Heading>
                <Flex alignItems={'center'} gap={2}>
                  <BiLike color='green' />
                  45
                </Flex>
              </Flex>

            </Flex>


            <Flex>

              <Flex direction={'column'} p={4} >
                <Flex alignItems={'center'} fontWeight={500} gap={1} color={user?.id_verified ? 'green.500' : 'red.500'}><MdCheck /> ID Verified</Flex>
                <Flex alignItems={'center'} fontWeight={500} gap={1} color={user?.email_verified ? 'green.500' : 'red.500'}> <MdCheck />Email Verified</Flex>
              </Flex>
              <Flex direction={'column'} p={4} >
                <Flex alignItems={'center'} fontWeight={500} gap={1} color={user?.address_verified_at ? 'green' : 'red.500'}><MdCheck /> Address Verified</Flex>
                <Flex alignItems={'center'} fontWeight={500} gap={1} color={user?.number_verified_at ? 'green.500' : 'red.500'}> <MdCheck />Phone Verified</Flex>

              </Flex>

            </Flex>

            <Flex direction={'column'} w={'full'} bg={'orange.50'} p={4}>
              <Flex alignItems={'center'} gap={2} color={'#757576'}>

                Average trade speed
                <AiOutlineQuestionCircle />
              </Flex>
              <Box fontSize={'18px'} fontWeight={700}>2 min </Box>
            </Flex>

          </Flex>
        </Flex>

      </Grid>

      {/* Offer terms */}
      <Box mt={10} borderRadius="md" p={4} maxW="1200px" w="100%" mx="auto">
        <OfferTerms data={data} />
      </Box>
      {/* Feedback section */}
      <Box borderRadius="md" maxW="1200px" w="100%" mx="auto">

        <FeedbackUser />
      </Box>

      {/* <Box
      mt={10}
      borderWidth={1}
      borderRadius="lg"
      p={6}
      maxW="1200px"
      w="100%"
      mx="auto"
      bg="white"
      shadow="md"
    >
     <Flex
        justify="space-between"
        align="center"
        mb={4}
        cursor="pointer"
        onClick={() => setShowFeedback(!showFeedback)}
      >
        <Heading size="md">Feedback on this offer</Heading>
            <ButtonGroup size="sm" isAttached variant="outline">
      <Button
        onClick={() => setFilter("All")}
        colorScheme={filter === "All" ? "blue" : "gray"}
      >
        All ({feedbacks.length})
      </Button>
      <Button
        onClick={() => setFilter("Positive")}
        colorScheme={filter === "Positive" ? "green" : "gray"}
      >
        Positive ({feedbacks.filter(f => f.status === "Positive").length})
      </Button>
      <Button
        onClick={() => setFilter("Negative")}
        colorScheme={filter === "Negative" ? "red" : "gray"}
      >
        Negative ({feedbacks.filter(f => f.status === "Negative").length})
      </Button>
     <Box display="flex" justifyContent="center" alignItems="center" p={2}>
  {showFeedback ? (
    <ChevronUpIcon boxSize={6} />
  ) : (
    <ChevronDownIcon boxSize={6} />
  )}
</Box>

    </ButtonGroup>
      
      </Flex>

      <Collapse in={showFeedback} animateOpacity>
      
        <Divider mb={6} />

        {filteredFeedbacks.length > 0 ? (
          filteredFeedbacks.map((fb, idx) => (
            <MotionBox
              key={idx}
              borderWidth={1}
              borderRadius="md"
              p={4}
              mb={4}
              _hover={{ shadow: "sm", borderColor: "blue.100" }}
              transition="all 0.2s"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Flex
                direction={{ base: "column", md: "row" }}
                align={{ base: "flex-start", md: "center" }}
                gap={3}
                mb={3}
              >
                <Flex align="center">
                  <Avatar src={fb.avatar} name={fb.user} size="sm" />
                  <Box ml={3}>
                    <Text fontWeight="semibold">{fb.user}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {fb.date}
                    </Text>
                  </Box>
                </Flex>

                <Flex ml={{ base: 0, md: "auto" }} gap={2} align="center">
                  <Badge>{fb.payment}</Badge>
                  <Badge colorScheme="orange">{fb.amount}</Badge>
                </Flex>
              </Flex>

              <Text fontSize="sm" mb={3} color="gray.700">
                {fb.feedback}
              </Text>

              <Button
                size="sm"
                colorScheme={fb.status === "Positive" ? "green" : "red"}
                leftIcon={
                  fb.status === "Positive" ? <FaThumbsUp /> : <FaThumbsDown />
                }
              >
                {fb.status}
              </Button>
            </MotionBox>
          ))
        ) : (
          <Text textAlign="center" color="gray.500" fontSize="sm">
            No feedbacks available
          </Text>
        )}
      </Collapse>
    </Box> */}

    </Flex>

  );

}
