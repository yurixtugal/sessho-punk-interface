import { useWeb3React } from "@web3-react/core";
import PunkCard from "../../components/punk-card"; 
import Loading from "../../components/loading";
import RequestAccess from "../../components/request-access";
import { useSesshoPunksData } from "../../hooks/useSesshoPunksData";
import { Grid, InputGroup, InputLeftElement, Input, InputRightElement, Button, FormHelperText, FormControl} from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";

 


const Punks = () => {
   const { search } = useLocation();
   const {active, library} = useWeb3React();
   const [submitted, setSubmitted] = useState(true); 
   const [validAddress, setValidAddress] = useState(true);
   const [address,setAddress] = useState(new URLSearchParams(search).get("address"));
   const {punks,loading} = useSesshoPunksData({owner: submitted && validAddress ? address : null,});
   let navigate = useNavigate();
   const handleAddressChange = ({target: {value}}) =>{
      setAddress(value);
      setSubmitted(false);
      setValidAddress(false);
   }
   
   const submit = (event) =>{
      event.preventDefault();
      if (address){
         const isValid = library.utils.isAddress(address);
         setValidAddress(isValid);
         setSubmitted(true);
         if (isValid) navigate(`/punks?address=${address}`);
      }else{
         navigate("punks")
      }

   }

   if (!active) return <RequestAccess/>
   
    return (
       <>
         <form  onSubmit={submit}>
        <FormControl >
          <InputGroup mb={3}>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              isInvalid={false}
              onChange={handleAddressChange}
              placeholder="Buscar por dirección"
            />
            <InputRightElement width="5.5rem">
              <Button type="submit" h="1.75rem" size="sm">
                Buscar
              </Button>
            </InputRightElement>
          </InputGroup>
          { submitted && !validAddress && <FormHelperText>Dirección inválida</FormHelperText>}
            
          
        </FormControl>
      </form>
       {
          loading?(<Loading/>):(
            <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
               {punks.map(({name,image,tokenId})=>(
                  <Link  key={tokenId} to={`/Punks/${tokenId}`} ><PunkCard image={image} name={name}/></Link>))
               }
            </Grid>
          )
        }
       </>
    )
}

export default Punks;