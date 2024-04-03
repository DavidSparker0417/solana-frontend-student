import * as borsh from "@coral-xyz/borsh"

export class Student {
  name: string
  message: string

  constructor(name: string, message: string) {
    this.name = name
    this.message = message
  }

  static mocks: Student[] = [
    new Student('Elizabeth Holmes', `Learning Solana so I can use it to build sick NFT projects.`),
    new Student('Jack Nicholson', `I want to overhaul the world's financial system. Lower friction payments/transfer, lower fees, faster payouts, better collateralization for loans, etc.`),
    new Student('Terminator', `i'm basically here to protect`),
  ]

  borshInstructionSchema = borsh.struct([
    borsh.u8('variant'),
    borsh.str('name'),
    borsh.str('message')
  ])

  static borshAccountSchema = borsh.struct([
    borsh.bool('initialized'),
    borsh.str('name'),
    borsh.str('message')
  ])

  serialize(variant:number): Buffer {
    const buffer = Buffer.alloc(1000)
    this.borshInstructionSchema.encode({ ...this, variant }, buffer)
    return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
  }

  static deserialize(buffer: Buffer | undefined): Student | null {
    if (!buffer) {
      return null
    }

    try {
      const { name, message } = this.borshAccountSchema.decode(buffer)
      return new Student(name, message)
    } catch (e) {
      console.log('Deserialization error: ', e)
      console.log(buffer)
      return null
    }
  }
}