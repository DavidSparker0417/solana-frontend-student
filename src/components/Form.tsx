import { FC, useState } from "react";
import * as web3 from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Box, Button, FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { Student } from "@/models/Student";

const STUDENT_PROGRAM_ID = "HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf"
export const Form: FC = () => {

  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const onSubmit = (event: any) => {
    event.preventDefault();
    const student = new Student(name, message)
    handleTansactionSubmit(student)
  }
  const handleTansactionSubmit = async (student: Student) => {
    if (!publicKey) {
      alert('Please connect your wallet!')
      return
    }

    const buffer = student.serialize()
    const transaction = new web3.Transaction()
    const [pda] = web3.PublicKey.findProgramAddressSync(
      [publicKey.toBuffer()],
      new web3.PublicKey(STUDENT_PROGRAM_ID)
    )

    console.log(`student = ${JSON.stringify(student)}`)
    const instruction = new web3.TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true
        },
        {
          pubkey: web3.SystemProgram.programId,
          isSigner: false,
          isWritable: false
        }
      ],
      data: buffer,
      programId: new web3.PublicKey(STUDENT_PROGRAM_ID)
    })
    transaction.add(instruction)
    try {
      const txSig = await sendTransaction(transaction, connection)
      alert(`Transaction submitted: https://explorer.solana.com/tx/${txSig}?cluster=devnet`)
      console.log(`Transaction submitted: https://explorer.solana.com/tx/${txSig}?cluster=devnet`)
    } catch (e) {
      console.log(JSON.stringify(e))
      alert(JSON.stringify(e))
    }
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
          <Input id='name' color="gray.400" onChange={(event) => setName(event.currentTarget.value)} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel color='gray.200'>
            What brings you to Solana, friend?
          </FormLabel>
          <Textarea
            id='message'
            color="gray.400"
            onChange={(event) => setMessage(event.currentTarget.value)}
          />
        </FormControl>
        <Button type="submit" mt={4} width="full">Submit</Button>
      </form>
    </Box>
  )
}