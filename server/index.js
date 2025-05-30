import express from "express";
import { JsonRpcProvider, Contract, formatUnits } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

// 用 JsonRpcProvider 创建 provider
// const provider = new JsonRpcProvider("https://cloudflare-eth.com");
// const provider = new JsonRpcProvider('https://mainnet.infura.io/v3/d41e1cc45b1c4f48a2cd48627efb82c6');
const provider = new JsonRpcProvider(process.env.INFURA_URL);

// 合约地址和ABI
const contractAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const abi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
];

app.get("/shaoyunApiTest", async (req, res) => {
  try {
    const contract = new Contract(contractAddress, abi, provider);

    const name = await contract.name();
    const symbol = await contract.symbol();
    const totalSupply = await contract.totalSupply();

    // DAI 是 18 位精度，转为可读的字符串
    const formattedSupply = formatUnits(totalSupply, 18);

    console.log("Token Name:", name);
    console.log("Token Symbol:", symbol);
    console.log("Total Supply:", formattedSupply);

    res.send(
      `Fetched from blockchain: ${name} (${symbol}), Total Supply: ${formattedSupply}`
    );
  } catch (err) {
    console.error("Error calling contract:", err);
    res.status(500).send("Error fetching contract data");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
