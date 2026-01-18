import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Box, Button, Card, Collapse, Divider, Flex, Grid, GridItem, Heading, IconButton, useDisclosure,
  Image, Link, useColorModeValue,
  RadioGroup,
  Radio,
  Stack,
  Text,
  InputGroup,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Avatar,
  InputRightAddon,
  Spinner,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  ModalOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Icon,
  ModalHeader,
  ModalFooter,
  Slider
} from '@chakra-ui/react'
import { FaArrowTrendUp, FaUser } from "react-icons/fa6";
import { HiMiniArrowPath } from "react-icons/hi2";
import { IoBagOutline } from "react-icons/io5";
import { LiaHandPointRightSolid } from "react-icons/lia";
import { MdOutlineFileDownload, MdKeyboardArrowRight, MdKeyboardArrowDown, MdDomainVerification, MdModeEdit, MdUpload } from "react-icons/md";
import { BsLightningCharge } from "react-icons/bs";
import { PiChecks } from "react-icons/pi";
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { Outlet, useNavigate } from 'react-router-dom';
import { AiOutlineBank, AiOutlineSecurityScan } from 'react-icons/ai';
import { CiCircleQuestion } from 'react-icons/ci';
import NumberDropdown from '../Dropdown/NumberDropdown';
import PhoneInputWithCountry from '../Dropdown/NumberDropdown';
import CurrencyDropdown from '../Dropdown/CurrencyDropdown';
import SearchableMultiSelect from '../Dropdown/SearchableMultiSelect';
import LanguageSelectorDropdown from '../Dropdown/LanguageSelectorDropdown';
import { useUser } from '../../Context/userContext';
import { gradientButtonStyle } from '../Wallet/CreateWallet';
import { useDropzone } from "react-dropzone";
import { FaCamera, FaFolderOpen } from 'react-icons/fa';
import Cropper from "react-easy-crop";
import ImageEditor from "@toast-ui/react-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import { useVerification } from '../../Context/VerificationContext';
import TimeZoneDropDown from '../Dropdown/TimeZoneDropdown';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [istoogle, setToogle] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [visibility, setVisibility] = useState("firstName");
  const [isLoading, setIsLoading] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const { user, setUser, handleChangeProfilePic, handleUserNameChange, error } = useUser()
  const [image, setImage] = useState(null);
  const [username, setUserName] = useState('');
  const fileInputRef = useRef(null);
  const [usernameResponse, setUsernameResponse] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [preferred_currency, setSelectedCurrency] = useState('');
  const { handlePreferredCurrencyUpdate, handleBioUpdate } = useVerification();
  const [bio, setBio] = useState("");
  const [isSavingBio, setIsSavingBio] = useState(false);


  const toast = useToast();
  const handleClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const res = await handleChangeProfilePic(selectedFile);
      if (res?.profile_image_url) {
        const updatedUrl = `${res.profile_image_url}?timestamp=${Date.now()}`;
        setUser((prevUser) => ({
          ...prevUser,
          profile_image_url: updatedUrl,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  const handleUsername = async () => {
    try {
      setUsernameLoading(true);
      const res = await handleUserNameChange(username);
      console.log(res);
      if (res?.status === true) {
        setUser((prevUser) => ({ ...prevUser, username: res.username })); // Update state
        setUsernameResponse(
          <Alert status="success" variant="left-accent">
            <AlertIcon />
            <AlertTitle>Username updated successfully</AlertTitle>
          </Alert>
        );
        setTimeout(() => setUsernameResponse(null), 3000);
      }
    }
    catch (error) {
      setUsernameResponse(
        <Alert status="error" variant="left-accent">
          <AlertIcon />
          <AlertTitle>{error?.errors?.username?.[0]}</AlertTitle>
        </Alert>
      );
      setTimeout(() => setUsernameResponse(null), 3000);
    }
    finally {
      setUsernameLoading(false);
    }
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const editorRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  // Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const selected = acceptedFiles[0];
      if (selected) {
        setFile(selected);
        setImageSrc(URL.createObjectURL(selected));
        setStep(2);
      }
    },
  });

  // Cleanup object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (base64Image) => {
    if (!base64Image) return;

    setIsUploading(true); // show loader

    // Base64 → Blob
    const byteString = atob(base64Image.split(',')[1]);
    const mimeString = base64Image.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    const file = new File([blob], "edited-avatar.png", { type: mimeString });

    handleChangeProfilePic(file)
      .then((res) => {
        if (res?.profile_image_url) {
          const updatedUrl = `${res.profile_image_url}?timestamp=${Date.now()}`;
          setUser((prevUser) => ({
            ...prevUser,
            profile_image_url: updatedUrl
          }));
          onClose();
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsUploading(false); // hide loader
      });
  };


  const PreferredCurrencyUpdate = async () => {
    try {
      setIsSaving(true);

      const preferred_currency = "INR";
      const response = await handlePreferredCurrencyUpdate(preferred_currency);

      if (response?.status) {
        toast({
          title: "Success",
          description: response.message || "Currency updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: "Failed",
          description: "Currency update failed!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      console.error("Error updating currency:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating currency.",
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


  const handleUpdateBio = async () => {
    try {
      setIsSavingBio(true);
      const response = await handleBioUpdate(bio);

      if (response?.status) {
        toast({
          title: "Success",
          description: response.message || "Bio updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: "Failed",
          description: "Bio update failed!",
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
        description: "An error occurred while updating bio.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    finally {
      setIsSavingBio(false);
    }
  };




  return (
    <Flex gap={5} direction={'column'} my={5}>
      <Flex gap={10} direction={{ base: 'column-reverse', md: 'row', lg: 'row' }} >
        <Flex flex={1} >
          <Flex direction={'column'} gap={5} w={{ base: '100%', md: '100%', lg: '100%' }}>

            <Flex alignItems={'center'} gap={2}>

              <Heading>
                Account settings

                <Box color={'green.400'} fontSize={'16px'} > &nbsp;ID verified</Box>
              </Heading>
            </Flex>
            <Flex gap={{ base: 0, sm: 2 }} alignItems={'center'} flexWrap={'wrap'}>
              <Box>{user && user.email}</Box>
              <Button size={'sm'} px={0} bg={'transparent'} textDecoration={'underline'}>change email</Button>
            </Flex>
            <Flex>
              <Box p={4} borderWidth={1} borderRadius="lg" w={'full'}>
                <Text fontSize="lg" fontWeight="bold" mb={3}>
                  How would you like others to see your name during trades?
                </Text>
                <RadioGroup onChange={setVisibility} value={visibility}>
                  <Stack spacing={3}>
                    <Radio value="firstName">First name and initial</Radio>
                    <Radio value="fullName">Full name</Radio>
                    <Radio value="hide">Hide full name</Radio>
                  </Stack>
                </RadioGroup>
              </Box>
            </Flex>

            <NumberDropdown />

          </Flex>





        </Flex>


        {/* User_Image & name Section --------------------------------------------------------------------------------------- */}

        <Flex flex={1}>

          <Flex alignItems={'start'} justifyContent={'start'} gap={5} w={'full'} direction={{ base: 'column', xl: 'column' }} >
            <Flex gap={3} flex={.5} alignItems={'start'} direction={{ base: 'column', sm: 'column', md: 'column', xl: 'row' }} w={{ base: '100%', md: '100%', lg: '100%' }}>

              {user ? (
                <Avatar
                  key={user.profile_image_url}
                  border={"1px solid white"}
                  boxSize={"150px"}
                  src={user && user.profile_image_url}
                  cursor="pointer"
                  onClick={onOpen}
                />) : (
                <Spinner size="xl" color="black" />
              )}
              <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                  {step === 1 && (
                    <>
                      <ModalHeader>Upload Profile Image</ModalHeader>
                      <ModalBody>
                        <div
                          {...getRootProps()}
                          style={{
                            border: "2px dashed #ccc",
                            borderRadius: "10px",
                            padding: "40px",
                            textAlign: "center",
                            cursor: "pointer",
                          }}
                        >
                          <input {...getInputProps()} />
                          <p>
                            Drop files here,{" "}
                            <span style={{ color: "blue" }}>browse files</span> or
                            import from My Device / Camera
                          </p>
                        </div>
                      </ModalBody>
                    </>
                  )}
                  {step === 2 && imageSrc && (
                    <>
                      <ImageEditor
                        ref={editorRef}
                        includeUI={{
                          loadImage: {
                            path: imageSrc,
                            name: "avatar",
                          },
                          menu: [
                            "crop",
                            "flip",
                            "rotate",
                            "draw",
                            "shape",
                            "icon",
                            "text",
                            "mask",
                            "filter",
                          ],
                          initMenu: "crop",
                          uiSize: {
                            width: "100%",
                            height: "80vh",
                          },
                          menuBarPosition: "bottom",
                          theme: {
                            'header.display': 'none',
                          },
                        }}
                        cssMaxHeight={500}
                        cssMaxWidth={700}
                        selectionStyle={{
                          cornerSize: 20,
                          rotatingPointOffset: 70,
                        }}
                        usageStatistics={false}
                      />
                      <ModalFooter>
                        <Button onClick={() => setStep(1)}>Back</Button>
                        <Button
                          colorScheme="blue"
                          ml={3}
                          onClick={() => {
                            if (editorRef.current) {
                              const instance = editorRef.current.getInstance();
                              const dataUrl = instance.toDataURL(); // base64 image
                              if (dataUrl) {
                                setEditedImage(dataUrl);
                                setStep(3);
                              } else {
                                console.error("Edited image not generated");
                              }
                            }
                          }}
                        >
                          Save & Preview
                        </Button>
                      </ModalFooter>
                    </>
                  )}

                  {step === 3 && file && (
                    <>
                      <ModalHeader>1 file selected</ModalHeader>
                      <ModalBody style={{ textAlign: "center" }}>
                        <img
                          src={editedImage}
                          alt="preview"
                          style={{ maxWidth: "100%", borderRadius: "10px" }}
                        />
                        <p>{file.name}</p>
                      </ModalBody>
                      <ModalFooter>
                        <Button onClick={() => setStep(1)} isDisabled={isUploading}>
                          Cancel
                        </Button>
                        <Button
                          colorScheme="green"
                          ml={3}
                          onClick={() => handleUpload(editedImage)}
                          isLoading={isUploading}           // <-- loader state
                          loadingText="Uploading..."        // <-- loader text
                        >
                          Upload 1 file
                        </Button>
                      </ModalFooter>

                    </>
                  )}
                </ModalContent>
              </Modal>

              {/* <Avatar size={{ base: 'lg', sm: 'xl' }} alignSelf={'start'} src={user && user.profile_image_url} /> */}
              <Flex direction={'column'} gap={3} alignItems={'start'} justifyContent={'start'} w={'100%'} mt={5}>

                <Button isLoading={isLoading} w={'200px'} sx={gradientButtonStyle} loadingText='uploading..' onClick={handleClick} variant={'outline'} rightIcon={<MdUpload />}>
                  Upload Image
                </Button>
                <Box fontSize={'14px'} >
                  Upload a nice picture, preferably of yourself. If you upload any explicit or otherwise inappropriate image, we’ll remove it immediately.
                </Box>
                <Flex direction={'column'} gap={2} w={'full'}>
                  <Heading size={'md'} color={'orange'}>{user && user.username}</Heading>
                  <Flex justifyContent={'space-between'} alignItems={'center'} border={'1px solid #dcdcdc'} borderRadius={5} >
                    <InputGroup   >

                      <Input placeholder='Change username'
                        isDisabled={user?.username_changed}
                        border={'none'}
                        _hover={{ border: "none" }}
                        _focus={{ boxShadow: "none", border: "none" }}
                        w={'full'}
                        onChange={(e) => {
                          setUserName(e.target.value)
                        }}

                      ></Input>

                      <InputRightAddon border={'none'} px={0} borderRightRadius={4} bg={'transparent'}>
                        <Button mr={1} isLoading={usernameLoading} loadingText='saving...' spinner={null} size={'sm'} isDisabled={user?.username_changed} sx={gradientButtonStyle} bg={'transparent'} w={'full'} _hover={{ bg: 'transparent' }} onClick={handleUsername}>save</Button>
                      </InputRightAddon>

                    </InputGroup>
                  </Flex>
                  {usernameResponse}
                  <Box p={2} bg={useColorModeValue('orange.100', 'gray.500')} borderRadius={5} fontSize={'14px'} fontWeight={'bold'}> you can change your username only once</Box>
                </Flex>
                <Input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Flex>
            </Flex>



          </Flex>
        </Flex>

        {/* User_Image & name Section end--------------------------------------------------------------------------------- */}

      </Flex>



      <Divider />


      <Flex w={{ base: '100%', md: '100%', lg: '100%' }} gap={{ base: 5, md: 10 }} direction={{ base: 'column', md: 'row' }} >
        <Flex direction={'column'} gap={5} flex={1}>
          <Heading size={'sm'}>Prefered Currency</Heading>

          <Flex justifyContent={'space-between'} alignItems={'center'} border={'1px solid #dcdcdc'} borderRadius={5} width={'full'} >


            {
              false &&
              <InputRightElement>
                <Button><MdKeyboardArrowDown /></Button>
              </InputRightElement>
            }
            <CurrencyDropdown onChange={(val) => setSelectedCurrency(val)} width={"100%"} />
          </Flex>
          <Button
            colorScheme="blue"
            onClick={PreferredCurrencyUpdate}
            isLoading={isSaving}
            loadingText="Saving..."
          >
            Save Currency
          </Button>
        </Flex>
        <Flex flex={1}>
          <LanguageSelectorDropdown />

        </Flex>


      </Flex>
      <Flex w={{ base: '100%', md: '100%', lg: '100%' }}>
        <FormControl gap={4}>
          <FormLabel mb={3}>
            <Heading size={'sm'}>Bio</Heading>
          </FormLabel>
          <Textarea
            h="150px"
            placeholder="Your bio appears publicly on your profile"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <Box fontSize={'14px'}>Maximum 3 lines and 180 characters</Box>
        </FormControl>
      </Flex>
      <Button
        colorScheme="blue"
        isLoading={isSavingBio}
        loadingText="Saving..."
        onClick={handleUpdateBio}
      >
        Save Bio
      </Button>


      <Flex flex={1} width={500}>
        <TimeZoneDropDown />

      </Flex>
    </Flex>

  )
}




// const ProfileAvatar = ({ user }) => {
//     useEffect(()=>{

//     },[])
//     return (
//         <>
//             {user ? (
//                 <Avatar border={'1px solid white'} size="xl" src={user && user.profile_image_url} />
//             ) : (
//                 <Spinner size="xl" color="black" />
//             )}
//         </>
//     )
// }

export default ProfilePage
