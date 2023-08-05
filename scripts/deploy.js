const hre = require("hardhat");

async function main() {
  const deposit = ethers.utils.parseEther("1");
  const depositor = ethers.provider.getSigner(0);
  const beneficiary = ethers.provider.getSigner(1);
  const arbiter = ethers.provider.getSigner(2);
  try {
    const Escrow = await ethers.getContractFactory("Escrow");
    const contract = await Escrow.deploy(
      arbiter.getAddress(),
      beneficiary.getAddress(),
      {
        value: deposit,
      }
    );
    await contract.deployed();

    console.log(
      `Escrow with ${hre.ethers.utils.formatEther(deposit)}ETH deployed to ${
        contract.address
      }`
    );
  } catch (error) {
    console.error(error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
