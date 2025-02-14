const fs = require('fs').promises; // Use promise-based fs API



async function handleGetResponse() {
    try {
        const data = await fs.readFile('./data.txt', { encoding: 'utf8' });
        const lines = data.trim().split('\n'); 
        const parsedData = lines.map(line => JSON.parse(line));
        return parsedData; 
    } catch (err) {
        console.error('Error:', err);
        return [];
    }
}

async function handleWriteResponse(data) {
    try {
        const id = Math.floor(Math.random() * 1000000); 
        const dataWithId = { id, ...data };
        const serializedData = JSON.stringify(dataWithId);
        await fs.appendFile('./data.txt', JSON.stringify(serializedData) + '\n');
        return true; 
    } catch (err) {
        console.error('Error', err);
        return false; 
    }
}

exports.handleGetResponse = handleGetResponse;
exports.handleWriteResponse = handleWriteResponse;