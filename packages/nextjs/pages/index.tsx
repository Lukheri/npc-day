import React, { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { NFTPicker } from "~~/components/spark";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

// import React, { useState, useEffect } from "react";
// import { Engine } from "~~/engine";
// import Link from "next/link";
// import { BugAntIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  const { address } = useAccount();
  const [guestAccount, setGuestAccount] = useState<string | null>(null);

  // const { writeAsync: mintNPC } = useScaffoldContractWrite({
  //   contractName: "NPCNFT",
  //   functionName: "mintNPC",
  //   args: [address],
  //   onBlockConfirmation: txnReceipt => {
  //     console.log("📦 Transaction blockHash", txnReceipt.blockHash);
  //   },
  // });

  // useEffect(() => {
  //   async function doLoad(): Promise<void> {
  //     Engine.load("");
  //   }
  //   doLoad();
  // }, []);
  const connectWithGuestAccount = () => {
    // use a guest account with NFTs
    setGuestAccount("paulgadi.eth");
  };

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow">
        <div className="px-5 py-5 w-full">
          {address ? (
            <NFTPicker address={address}></NFTPicker>
          ) : guestAccount ? (
            <NFTPicker address={guestAccount}></NFTPicker>
          ) : (
            <>
              <div className="text-center">
                Connect Wallet to select one of your NFTs, or press the button below to use a guest wallet.
              </div>
              <div className="flex items-center flex-col flex-grow">
                <button className="btn btn-primary btn-sm mt-5" onClick={connectWithGuestAccount} type="button">
                  USE GUEST WALLET
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/*

      <div className="flex items-center flex-col flex-grow">
        <div className="carousel rounded-box">
          <div className="carousel-item">
            <img src="https://daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg" alt="Burger" />
          </div> 
          <div className="carousel-item">
            <img src="https://daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.jpg" alt="Burger" />
          </div> 
          <div className="carousel-item">
            <img src="https://daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.jpg" alt="Burger" />
          </div> 
          <div className="carousel-item">
            <img src="https://daisyui.com/images/stock/photo-1494253109108-2e30c049369b.jpg" alt="Burger" />
          </div> 
          <div className="carousel-item">
            <img src="https://daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.jpg" alt="Burger" />
          </div> 
          <div className="carousel-item">
            <img src="https://daisyui.com/images/stock/photo-1559181567-c3190ca9959b.jpg" alt="Burger" />
          </div> 
          <div className="carousel-item">
            <img src="https://daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.jpg" alt="Burger" />
          </div>
        </div>      
      </div>

      */}

      {/*
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/pages/index.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>

          <button
            className="py-2 px-16 mb-10 mt-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
            onClick={() => mintNPC()}
          >
            Mint NPC
          </button>
        
        {/*
          <h1 className="text-center mb-5">
            <span className="block text-2xl mb-2">Buy a NFT</span>
          </h1>

          <Image className="ml-60" src="/assets/chef.png" width={80} height={80} alt="Chef" />

          <button
            className="py-2 px-16 mb-1 mt-6 ml-52 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
            onClick={() => mintNFT()}
          >
            Buy
          </button>

        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contract
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <SparklesIcon className="h-8 w-8 fill-secondary" />
              <p>
                Experiment with{" "}
                <Link href="/example-ui" passHref className="link">
                  Example UI
                </Link>{" "}
                to build your own UI.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
      */}
    </>
  );
};

export default Home;
