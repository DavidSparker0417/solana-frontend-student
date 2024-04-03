use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum StudentError {
    #[error("Input data exceeds max length")]
    InvalidDataLength,
    #[error("Invalid PDA")]
    InvalidPDA,
    #[error("Account is not initialized yet")]
    UnAuthorizedAccount,
}

impl From<StudentError> for ProgramError {
    fn from(e: StudentError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
