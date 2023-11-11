// SPDX-License-Identifier: MIT
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RentalContract", function () {
  let RentalContract;
  let rentalContract;
  let owner;
  let tenant;

  before(async function () {
    [owner, tenant] = await ethers.getSigners();

    const RentalContractFactory = await ethers.getContractFactory("RentalContract");
    rentalContract = await RentalContractFactory.deploy();
    await rentalContract.deployed();
  });

  it("Should create a contract", async function () {
    await rentalContract.createContract(tenant.address, 100, 1636281600, 1638883200);
    const contractInfo = await rentalContract.contracts(tenant.address);

    expect(contractInfo.owner).to.equal(owner.address);
    expect(contractInfo.tenant).to.equal(tenant.address);
  });

  it("Should deactivate the contract", async function () {
    await rentalContract.deactivateContract();
    const contractInfo = await rentalContract.contracts(tenant.address);

    expect(contractInfo.state).to.equal(2); // 2 corresponds to Inactive in the ContractState enum
  });



});
