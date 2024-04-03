import { FC, useState } from "react";
import * as web3 from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Box, Button, Center, FormControl, FormLabel, Input, Link, Switch, Textarea } from "@chakra-ui/react";
import { Student } from "@/models/Student";
import { getTransactionCount, setTransactionCount } from "@/redux/transactionSlice";
import { useDispatch, useSelector } from "react-redux";
import { ENDPOINT, STUDENT_PROGRAM_ID, explorer_url } from "@/constants/web3";

export const Form: FC = () => {

  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [toggle, setToggle] = useState(true)
  const [trSignature, setTrSignature] = useState('')
  const transactionCount = useSelector(getTransactionCount);
  const dispatch = useDispatch();

  const onSubmit = (event: any) => {
    event.preventDefault();
    const student = new Student(name, message)
    setTrSignature('')
    handleTansactionSubmit(student)
  }
  const handleTansactionSubmit = async (student: Student) => {
    if (!publicKey) {
      alert('Please connect your wallet!')
      return
    }

    const buffer = student.serialize(toggle ? 0 : 1)
    const transaction = new web3.Transaction()
    const [pda] = web3.PublicKey.findProgramAddressSync(
      [publicKey.toBuffer()],
      new web3.PublicKey(STUDENT_PROGRAM_ID)
    )

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
      setTrSignature(txSig)
      console.log(`Transaction submitted: ${explorer_url(txSig)}`)
      const lastestBlockHash = await connection.getLatestBlockhash()
      const resp = await connection.confirmTransaction({
        blockhash: lastestBlockHash.blockhash,
        lastValidBlockHeight: lastestBlockHash.lastValidBlockHeight,
        signature: txSig
      });
      console.log(`[DAVID] Transaction confirmed! resp = ${JSON.stringify(resp)}`)
      dispatch(setTransactionCount(transactionCount + 1))
    } catch (e) {
      setTrSignature('')
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
        <FormControl display="center" alignItems="center">
          <FormLabel color="gray.100" mt={2}>Update</FormLabel>
          <Switch
            id="update"
            onChange={(event) => setToggle((prevCheck) => !prevCheck)}
          />
        </FormControl>
        <Button type="submit" mt={4} width="full">Submit</Button>
        {
          trSignature !== ''
            ? <Center mt={3} color="green.400">
              <Link href={explorer_url(trSignature)}>
                You can check transaction result on Explorer.
              </Link>
            </Center>
            : null
        }
      </form>
    </Box>
  )
}