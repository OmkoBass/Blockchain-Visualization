const crypto = require("crypto");
const SHA256 = (message) =>
  crypto.createHash("sha256").update(message).digest("hex");

// type TransactionData = {
//   sender: string,
//   receiver: string,
//   score: number,
// };

const senderInput = document.getElementById("sender");
const receiverInput = document.getElementById("receiver");
const scoreInput = document.getElementById("score");
const buttonAddBlock = document.getElementById("buttonAddBlock");

const blockchainDiv = document.getElementById("blockchain-div");

class Blockchain {
  // chain: Block[];
  // difficulty: number;

  constructor() {
    // Create our genesis block
    this.chain = [
      new Block(Date.now().toString(), [
        { sender: "Satoshi", receiver: "OmkoBass", score: 900 },
      ]),
    ];
    this.difficulty = 1;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(block) {
    // Since we are adding a new block, prevHash will be the hash of the old latest block
    block.prevHash = this.getLastBlock().hash;
    // Since now prevHash has a value, we must reset the block's hash
    block.hash = block.getHash();

    // block.mine(this.difficulty);
    // Object.freeze ensures immutability in our code
    this.chain.push(Object.freeze(block));
  }

  isValid(blockchain = this) {
    // Iterate over the chain, we need to set i to 1 because there are nothing before the genesis block, so we start at the second block.
    for (let i = 1; i < blockchain.chain.length; i++) {
      const currentBlock = blockchain.chain[i];
      const prevBlock = blockchain.chain[i - 1];

      // Check validation
      if (
        currentBlock.hash !== currentBlock.getHash() ||
        prevBlock.hash !== currentBlock.prevHash
      ) {
        return false;
      }
    }

    return true;
  }

  draw() {
    blockchainDiv.innerHTML = "";

    const blockChain = blockchain.chain;

    blockChain.map((block) => {
      const blockDiv = document.createElement("div");
      blockDiv.classList.add("block-div");

      const blockTimestamp = document.createElement("h4");
      blockTimestamp.innerHTML = `Timestamp: ${block.timestamp}`;

      const blockHash = document.createElement("h4");
      blockHash.innerHTML = `Hash: ${block.hash}`;

      const blockPrevHash = document.createElement("h4");
      blockPrevHash.innerHTML = `PrevHash: ${block.prevHash}`;

      blockDiv.append(blockTimestamp);
      blockDiv.append(blockHash);
      blockDiv.append(blockPrevHash);

      block.data.map((transaction) => {
        const transactionDiv = document.createElement("div");
        transactionDiv.classList.add("transaction-div");

        const transactionSender = document.createElement("h5");
        transactionSender.innerHTML = `Sender: ${transaction.sender}`;

        const transactionReceiver = document.createElement("h5");
        transactionReceiver.innerHTML = `Receiver: ${transaction.receiver}`;

        const transactionScore = document.createElement("h5");
        transactionScore.innerHTML = `Score: ${transaction.score}`;

        transactionDiv.append(transactionSender);
        transactionDiv.append(transactionReceiver);
        transactionDiv.append(transactionScore);

        blockDiv.append(transactionDiv);
      });

      blockchainDiv.appendChild(blockDiv);
    });
  }
}

class Block {
  // timestamp: string;
  // data: TransactionData[];
  // hash: string;
  // prevHash: string;
  // nonce: number;

  constructor(timestamp = "", data = []) {
    this.timestamp = timestamp;
    this.data = data;
    this.hash = this.getHash();
    this.prevHash = ""; // previous block's hash
    this.nonce = 0;
  }

  // Our hash function.
  getHash() {
    return SHA256(this.prevHash + this.timestamp + JSON.stringify(this.data));
  }

  // mine(difficulty) {
  //   // Basically, it loops until our hash starts with
  //   // the string 0...000 with length of <difficulty>.
  //   while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
  //     // We increases our nonce so that we can get a whole different hash.
  //     this.nonce++;
  //     // Update our new hash with the new nonce value.
  //     this.hash = this.getHash();
  //   }
  // }
}

let blockchain = new Blockchain();

buttonAddBlock.addEventListener("click", handleAddBlock);

function handleAddBlock() {
  blockchain.addBlock(
    new Block(Date.now().toString(), [
      {
        sender: senderInput.value,
        receiver: receiverInput.value,
        score: scoreInput.value,
      },
    ])
  );

  // console.log(blockchain.chain);

  senderInput.value = null;
  receiverInput.value = null;
  scoreInput.value = null;

  blockchain.draw();
}

blockchain.draw();
