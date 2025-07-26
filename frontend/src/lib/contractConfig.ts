// src/lib/contractConfig.ts
import tokenAbi from './abi/RotaractToken.json';
import governorAbi from './abi/RotaractGovernor.json';
import treasuryAbi from './abi/Treasury.json';

export const GOVERNOR_ADDRESS = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';
export const TOKEN_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';    
export const TREASURY_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; 

export const governorContract = {
  address: GOVERNOR_ADDRESS,
  abi: governorAbi.abi,
} as const;

export const tokenContract = {
  address: TOKEN_ADDRESS,
  abi: tokenAbi.abi,
} as const;

export const treasuryContract = {
    address: TREASURY_ADDRESS,
    abi: treasuryAbi.abi,
} as const;