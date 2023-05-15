import ConnectWallet from '@/components/ConnectWallet'
import NFTData from '@/components/NFTData'

export default function Home() {
  return (
  <div className="p-8 max-w-lg w-full">
    <ConnectWallet />
    <NFTData />
  </div>
  )
}
