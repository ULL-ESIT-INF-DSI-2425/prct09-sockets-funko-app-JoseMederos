import net from 'net';

type RequestType = {
  command: string,
  options?: string,
  filename?: string,
};

const client = net.connect({port: 60300});

let request: RequestType;
if (process.argv.length === 3) {
  request = {
    command: process.argv[2],
  }
} else {
  request = {
    command: process.argv[2],
    filename: process.argv[3],
  }
}
client.write(JSON.stringify(request));

let wholeData = '';
client.on('data', (dataChunk) => {
  wholeData += dataChunk;
});

client.on('end', () => {
  const message = JSON.parse(wholeData);
  console.log(message);
});
