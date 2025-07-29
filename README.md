# RotaractDAO: A Decentralized Governance Platform
![Dashboard](./images/dashboard.png)
This project is a complete Decentralized Autonomous Organization (DAO) built from the ground up to bring transparency, security, and democratic governance to community organizations like the Rotaract Club. It solves the common challenge of managing club finances by moving all decision-making and fund management on-chain.

## Core Features
- **On-Chain Governance**: A full proposal lifecycle (propose, vote, queue, execute) managed by smart contracts. Every decision is recorded transparently on the blockchain.
- **ERC20Votes Token** ($RTC): Members are issued tokens that represent their voting power, which can be delegated to other members.
- **Secure, Timelock-Controlled Treasury**: The DAO's funds are held in a secure Treasury contract. Funds can only be transferred after a proposal has been successfully voted on and has passed a mandatory security time delay (Timelock).
- **Autonomous & Immutable**: Once deployed, the core rules of the DAO are made immutable by transferring ownership of the system to the Timelock itself, removing any single point of failure.

# System Architecture
The system operates through a clear chain of command, ensuring separation of powers:
Members (vote with $RTC) ➔ RotaractGovernor (The Voting Machine) ➔ RotaractTimelock (The Secure Executor) ➔ Treasury (The Vault)

# Prerequisites
- foundry
- npm
- crypto-wallet (ex: Metamask)

# Getting started
## Basic setup
First clone the repository
```bash
git clone https://github.com/CjSidharth/rotaract-dao.git
```
Then change to foundry directory and install packages using the following commands:
```bash
cd foundry
forge install OpenZeppelin/openzeppelin-contracts
forge install Cyfrin/foundry-devops
forge install smartcontractkit/chainlink-evm                 
```
Change to frontend directory and install packages:
```bash
cd frontend
npm install
```



## Starting local node and Deploying
```bash
cd foundry
anvil
```
Create keystore wallet for quick testing and name it Anvil_1.
Take a private key from anvil and give a password.
```bash
cast wallet import Anvil_1
```
In another terminal instance, deploy the contracts:
```bash
make deploy-anvil-dao
```
Lastly go to frontend folder and run dev server:
```bash
npm run dev
```

## Workflow:
- Click on the delegate votes to convert RTC to voting power
- Click on create proposal and fill the form.
- Then to activate the proposal, fastforward time by 201 blocks:
```bash
cast rpc anvil_mine 201
```
- Then after voting, finish the time period by:
```bash
cast rpc anvil_mine 201
```
- Queue the proposal and execute it after 2 seconds.

# TODO
- Audit it after learning security auditing
- Optimize for gas efficiency
- Deploy to Sepolia Testnet

