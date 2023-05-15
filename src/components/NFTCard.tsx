import { NFTItem } from "@/pages/api/nft/[address]"
import { useState } from "react"

interface NFTCardProps {
  item: NFTItem
}

const NFTCard = ({ item }: NFTCardProps) => {
  const [imageLoadingError, setImageLoadingError] = useState(false)

  return (
    <div key={`${item.token_address}:${item.token_id}`} className="bg-slate-800 rounded-lg mt-4 flex overflow-hidden">
      <div className="p-2 flex-1">
        <p>Name: {item.name}</p>
        <p>Token ID: {item.token_id}</p>
      </div>
      <div style={{ display: imageLoadingError ? "none" : "block" }}>
        {item?.media?.mimetype?.startsWith("image") ? (
          <div className="w-24 h-24 bg-slate-700">
            <img src={item.media.media_collection?.low.url} alt={item.name} className="object-contain" />
          </div>
        ) : item.media?.mimetype?.startsWith("video") ? (
          <div className="w-24 h-24 bg-slate-700">
            <video
              src={item.media.media_collection?.low.url}
              className="object-contain"
              loop
              autoPlay
              muted
              controls={false}
            />
          </div>
        ) : item.media?.original_media_url ? (
          <div className="w-24 h-24 bg-slate-700">
            <img
              src={item.media.original_media_url}
              alt={item.name}
              className="object-contain"
              onError={() => setImageLoadingError(true)}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default NFTCard
