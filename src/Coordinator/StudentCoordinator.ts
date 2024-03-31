import { Student } from "@/models/Student";
import * as web3 from "@solana/web3.js"
import bs58 from "bs58"

const STUDENT_PROGRAM_ID = "HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf"
export class StudentCoordinator {
  static accounts: web3.PublicKey[] = []

  static async prefetchAccounts(connection: web3.Connection, search: string = '') {
    const accounts = await connection.getProgramAccounts(
      new web3.PublicKey(STUDENT_PROGRAM_ID),
      {
        dataSlice: {
          offset: 1,
          length: 18
        },
        filters: search == '' ? [] : [
          {
            memcmp: {
              offset: 5,
              bytes: bs58.encode(Buffer.from(search))
            }
          }
        ]
      }
    )

    accounts.toSorted((a, b) => {
      const lenA = a.account.data.readUint32LE()
      const dataA = a.account.data.slice(4, 4 + lenA);
      const lenB = b.account.data.readUint32LE()
      const dataB = b.account.data.slice(4, 4 + lenB);
      return dataA.compare(dataB)
    })

    this.accounts = accounts.map((account) => account.pubkey)
  }
  static async fetchPage(connection: web3.Connection, page: number, perPage: number, search: string = '', reload: boolean): Promise<Student[]> {
    if (this.accounts.length == 0 || reload)
      await this.prefetchAccounts(connection, search)
    const paginatedAccounts = this.accounts.slice(
      (page - 1) * perPage, page * perPage
    )
    if (paginatedAccounts.length == 0) {
      return []
    }
    const accounts = await connection.getMultipleAccountsInfo(paginatedAccounts)
    const students = accounts.reduce((accum: Student[], account) => {
      const student = Student.deserialize(account?.data)
      if (!student) return accum
      return [...accum, student]
    }, [])

    return students
  }
}