import {
  Flex,
  Button,
  Tag,
  TagLabel,
  Badge,
  TagCloseButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import {  UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { connector } from "../../../config/web3";
import { useCallback, useEffect, useState } from "react";


const WalletData = () => {
  const [balance, setBalance] = useState(0);
  const {active, activate, account, deactivate, error, library} = useWeb3React();

  const isUnsupportedChain = error instanceof UnsupportedChainIdError;

  const shortAccount = (accountValue) => {
    return accountValue.slice(0,5)+'....'+accountValue.slice(accountValue.length-4,accountValue.length);
  }

  const connect =   useCallback(() => {
                      activate(connector);
                      localStorage.setItem('previuslyConnected', 'true');
                    },[activate])

  const disconnect = () => {
    deactivate();
    localStorage.removeItem('previuslyConnected');
  }

  useEffect(()=>{
    if (localStorage.getItem('previuslyConnected') === 'true'){
      connect();
    } 
  },[connect])

  const getBalance = useCallback( async ()=>{
      const balanceValue = await library.eth.getBalance(account);
      setBalance((balanceValue/10e17).toFixed(2));
  },[library?.eth, account])


  useEffect(()=>{
    if (active) getBalance();
  },[active])

  return (
    <Flex alignItems={"center"}>
      {active ? (
        <Tag colorScheme="green" borderRadius="full">
          <TagLabel>
            <Link to="/Punks">{shortAccount(account)}</Link>
          </TagLabel>
          <Badge
            d={{
              base: "none",
              md: "block",
            }}
            variant="solid"
            fontSize="0.8rem"
            ml={1}
          >
            ~{balance} Ξ
          </Badge>
          <TagCloseButton onClick={disconnect} />
        </Tag>
      ) : (
        <Button
          variant={"solid"}
          colorScheme={"green"}
          size={"sm"}
          leftIcon={<AddIcon />}
          onClick={connect}
          disabled={isUnsupportedChain}
        >
          {isUnsupportedChain ? "Red no soportada" : "Conectar wallet"}
        </Button>
      )}
    </Flex>
  );
};

export default WalletData;
