import {
    Stack,
    Flex,
    Heading,
    Text,
    Button,
    Image,
    Badge,
    useToast,
  } from "@chakra-ui/react";
  import { Link } from "react-router-dom";
  import { useWeb3React } from "@web3-react/core";
  import useSesshoPunks from "../../hooks/useSesshoPunks/useSesshoPunks";
  import { useCallback, useEffect, useState } from "react";

  
  const Home = () => {
    const [isMinting, setIsMinting] = useState(false);
    const [srcImagen, setSrcImagen] = useState("");
    const [nextSupply, setNextSupply] = useState("");
    const [leftSupply, setLeftSupply] = useState("");
    const { active, account } = useWeb3React();
    const sesshoPunks = useSesshoPunks();
    const toast = useToast();

    const getSesshoPunksData = useCallback( async () =>{
        if (sesshoPunks){
            const maxSupply = await sesshoPunks.methods.maxSupply().call();
            const totalSupply = await sesshoPunks.methods.totalSupply().call();
            const dnaPreview = await sesshoPunks.methods.deterministicPseudoRandomDNA(totalSupply,account).call();
            const image = await sesshoPunks.methods.getImageByDNA(dnaPreview).call();
            const leftSupply = maxSupply - totalSupply;
            setSrcImagen(image);
            setLeftSupply(leftSupply);
            setNextSupply(totalSupply);
           
        }
    },[sesshoPunks,account,nextSupply]);

    useEffect(()=>{
        getSesshoPunksData();
    },[getSesshoPunksData]);

    const mint =  () =>{
        setIsMinting(true);
        sesshoPunks.methods.mint().send({
            from: account,
        })
        .on("transactionHash", (txHash) =>{
            toast({
                title:'Transacción enviada',
                description:txHash,
                status: 'info'
            });
        })
        .on("receipt",() =>{
            toast({
                title:'Transacción confirmada',
                description:'description',
                status: 'success'
            });
            setIsMinting(false);
            getSesshoPunksData();
        })
        .on("error",(error) =>{
            toast({
                title:'Transacción erronea',
                description:error.message,
                status: 'error'
            });
            setIsMinting(false);
        })
        
        
    }



    return (
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: "column-reverse", md: "row" }}
      >
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
          >
            <Text
              as={"span"}
              position={"relative"}
              _after={{
                content: "''",
                width: "full",
                height: "30%",
                position: "absolute",
                bottom: 1,
                left: 0,
                bg: "green.400",
                zIndex: -1,
              }}
            >
              Un Sessho Punk
            </Text>
            <br />
            <Text as={"span"} color={"green.400"}>
              for developers
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Sessho Punks es una colección de Avatares randomizados cuya metadata
            es almacenada on-chain. Poseen características únicas y sólo hay 10000
            en existencia.
          </Text>
          <Text color={"green.500"}>
            Cada Sessho Punk se genera de forma secuencial basado en tu address,
            usa el previsualizador para averiguar cuál sería tu Sessho Punk si
            minteas en este momento
          </Text>
          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={{ base: "column", sm: "row" }}
          >
            <Button
              rounded={"full"}
              size={"lg"}
              fontWeight={"normal"}
              px={6}
              colorScheme={"green"}
              bg={"green.400"}
              _hover={{ bg: "green.500" }}
              disabled={!sesshoPunks}
              onClick={mint}
              isLoading={isMinting}
            >
              Obtén tu punk 
            </Button>
            <Link to="/Punks">
              <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
                Galería
              </Button>
            </Link>
          </Stack>
        </Stack>
        <Flex
          flex={1}
          direction="column"
          justify={"center"}
          align={"center"}
          position={"relative"}
          w={"full"}
        >
          <Image src={active ? srcImagen : "https://avataaars.io/"} />
          {active ? (
            <>
              <Flex mt={2}>
                <Badge>
                  Next ID: {nextSupply}
                  <Badge ml={1} colorScheme="green">
                    
                  </Badge>
                </Badge>
                <Badge>
                  Left ID: {leftSupply}
                  <Badge ml={1} colorScheme="green">
                    
                  </Badge>
                </Badge>
                <Badge ml={2}>
                  Address:
                  <Badge ml={1} colorScheme="green">
                    {account.slice(0,5)+'....'+account.slice(account.length-4,account.length)}
                  </Badge>
                </Badge>
              </Flex>
              <Button
                onClick={getSesshoPunksData}
                mt={4}
                size="xs"
                colorScheme="green"
              >
                Actualizar
              </Button>
            </>
          ) : (
            <Badge mt={2}>Wallet desconectado</Badge>
          )}
        </Flex>
      </Stack>
    );
  };
  
  export default Home;