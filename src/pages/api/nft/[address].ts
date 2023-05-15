import type { NextApiRequest, NextApiResponse } from "next"
import Moralis from "moralis"
import { utils } from "ethers"

Moralis.start({ apiKey: process.env.MORALIS_API_KEY })

export interface NFTItem {
  token_address: string
  token_id: string
  name: string
  media?: {
    original_media_url: string
    mimetype?: string
    media_collection?: Record<
      "low" | "medium" | "high",
      {
        url: string
        height: number
        width: number
      }
    >
  }
}

export interface GetNFTResponse {
  cursor: string | null
  page: number
  page_size: number
  status: string
  total: number | null
  result: NFTItem[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { address } = req.query

    if (!utils.isAddress(address as string)) {
      res.status(400).json({ error: "Invalid address" })
      return
    }

    try {
      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        chain: "0x1",
        format: "decimal",
        tokenAddresses: [],
        mediaItems: true,
        address: address as string,
      })

      res.status(200).json(response)
    } catch (error: any) {
      if (error?.code === "C0006") {
        res.status(500).json({ error: "Invalid Moralis API Key" })
        return
      }
      res.status(500).json({ error: "Something went wrong" })
    }
  }
}

export default handler
