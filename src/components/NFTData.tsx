import axios from "axios"
import { utils } from "ethers"
import { useEffect, useState } from "react"
import NFTCard from "./NFTCard"
import { GetNFTResponse } from "@/pages/api/nft/[address]"

const NFTData = () => {
  const [address, setAddress] = useState("")
  const [error, setError] = useState("")
  const [result, setResult] = useState<GetNFTResponse | null>(null) // TODO: replace any with the correct type
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // check if address is valid
    if (!utils.isAddress(address)) {
      setError("Invalid address")
      return
    }

    setIsLoading(true)
    try {
      const result = await axios.get<GetNFTResponse>(`/api/nft/${address}`).then(res => res.data)
      console.log({ result })
      setResult(result)
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Something went wrong")
    }
    setIsLoading(false)
  }

  useEffect(() => {
    setError("")
  }, [address])

  return (
    <div className="mt-8 w-full">
      <h1 className="text-xl mb-4 font-bold">Get NFTs by wallet</h1>
      <form onSubmit={handleSearch}>
        <div className="flex w-full">
          <input
            className="flex-1 bg-slate-50 text-slate-900 p-2 rounded-l-lg focus:ring ring-slate-400 outline-none"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Enter wallet address"
            autoComplete="false"
          />
          <button
            className="py-2 px-8 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 font-bold focus:ring ring-slate-400 rounded-r-lg w-32"
            type="submit"
          >
            {!isLoading ? "Get" : "Loading..."}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
      {result && (
        <div className="mt-4">
          {!!result && <h2 className="text-lg font-semibold mt-4">Result</h2>}
          {result.result.length > 0 ? (
            result.result.map(item => <NFTCard key={`${item.token_address}:${item.token_id}`} item={item} />)
          ) : (
            <p className="mt-4">No NFTs found</p>
          )}
        </div>
      )}
    </div>
  )
}

export default NFTData
