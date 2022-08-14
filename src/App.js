  import logo from './logo.svg';
  import './App.css';
  import { ethers } from "ethers";
  import EthersAdapter from '@gnosis.pm/safe-ethers-lib'
  import SafeServiceClient from '@gnosis.pm/safe-service-client'
  import Safe, { SafeFactory } from '@gnosis.pm/safe-core-sdk'
  import { SafeTransactionOptionalProps } from '@gnosis.pm/safe-core-sdk'
  import { MetaTransactionData } from '@gnosis.pm/safe-core-sdk-types'

  function App() {
    const createMultiTransaction = async () => {
      const safeAddress = "0x2Edb7899aA1eD00a9a1981222377A56181D75282"
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", []);

      const signer = provider.getSigner()
      const ethAdapter = new EthersAdapter({
        ethers,
        signer,
      })
      console.log("done.", provider, signer, ethAdapter)
        
      const txServiceUrl = 'https://safe-transaction.gnosis.io'
      const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
      const safeFactory = await SafeFactory.create({ ethAdapter })
      const safeSdk = await Safe.create({ ethAdapter, safeAddress })
      const transactions = [
        {
          to : "0xa2dDFc8a6C1F8868B80F2747D04532a6cDE9804d",
          data: "0x",
          value: "0",
        },
        {
          to : "0xa2dDFc8a6C1F8868B80F2747D04532a6cDE9804d",
          data: "0x",
          value: ethers.utils.parseEther("0.1"),
        },
      ]
          
      const safeTransaction = await safeSdk.createTransaction(transactions)
      
      console.log(safeTransaction)

      const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
      const senderSignature = await safeSdk.signTransactionHash(safeTxHash)
      console.log(signer.getAddress())
      await safeService.proposeTransaction({
        safeAddress,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress: await signer.getAddress(),
        senderSignature: senderSignature.data,
        origin
      })

    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <button onClick={createMultiTransaction}>Create Multi Transaction</button>
        </header>
      </div>
    );
  }

  export default App;
