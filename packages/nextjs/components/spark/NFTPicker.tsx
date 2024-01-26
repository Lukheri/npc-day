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
      <div className="animate-pulse flex space-x-4">
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
        className={`border-2 border-gray-400 rounded-md px-2 flex flex-col items-center max-w-fit cursor-pointer`}
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

    const responseMessage = (response as any).choices[0].message.content;
    console.log(responseMessage);
    setResponse(responseMessage);
  };

  return (
    <div className={className}>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <div>NFTs found: {filteredNFTs?.length}</div>
      {
        // show dialog with selected NFT
        selectedNFT && (
          <>
            <div>Selected NFT: {selectedNFT?.collection.name + ": " + selectedNFT?.name}</div>

            <NFTCard nft={selectedNFT} />

            <input
              type="text"
              placeholder="Say something to NFT"
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="border border-gray-400 rounded-md px-2 py-1 mt-2"
              style={{ width: "100%" }}
            />
            <button onClick={sendChatToModel} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md">
              Send
            </button>
            {
              // show response from model
              response && (
                <div className="flex-wrap justify-center mt-10">
                  <div>Model response:</div>
                  <div className="break-words">{response}</div>
                </div>
              )
            }
          </>
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
