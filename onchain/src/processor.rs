use borsh::BorshSerialize;
use crate::error::StudentError;
use crate::instruction::StudentIntroInstruction;
use crate::state::StudentState;
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    borsh::try_from_slice_unchecked,
    entrypoint::ProgramResult,
    msg,
    program::invoke_signed,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction, system_program,
    sysvar::{rent::Rent, Sysvar},
};

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Unpack instruction data
    let instruction = StudentIntroInstruction::unpack(instruction_data)?;
    match instruction {
        StudentIntroInstruction::AddIntro { name, message } => {
            add_student_intro(program_id, accounts, name, message)
        }
        StudentIntroInstruction::UpdateStudent { name, message } => {
            update_student(program_id, accounts, name, message)
        }
    }
}

pub fn add_student_intro(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    name: String,
    message: String,
) -> ProgramResult {
    // Get accounts
    let account_info_iter = &mut accounts.iter();
    let initializer = next_account_info(account_info_iter)?;
    let pda_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;
    // check if initalizer is signer
    if !initializer.is_signer {
        msg!("Missing Required Signature.");
        return Err(ProgramError::MissingRequiredSignature);
    }
    // Derive PDA
    let (pda, bump_seed) = Pubkey::find_program_address(&[initializer.key.as_ref()], program_id);
    // Check PDA
    if pda != *pda_account.key {
        msg!("Invalid seeds for PDA");
        return Err(ProgramError::InvalidArgument);
    }
    // Create account
    // get space required from passed parameters
    let total_len = 1 + (4 + name.len()) + (4 + message.len());
    // check if required data lenth exceeds maximum
    if total_len > 1000 {
        msg!("Data length is larger than 1000 bytes");
        return Err(StudentError::InvalidDataLength.into());
    }
    // calculate lamports needed in creating pda account
    let account_len: usize = 1000;
    let rent = Rent::get()?;
    let lamports = rent.minimum_balance(account_len);
    invoke_signed(
        &system_instruction::create_account(
            initializer.key,
            pda_account.key,
            lamports,
            account_len.try_into().unwrap(),
            program_id,
        ),
        &[
            initializer.clone(),
            pda_account.clone(),
            system_program.clone(),
        ],
        &[&[initializer.key.as_ref(), &[bump_seed]]],
    )?;

    // unpack account state
    let mut account_data =
        try_from_slice_unchecked::<StudentState>(&pda_account.data.borrow()).unwrap();
    // check if pda is already initialized
    if account_data.is_initialized {
        msg!("Account is already initialized");
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    // store data to account
    account_data.name = name;
    account_data.message = message;
    account_data.is_initialized = true;
    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
    Ok(())
}

pub fn update_student(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    name: String,
    message: String,
) -> ProgramResult {
    msg!("Update student introduction.");
    msg!("Name: {}", name);
    msg!("message: {}", message);

    let account_info_iter = &mut accounts.iter();
    let initializer = next_account_info(account_info_iter)?;
    let pda_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    msg!("Initializer = {}", initializer.key);
    msg!("Requested PDA = {}", pda_account.key);
    msg!("System Program = {}", system_program.key);

    // check if initializer is signer
    if !initializer.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    // check requested data length
    let req_size = 1 + (4 + name.len()) + (4 + message.len());
    if (req_size > 1000) {
        msg!("Data length is larger than 1000 bytes");
        return Err(StudentError::InvalidDataLength.into());
    }

    // Derive PDA
    let (pda, bump_seed) = Pubkey::find_program_address(&[initializer.key.as_ref()], program_id);

    msg!("PDA = {}", pda);
    msg!("bump_seed = {}", bump_seed);
    // check pda address
    if pda != *pda_account.key {
        msg!("Invalid seeds for PDA");
        return Err(StudentError::InvalidPDA.into());
    }

    // get account data
    let mut account_data =
        try_from_slice_unchecked::<StudentState>(&pda_account.data.borrow()).unwrap();

    // check if account is not initialized
    if !account_data.is_initialized {
        msg!("Account is not initialized");
        return Err(StudentError::UnAuthorizedAccount.into());
    }

    msg!("Student info before update :");
    msg!("Name: {}", account_data.name);
    msg!("Message: {}", account_data.message);

    account_data.name = name;
    account_data.message = message;

    // serialize
    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;

    Ok(())
}
