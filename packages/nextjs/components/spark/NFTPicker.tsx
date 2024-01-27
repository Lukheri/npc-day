import { useState } from "react";
import NFTPickerSkeleton from "./NFTPickerSkeleton";
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

  const isBrowser = () => typeof window !== "undefined";

  const scrollToTop = () => {
    if (!isBrowser()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Skeleton loading
  if (!address || loading || nfts === null) {
    return <NFTPickerSkeleton />;
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
          scrollToTop();
          setSelectedNFT(nft);
          console.log("clicked", nft);
        }}
      >
        <div className="text-warning w-80">{nft.name}</div>
        {!!nft.image.pngUrl ? (
          <img src={String(nft.image.pngUrl)} alt={nft.name} className={`w-80 py-2 my-auto`} />
        ) : (
          <div className="skeleton w-80 h-80 py-2 bg-slate-300 my-auto"></div>
        )}
      </div>
    );
  };

  const sendChatToModel = async (event: any) => {
    event.preventDefault();
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
        <input
          type="text"
          placeholder="Search by name"
          className="input input-bordered w-1/2 rounded-md"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="text-center">NFTs found: {filteredNFTs?.length}</div>

      {
        // show dialog with selected NFT
        selectedNFT && (
          <div className="flex flex-col w-full p-6 rounded-lg shadow-xl bg-base-100 mt-10 gap-6">
            <div>Selected NFT: {selectedNFT?.collection.name + ": " + selectedNFT?.name}</div>
            <div className="flex gap-4 w-full">
              <div className="w-80">
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
                <form onSubmit={sendChatToModel} className="flex gap-4 items-center shrink">
                  <input
                    type="text"
                    placeholder="Say something to NFT"
                    className="input input-bordered input-secondary w-full text-right shadow-inner"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                  <button className="btn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                      />
                    </svg>
                  </button>
                </form>
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
