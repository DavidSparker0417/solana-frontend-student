import { Student } from "@/models/Student";
import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { FC } from "react";

export interface CardProps {
  student: Student
}
export const Card: FC<CardProps> = (props) => {
  return (
    <Box
      p={4}
      display={{ md: "flex" }}
      maxWidth="32rem"
      borderWidth={1}
      margin={3}
    >
      <Stack>
        <Text
          color="gray.200"
          fontWeight='bold'
          textTransform="uppercase"
          fontSize="lg"
          letterSpacing="wide"
        >
          {props.student.name}
        </Text>
        <Text color="gray.400">{props.student.message}</Text>
      </Stack>
    </Box>
  )
}