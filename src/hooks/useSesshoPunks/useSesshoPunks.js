import { useMemo } from "react"
import { useWeb3React } from "@web3-react/core"
import SesshoPunksArtifact from "./artifacts/SesshoPunksArtifact";

const {address, abi} = SesshoPunksArtifact;

const useSesshoPunks = () =>{
    const {active, library, chainId} = useWeb3React();
    const sesshoPunks = useMemo( ()=> {
    if (active) {
            return new library.eth.Contract(abi,address[chainId]);
    }
    },[active, chainId, library?.eth?.Contract]);
    
    return sesshoPunks;
}

export default useSesshoPunks;