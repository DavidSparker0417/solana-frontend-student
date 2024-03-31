import Image from "next/image";
import { Inter } from "next/font/google";
import { Box, Center, Heading } from "@chakra-ui/react";
import styles from "../styles/Home.module.css"
import Head from "next/head";
import { AppBar } from "@/components/AppBar";
import { Form } from "@/components/Form";
import { StudentList } from "@/components/StudentList";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className={styles.App}>
      <Head>
        <title>Student Intro</title>
      </Head>
      <AppBar />
      <Center>
        <Box>
          <Heading color="white" as="h1" size="l" ml={4} mt={8}>
            Introduce Yourself!
          </Heading>
          <Form />
          <Heading color="white" as="h1" size="l" ml={4} mt={8}>
            Meet the Students!
          </Heading>
          <StudentList />
        </Box>
      </Center>
    </div>
  );
}
