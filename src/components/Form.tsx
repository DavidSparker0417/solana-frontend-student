import { FC } from "react";
import * as web3 from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Box, Button, FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react";

export const Form: FC = () => {

  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const handleTansactionSubmit = async () => {
    if (!publicKey) {
      alert('Please connect your wallet!')
      return
    }
    const transaction = new web3.Transaction()
    // const instruction = new web3.TransactionInstruction({
    //   keys: [
    //     {
    //       pubkey: publicKey,
    //       isSigner: true,
    //       isWritable: false,
    //     },
    //     {
    //       pubkey: pda,
    //       isSigner: false,
    //       isWritable: true
    //     },
    //     {
    //       pubkey: web3.SystemProgram.programId,
    //       isSigner: false,
    //       isWritable: false
    //     }
    //   ] 
    // })
    try {
      const txSig = await sendTransaction(transaction, connection)
      alert(`Transaction submitted: https://explorer.solana.com/tx/${txSig}?cluster=devnet`)
      console.log(`Transaction submitted: https://explorer.solana.com/tx/${txSig}?cluster=devnet`)
    } catch (e) {
      alert(JSON.stringify(e))
    }
  }

  const onSubmit = (event: any) => {
    event.preventDefault();
    handleTansactionSubmit()
  }
  return (
    <Box
      p={4}
      display={{ md: "flex" }}
      maxWidth="32rem"
      borderWidth={1}
      margin={2}
      justifyContent="center"
    >
      <form onSubmit={onSubmit}>
        <FormControl isRequired>
          <FormLabel color='gray.200'>
            What do we call you?
          </FormLabel>
          <Input id='name' color="gray.400"/>
          <FormLabel color='gray.200'>
            What brings you to Solana, friend?
          </FormLabel>
          <Textarea id='message' color="gray.400" />
          <Button type="submit" mt={4} width="full">Submit</Button>
        </FormControl>
      </form>
    </Box>
  )
}