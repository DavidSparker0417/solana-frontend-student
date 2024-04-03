import { FC, useEffect, useState } from "react";
import { Card } from "./Card";
import { Student } from "@/models/Student";
import { useConnection } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js"
import { StudentCoordinator } from "@/Coordinator/StudentCoordinator";
import { Button, Center, HStack, Input, Spacer } from "@chakra-ui/react";
import { getTransactionCount } from "@/redux/transactionSlice";
import { useSelector } from "react-redux";

export const StudentList: FC = () => {
  const [students, setStudents] = useState<Student[]>([])
  const { connection } = useConnection()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const transactionCount = useSelector(getTransactionCount);

  useEffect(() => {
    StudentCoordinator.fetchPage(connection, page, 10, search, search !== '')
      .then(students => setStudents(students))
  }, [search, page, transactionCount])

  return (
    <div>
      <Center>
        <Input 
          w = '97%'
          color="gray.400"
          placeholder="Search"
          my={2}
          onChange={event => setSearch(event.currentTarget.value)}
        />
      </Center>
      {
        students?.map((student, i) => <Card key={i} student={student} />)
      }
      <Center>
        <HStack w="full" mt={2} mb={8} mx={4}>
          {
            page > 1 && <Button onClick={() => setPage(page - 1)}>Prev</Button>
          }
          <Spacer />
          {
            page * 5 < StudentCoordinator.accounts.length &&
            <Button onClick={() => setPage(page + 1)}>Next</Button>
          }
        </HStack>
      </Center>
    </div>
  )
}