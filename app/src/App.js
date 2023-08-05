import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";

const ESCROWS = "ESCROWS";
const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(contract, arbiterSigner) {
  const promise = contract.connect(arbiterSigner).approve();
  return promise.wait();
}

function clearContractStore() {
  localStorage.removeItem(ESCROWS);
}

function addContractStore(escrowArtifact) {
  localStorage.setItem(ESCROWS, escrowArtifact);
}

function getContractStore() {
  return localStorage.getItem(ESCROWS);
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();

    // Restore last copy from store
    const cashedEscrows = getContractStore();
    if (cashedEscrows) {
      setEscrows(cashedEscrows);
    }
  }, [account]);

  async function newContract() {
    const beneficiaryAddress = document.getElementById("beneficiary").value;
    const arbiterAddress = document.getElementById("arbiter").value;
    let value = document.getElementById("ether").value;
    value = ethers.utils.parseEther(value);

    try {
      const escrowContract = await deploy(
        signer,
        arbiterAddress,
        beneficiaryAddress,
        value
      );

      const escrow = {
        address: escrowContract.address,
        arbiterAddress,
        beneficiaryAddress,
        value: ethers.utils.formatEther(value),
        handleApprove: async () => {
          escrowContract.on("Approved", () => {
            document.getElementById(escrowContract.address).className =
              "complete";
            document.getElementById(escrowContract.address).innerText =
              "✓ It's been approved!";
          });

          await approve(escrowContract, signer);
        },
      };

      setEscrows([...escrows, escrow]);

      // Add to local storage
      addContractStore(escrows);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in ETH)
          <input type="text" id="ether" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>
        <button
          className="button delete"
          onClick={() => {
            clearContractStore();
            setEscrows([]);
          }}
        >
          Remove old deployment
        </button>
        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
