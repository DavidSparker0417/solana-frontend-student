
type Cluster = 'devnet' | 'testnet' | 'mainnet-beta';

export const ENDPOINT: Cluster = 'testnet'
export const STUDENT_PROGRAM_ID = "2VtawH2hxo1x2rExrAw76oP9qvgS6gMZq5WRK6HaXU1d"

export function explorer_url(signature:string) {
  return `https://explorer.solana.com/tx/${signature}?cluster=${ENDPOINT}`
}