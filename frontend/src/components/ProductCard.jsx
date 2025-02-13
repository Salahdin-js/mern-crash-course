import {
    Box,
    Button,
    Heading,
    HStack,
    IconButton,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useColorModeValue,
    useDisclosure,
    useToast,
    VStack
  } from "@chakra-ui/react";
  import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
  import { useProductStore } from "../store/product";
  import { useState, useEffect } from "react";
  
  const ProductCard = ({ product }) => {
    // Ensure the product has default values to prevent undefined errors
    const [updatedProduct, setUpdatedProduct] = useState({
      name: product?.name || "",
      price: product?.price || "",
      image: product?.image || "",
      _id: product?._id || ""
    });
    
    const textColor = useColorModeValue("gray.600", "white");
    const bg = useColorModeValue("white", "gray.800");
    
    const { deleteProduct, updateProduct } = useProductStore();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    // Delete Product
    const handleDeleteProduct = async (pid) => {
      const { success, message } = await deleteProduct(pid);
      if (!success) {
        toast({
          title: "Error",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true
        });
      } else {
        toast({
          title: "Success",
          description: message,
          status: "success",
          duration: 3000,
          isClosable: true
        });
      }
    };
  
    // Handle Product Update
    const handleUpdateProduct = async () => {
      // Log the updated product for debugging
      console.log("Updated Product:", updatedProduct);
      
      if (!updatedProduct._id) {
        toast({
          title: "Error",
          description: "Product ID is missing.",
          status: "error",
          duration: 3000,
          isClosable: true
        });
        return;
      }
  
      if (!updatedProduct.name || !updatedProduct.price || !updatedProduct.image) {
        toast({
          title: "Error",
          description: "All fields must be filled.",
          status: "error",
          duration: 3000,
          isClosable: true
        });
        return;
      }
  
      // Update product using the product ID and the updated product data
      try {
        const { success, message } = await updateProduct(updatedProduct._id, updatedProduct);
        if (!success) {
          toast({
            title: "Error",
            description: message,
            status: "error",
            duration: 3000,
            isClosable: true
          });
        } else {
          toast({
            title: "Product Updated",
            description: message,
            status: "success",
            duration: 3000,
            isClosable: true
          });
          onClose(); // Close modal on success
        }
      } catch (error) {
        console.error("Update error: ", error);
        toast({
          title: "Error",
          description: "An error occurred while updating the product.",
          status: "error",
          duration: 3000,
          isClosable: true
        });
      }
    };
  
    // Log the product whenever it is loaded/updated (for debugging purposes)
    useEffect(() => {
      console.log("Product loaded:", product);
    }, [product]);
  
    return (
      <Box
        shadow={"lg"}
        rounded={"lg"}
        overflow={"hidden"}
        transition={"all 0.3s"}
        _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
        bg={bg}
      >
        <Image src={product.image} alt={product.name} h={48} w="full" objectFit={"cover"} />
    
        <Box padding={5}>
          <Heading as="h3" size="md" mb={2}>
            {product.name}
          </Heading>
    
          <Text fontWeight={"bold"} fontSize={"xl"} color={textColor} mb={4}>
            ${product.price}
          </Text>
    
          <HStack spacing={2}>
            <IconButton icon={<EditIcon />} onClick={onOpen} colorScheme="blue" />
            <IconButton
              icon={<DeleteIcon />}
              onClick={() => handleDeleteProduct(product._id)}
              colorScheme="red"
            />
          </HStack>
        </Box>
    
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
    
          <ModalContent>
            <ModalHeader>Update Product</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Input
                  name="name"
                  value={updatedProduct.name}
                  placeholder="Product Name"
                  onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
                />
                <Input
                  name="price"
                  type="number"
                  value={updatedProduct.price}
                  placeholder="Price"
                  onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}
                />
                <Input
                  name="image"
                  value={updatedProduct.image}
                  placeholder="Image URL"
                  onChange={(e) => setUpdatedProduct({ ...updatedProduct, image: e.target.value })}
                />
              </VStack>
            </ModalBody>
    
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleUpdateProduct}>
                Update
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    );
  };
  
  export default ProductCard;  