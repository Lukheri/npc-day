import { useState } from "react";
import https from "https";
import { useAccountNFTs } from "~~/hooks/spark";
import scaffoldConfig from "~~/scaffold.config";

// import { getTargetNetwork } from "~~/utils/scaffold-eth";

const settings = {
  openAIApiKey: scaffoldConfig.openAIApiKey,
};

type TNFTPickerProps = {
  address: string;
  className?: string;
};

/**
 * Allow user to pick an NFT in their address, uses Alchemy
 */
export const NFTPicker = ({ address, className = "" }: TNFTPickerProps) => {
  // const configuredNetwork = getTargetNetwork();
  const {
    nfts,
    // pageKey,
    // setCurrentPage,
    loading,
    error,
  } = useAccountNFTs(address);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [selectedNFT, setSelectedNFT] = useState<any>();

  if (!address || loading || nfts === null) {
    return (
      <div className="animate-pulse flex justify-center space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`border-2 border-gray-400 rounded-md px-2 flex flex-col items-center max-w-fit cursor-pointer`}>
        <div className="text-warning">Error</div>
      </div>
    );
  }

  const filteredNFTs = nfts?.ownedNfts.filter(nft => nft.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  const NFTCard = ({ nft }: { nft: any }) => {
    return (
      <div
        className={`border-2 border-gray-400 rounded-md px-2 flex flex-col items-center w-fit cursor-pointer`}
        onClick={() => {
          setSelectedNFT(nft);
          console.log("clicked", nft);
        }}
      >
        <div className="text-warning">{nft.name}</div>
        <img src={String(nft.image.pngUrl)} alt={nft.name} className={`w-80 py-2`} />
      </div>
    );
  };

  const sendChatToModel = async () => {
    const initialPrompt =
      "Roleplay as an actual character. I will start with sending you a JSON object containing some information about you. Never talk about NFTs or the blockchain. JSON follows: \n" +
      JSON.stringify(selectedNFT, null, 2);

    const initialChat = "Good day to you. How are you doing today?";

    // call openAI with this initial prompt and set response once we receive it
    const messages = [
      {
        role: "system",
        content: initialPrompt,
      },
      {
        role: "assistant",
        content: initialChat,
      },
      {
        role: "user",
        content: message,
      },
    ];

    const requestData = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const options = {
      hostname: "api.openai.com",
      path: "/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.openAIApiKey}`,
      },
    };

    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, res => {
        let data = "";

        res.on("data", chunk => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(JSON.parse(data));
        });
      });

      req.on("error", error => {
        reject(error);
      });

      req.write(requestData);
      req.end();
    });

    console.log(response);

    const responseMessage = (response as any).choices[0].message.content;
    console.log(responseMessage);
    setResponse(responseMessage);
  };

  return (
    <div className={`${className}`}>
      <div className="w-full flex justify-center">
        <input type="text" placeholder="Search by name" className="input input-bordered w-1/2 rounded-md" />
      </div>

      <div className="text-center">NFTs found: {filteredNFTs?.length}</div>

      {
        // show dialog with selected NFT
        selectedNFT && (
          <div className="flex w-full p-6 rounded-lg shadow-xl bg-base-100 mt-10">
            <div className="flex gap-4 w-full">
              <div className="w-80">
                <div>Selected NFT: {selectedNFT?.collection.name + ": " + selectedNFT?.name}</div>

                <NFTCard nft={selectedNFT} />
              </div>
              <div className="flex flex-col grow justify-end px-4 gap-6">
                {
                  // show response from model
                  response && (
                    <div className="flex-wrap justify-center">
                      <div>Model response:</div>
                      <div className="break-words">{response}</div>
                    </div>
                  )
                }
                {/* <div className="flex-wrap justify-center shadow-inner">
                  <div>Model response:</div>
                  <div className="break-words">
                    Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
                  </div>
                </div> */}
                <div className="flex gap-4 items-center shrink">
                  {/* <input
                    type="text"
                    placeholder="Say something to NFT"
                    
                    className="border border-gray-400 rounded-md px-2 py-1 text-right text-black"
                    style={{ width: "100%" }}
                  /> */}
                  <input
                    type="text"
                    placeholder="Say something to NFT"
                    className="input input-bordered w-full text-right"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                  <button onClick={sendChatToModel} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      <div className="flex flex-wrap justify-center mt-10">
        {filteredNFTs?.map((nft, index) => (
          <NFTCard key={index} nft={nft} />
        ))}
      </div>
    </div>
  );
};
