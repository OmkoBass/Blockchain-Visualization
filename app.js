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
    // this.chain.push(Object.freeze(block));
    this.chain.push(block);
  }

  isValid(blockchain = this) {
    for (let i = 1; i < blockchain.chain.length; i++) {
      const currentBlock = blockchain.chain[i];
      const prevBlock = blockchain.chain[i - 1];

      // Check validity of the block
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

    const blockChainValid = this.isValid() ? true : false;

    blockChain.map((block, index) => {
      const blockDiv = document.createElement("div");
      blockDiv.classList.add("block-div");

      // Changed block background color based on
      // blockchain validity
      if (blockChainValid) {
        blockDiv.classList.add("block-div-valid");
      } else {
        blockDiv.classList.add("block-div-invalid");
      }

      const blockTimestamp = document.createElement("h4");
      blockTimestamp.innerHTML = `Timestamp: ${block.timestamp}`;

      const blockHash = document.createElement("h4");
      blockHash.innerHTML = `Hash: ${block.hash}`;

      const blockPrevHash = document.createElement("h4");
      blockPrevHash.innerHTML = `PrevHash: ${block.prevHash}`;

      // Add a button for every block to revalidate/remine it
      const buttonChangeBlockValidation = document.createElement("button");
      buttonChangeBlockValidation.textContent = "Revalidate";

      buttonChangeBlockValidation.addEventListener("click", () => {
        this.chain[index].hash = this.chain[index].getHash();

        this.draw();
      });

      blockDiv.append(blockTimestamp);
      blockDiv.append(blockHash);
      blockDiv.append(blockPrevHash);

      // Add the validation function to every block
      // except the first one
      if (index > 0) {
        blockDiv.append(buttonChangeBlockValidation);
      }

      block.data.map((transaction) => {
        const transactionDiv = document.createElement("div");
        transactionDiv.classList.add("transaction-div");

        const transactionSender = document.createElement("h5");
        transactionSender.innerHTML = `Sender: ${transaction.sender}`;

        // Create an input dom element
        const transactionSenderInput = document.createElement("input");

        // When we hover over the sender text
        // it will be replaced with our input
        transactionSender.addEventListener("mouseenter", () => {
          if (index > 0) {
            transactionSender.replaceWith(transactionSenderInput);
            transactionSenderInput.value = transactionSender.innerText
              .split(":")[1]
              .trimStart();
          }
        });

        // When we leave our input the text of it will be saved to the block
        // making it tampered and invalid
        transactionSenderInput.addEventListener("mouseleave", () => {
          if (transactionSenderInput.value) {
            this.chain[index].data[0].sender = transactionSenderInput.value;
          }

          transactionSenderInput.replaceWith(transactionSender);

          this.draw();
        });

        const transactionReceiver = document.createElement("h5");
        transactionReceiver.innerHTML = `Receiver: ${transaction.receiver}`;

        // Same input logic like the sender has
        const transactionReceiverInput = document.createElement("input");

        transactionReceiver.addEventListener("mouseenter", () => {
          if (index > 0) {
            transactionReceiver.replaceWith(transactionReceiverInput);
            transactionReceiverInput.value = transactionReceiver.innerText
              .split(":")[1]
              .trimStart();
          }
        });

        transactionReceiverInput.addEventListener("mouseleave", () => {
          if (transactionReceiverInput.value) {
            this.chain[index].data[0].receiver = transactionReceiverInput.value;
          }

          transactionReceiverInput.replaceWith(transactionReceiver);

          this.draw();
        });

        const transactionScore = document.createElement("h5");
        transactionScore.innerHTML = `Score: ${transaction.score}`;

        // Same input logic like the sender has
        const transactionScoreInput = document.createElement("input");
        transactionScoreInput.setAttribute("type", "number");

        transactionScore.addEventListener("mouseenter", () => {
          if (index > 0) {
            transactionScore.replaceWith(transactionScoreInput);
            transactionScoreInput.value = transactionScore.innerText
              .split(":")[1]
              .trimStart();
          }
        });

        transactionScoreInput.addEventListener("mouseleave", () => {
          if (transactionScoreInput.value) {
            this.chain[index].data[0].score = transactionScoreInput.value;
          }

          transactionScoreInput.replaceWith(transactionScore);

          this.draw();
        });

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

  senderInput.value = null;
  receiverInput.value = null;
  scoreInput.value = null;

  blockchain.draw();
}

blockchain.draw();
