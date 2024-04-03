
type Cluster = 'devnet' | 'testnet' | 'mainnet-beta';

export const ENDPOINT: Cluster = 'testnet'
export const STUDENT_PROGRAM_ID = "6wcP88jAKpGXjxXeY9kiE6aLRtC4R7EX9JoHfvLVBYYd"

export function explorer_url(signature:string) {
  return `https://explorer.solana.com/tx/${signature}?cluster=${ENDPOINT}`
}