use borsh::BorshDeserialize;
use solana_program::program_error::ProgramError;
#[derive(BorshDeserialize)]

struct StudentIntroPayload {
    name: String,
    message: String,
}
pub enum StudentIntro {
    AddIntro { name: String, message: String },
}

impl StudentIntro {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (variant, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;
        let payload = StudentIntroPayload::try_from_slice(rest).unwrap();
        Ok(match variant {
            0 => Self::AddIntro {
                name: payload.name,
                message: payload.message,
            },
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
}
