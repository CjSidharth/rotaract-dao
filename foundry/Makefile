.PHONY: all test clean deploy fund help install snapshot format anvil zktest

all: clean remove install update build

# Clean the repo
clean  :; forge clean

# Remove modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"

install :; forge install cyfrin/foundry-devops@0.2.2 && forge install smartcontractkit/chainlink-brownie-contracts@1.1.1 && forge install foundry-rs/forge-std@v1.8.2

# Update Dependencies
update:; forge update

build:; forge build

zkbuild :; forge build --zksync

test :; forge test

zktest :; foundryup-zksync && forge test --zksync && foundryup

snapshot :; forge snapshot

format :; forge fmt

anvil :; anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1


ANVIL_NETWORK_ARGS := --rpc-url http://localhost:8545 --account Anvil_1 --broadcast

deploy-anvil-treasury:
# This is a Forge script to deploy the Treasury contract on Anvil
	@echo "Deploying Treasury contract on Anvil..."
	@forge script script/DeployTreasury.s.sol $(ANVIL_NETWORK_ARGS)


deploy-anvil-rotaract-token:
# This is a Forge script to deploy the RotaractToken contract on Anvil
	@echo "Deploying RotaractToken contract on Anvil..."
	@forge script script/DeployRotaractToken.s.sol:DeployRotaractToken $(ANVIL_NETWORK_ARGS)

deploy-anvil-governance:
# This is a Forge script to deploy the Governance contract on Anvil
	@echo "Deploying Governance contract on Anvil..."
	@forge script script/DeployGovernance.s.sol:DeployGovernance $(ANVIL_NETWORK_ARGS)

deploy-anvil-dao:
# This is a Forge script to deploy the Governance contract on Anvil
	@echo "Deploying DAO on Anvil..."
	@forge script script/DeployDAO.s.sol $(ANVIL_NETWORK_ARGS)

