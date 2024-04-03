use solana_program::{
  account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey,
};
pub mod instruction;
use instruction::StudentIntro;

entrypoint!(process_instruction);

pub fn process_instruction(
  program_id: &Pubkey,
  accounts: &[AccountInfo],
  data: &[u8],
) -> ProgramResult {
  let instruction = StudentIntro::unpack(data)?;
  match instruction {
      StudentIntro::AddIntro { name, message } => {
          add_student_intro(program_id, accounts, name, message)
      }
  }
}

pub fn add_student_intro(
  program_id: &Pubkey,
  accounts: &[AccountInfo],
  name: String,
  message: String,
) -> ProgramResult {
  msg!("Adding student introduction...");
  msg!("Name: {}", name);
  msg!("Message: {}", message);
  Ok(())
}
