import { OpenAI } from "langchain/llms/openai"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { RetrievalQAChain } from "langchain/chains"
import { HNSWLib } from "langchain/vectorstores/hnswlib"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import * as fs from "fs"
import * as dotenv from "dotenv"

dotenv.config({ path: "../.env" })

const fileName = "learning-diary"
const question = "What should I do when I'm stuck?"
const filePath = `./${fileName}.md`
const VECTOR_STORE_PATH = `${fileName}.index`

const generateEmbeddings = async () => {
  const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY })

  let vectorStore
  if (fs.existsSync(VECTOR_STORE_PATH)) {
    // Checks if vector store exists, if not load it into memory
    console.log("Vector Exists..")
    vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, new OpenAIEmbeddings())
  } else {
    const text = fs.readFileSync(filePath, "utf8")
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 })
    const docs = await textSplitter.createDocuments([text])
    vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings())
    await vectorStore.save(VECTOR_STORE_PATH)
  }

  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever())

  const res = await chain.call({
    query: question,
  })

  console.log({ res })
}

generateEmbeddings()
