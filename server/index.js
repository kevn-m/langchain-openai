import { OpenAI } from "langchain/llms/openai"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { RetrievalQAChain } from "langchain/chains"
import { HNSWLib } from "langchain/vectorstores"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import * as fs from "fs"
import * as dotenv from "dotenv"

dotenv.config()

const fileName = "learning-diary.md"
const question = "Tell me about 3d at captur3d"
const textPath = `./${fileName}`
const VECTOR_STORE_PATH = `${fileName}.index`

const generateEmbeddings = async () => {
  const model = new OpenAI({})
}
