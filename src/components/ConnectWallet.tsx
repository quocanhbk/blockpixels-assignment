import { ethers } from "ethers"
import { useState, useMemo, useEffect } from "react"

const ConnectWallet = () => {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [chainId, setChainId] = useState<number | null>(null)
  const [error, setError] = useState("")

  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)

  useEffect(() => {
    const getProvider = async () => {
      const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : null
      setProvider(provider)
    }

    getProvider()
  }, [])

  useEffect(() => {
    const checkConnectedAccount = async () => {
      if (!provider) return
      const accounts = await provider.listAccounts()
      if (accounts.length > 0) {
        setAccount(accounts[0])
      }

      const network = await provider.getNetwork()
      setChainId(Number(network.chainId))
    }

    checkConnectedAccount()

    const handleAccountsChanged = (accounts: string[]) => {
      setAccount(accounts[0])
    }

    const handleChainChanged = (chainId: number) => {
      setChainId(Number(chainId))
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    // Clean up the event listener
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum.removeListener("chainChanged", handleChainChanged)
    }
  }, [provider])

  useEffect(() => {
    const getData = async () => {
      if (!account || !provider) return
      const signer = provider.getSigner()
      const balance = chainId === 1 ? await signer.getBalance() : 0
      setBalance(Number(ethers.utils.formatEther(balance)))
    }

    getData()
  }, [account, provider, chainId])

  useEffect(() => {
    if (chainId !== null && chainId !== 1) {
      setError("Please switch to Ethereum Mainnet")
      return
    }

    setError("")
  }, [account, chainId])

  const switchToMainnet = async (provider: ethers.providers.Web3Provider | null) => {
    if (!provider) return

    await provider.send(
      "wallet_switchEthereumChain",
      [{ chainId: "0x1" }] // 0x1 is the chainId for Ethereum Mainnet
    )
  }

  const connectWallet = async () => {
    if (!provider) {
      setError("MetaMask not found. Please install MetaMask extension.")
      return
    }

    const network = await provider.getNetwork()

    // switch to mainnet if not on mainnet
    if (Number(network.chainId) !== 1) {
      try {
        await switchToMainnet(provider)
      } catch (err: any) {
        setError(err.message)
        return
      }
    }

    const accounts = await provider.listAccounts()
    if (accounts.length > 0) {
      setAccount(accounts[0])
      return
    }

    try {
      const res = await provider.send("eth_requestAccounts", [])
      setAccount(res[0])
    } catch (err: any) {
      setError(err.message)
      return
    }
  }

  return (
    <div className="w-full">
      <h1 className="text-xl mb-4 font-bold">Connect wallet</h1>
      {!account ? (
        <button className="bg-slate-50 text-slate-900 py-2 px-4 rounded-lg" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <div className="bg-slate-50 overflow-hidden text-slate-900 rounded-lg p-2">
          <p className="w-full font-bold break-words">{account}</p>
          <p className="text-sm">Balance: {balance} ETH</p>
        </div>
      )}
      {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
      {chainId !== null && chainId !== 1 && (
        <button className="text-blue-400 font-bold text-sm" onClick={() => switchToMainnet(provider)}>
          Switch to Mainnet
        </button>
      )}
    </div>
  )
}

export default ConnectWallet
