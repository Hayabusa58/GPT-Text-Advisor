import * as fs from 'fs';
import * as chokidar from "chokidar";
import OpenAI from 'openai';

const filePath: string = './test.txt';
// ToDo: keyとorgのundefinedチェックを追加する
const organization: any = process.env.OPENAI_ORGNIZATION;
const apiKey: any = process.env.OPENAI_APIKEY;

const onFileChange = (filePath: string) => {
    const content = getFileContent(filePath);
    content.then(async (fullfieled) => {
        console.log(`File content is: ${fullfieled}`);
        const openAiClient: OpenAI = getOpenAiClient(organization, apiKey);
        const completion = await openAiClient.chat.completions.create({
            messages: [{ role: 'system', 
                content: `以下の文章をフォーマルなシーンで提示する際に不適切な箇所があれば指摘してください: ${fullfieled}`}],
            model: 'gpt-4o',
        });
        console.log('GPTからのアドバイス: \n')
        console.log(completion.choices[0].message.content)
    })
};

async function getFileContent (filePath: string) {
    let content;
    content = fs.promises.readFile(filePath, { encoding: 'utf8'} );
    return content;
}

const getOpenAiClient = (organization:string, apiKey:string): OpenAI => {
    const client = new OpenAI({
        organization: organization,
        apiKey: apiKey
    })
    return client;
}

const watcher = chokidar.watch(filePath, { persistent:true });

watcher.on('change', (path) => {
    console.log(`File ${path} has been changed.`);
    onFileChange(path);
});

console.log(`Watching for changes on ${filePath}`);

