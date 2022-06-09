import { useCallback, useEffect, useState } from "react";
import useSesshoPunks from "../useSesshoPunks/useSesshoPunks";

const getPunkData = async (sesshoPunks, tokenId) =>{
    console.log('que fue mano xD'+tokenId);
    const [ tokenURI,
            dna,
            owner,
            accessoriesType,
            clotheColor,
            clotheType,
            eyeType,
            eyeBrowType,
            facialHairColor,
            facialHairType,
            hairColor,
            hatColor,
            graphicType,
            mouthType,
            skinColor,
            topType,
      ] = await Promise.all([   sesshoPunks.methods.tokenURI(tokenId).call(),
                                sesshoPunks.methods.tokenDNA(tokenId).call(),
                                sesshoPunks.methods.ownerOf(tokenId).call(),
                                sesshoPunks.methods.getAccesoriesType(tokenId).call(),
                                sesshoPunks.methods.getClotheColor(tokenId).call(),
                                sesshoPunks.methods.getClotheType(tokenId).call(),
                                sesshoPunks.methods.getEyeType(tokenId).call(),
                                sesshoPunks.methods.getEyeBrowType(tokenId).call(),
                                sesshoPunks.methods.getFacialHairColor(tokenId).call(),
                                sesshoPunks.methods.getFacialHairType(tokenId).call(),
                                sesshoPunks.methods.getHairColor(tokenId).call(),
                                sesshoPunks.methods.getHatColor(tokenId).call(),
                                sesshoPunks.methods.getGraphicType(tokenId).call(),
                                sesshoPunks.methods.getMouthType(tokenId).call(),
                                sesshoPunks.methods.getSkinColor(tokenId).call(),
                                sesshoPunks.methods.getTopType(tokenId).call(),]);
    const responseMetadata = await fetch(tokenURI);
    const metadata = await responseMetadata.json();


  return {  tokenId,
            attributes: {   accessoriesType,
                            clotheColor,
                            clotheType,
                            eyeType,
                            eyeBrowType,
                            facialHairColor,
                            facialHairType,
                            hairColor,
                            hatColor,
                            graphicType,
                            mouthType,
                            skinColor,
                            topType,},
            tokenURI,
            dna,
            owner,
            ...metadata,
        };

}

//singular case
const useSesshoPunkData = (tokenId = null) => {
    const [punk, setPunk] = useState({});
    const [loading, setLoading] = useState(true);
    const sesshoPunks = useSesshoPunks();
   
    const update = useCallback(async ()=>{
        
        if (sesshoPunks && tokenId != null){
            setLoading(true);
            const punk = await getPunkData(sesshoPunks,tokenId);
            setPunk(punk);
            setLoading(false);
        }
    },[sesshoPunks,tokenId]);

    useEffect(()=>{
        update();
    },[update])



    return {loading,punk, update}
}

//plural case
const useSesshoPunksData = () => {
    const [punks, setPunks] = useState([]);
    const [loading, setLoading] = useState(true);
    const sesshoPunks = useSesshoPunks();
   
    const update = useCallback(async ()=>{
        
        if (sesshoPunks){
            setLoading(true);
            let tokenIds;
            const totalSupply = await sesshoPunks.methods.totalSupply().call();
            tokenIds = new Array(parseInt(totalSupply)).fill().map((_,index)=>index);
            const punkPromise = tokenIds.map((tokenId)=> getPunkData(sesshoPunks,tokenId));
            const punks = await Promise.all(punkPromise);
            setPunks(punks);
            setLoading(false);
        }
    },[sesshoPunks]);

    useEffect(()=>{
        update();
    },[update])



    return {loading,punks, update}
}


export {useSesshoPunksData, useSesshoPunkData}