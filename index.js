"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const chokidar = __importStar(require("chokidar"));
const openai_1 = __importDefault(require("openai"));
const filePath = './test.txt';
// ToDo: keyとorgのundefinedチェックを追加する
const organization = process.env.OPENAI_ORGNIZATION;
const apiKey = process.env.OPENAI_APIKEY;
const onFileChange = (filePath) => {
    const content = getFileContent(filePath);
    content.then(async (fullfieled) => {
        console.log(`File content is: ${fullfieled}`);
        const openAiClient = getOpenAiClient(organization, apiKey);
        const completion = await openAiClient.chat.completions.create({
            messages: [{ role: 'system',
                    content: `以下の文章をフォーマルなシーンで提示する際に不適切な箇所があれば指摘してください: ${fullfieled}` }],
            model: 'gpt-4o',
        });
        console.log('GPTからのアドバイス: \n');
        console.log(completion.choices[0].message.content);
    });
};
async function getFileContent(filePath) {
    let content;
    content = fs.promises.readFile(filePath, { encoding: 'utf8' });
    return content;
}
const getOpenAiClient = (organization, apiKey) => {
    const client = new openai_1.default({
        organization: organization,
        apiKey: apiKey
    });
    return client;
};
console.log(apiKey, organization);
const watcher = chokidar.watch(filePath, { persistent: true });
watcher.on('change', (path) => {
    console.log(`File ${path} has been changed.`);
    onFileChange(path);
});
console.log(`Watching for changes on ${filePath}`);
