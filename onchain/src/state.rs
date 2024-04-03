use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_pack::{IsInitialized, Sealed};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct StudentState {
    pub is_initialized: bool,
    pub name: String,
    pub message: String,
}

impl Sealed for StudentState {}

impl IsInitialized for StudentState {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}
