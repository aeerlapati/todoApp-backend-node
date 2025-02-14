const fs = require('fs').promises;

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

async function handleUpdateResponse(id, updatedData) {
    try {
        const fileData = await fs.readFile('./data.txt',  { encoding: 'utf8' });
        const todos = fileData
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => {
            const parsedLine = JSON.parse(line);
            if (typeof parsedLine === 'string') {
                return JSON.parse(parsedLine);
            }
            return parsedLine;
        });

        const todoIndex = todos.findIndex((todo) => {
            console.log('Todo object:', todo);
            console.log('Todo ID:', todo.id);
            return todo.id === parseInt(id, 10);
        });

        if (todoIndex === -1) {
            console.error(`Todo item with ID ${id} not found.`);
            return false;
        }

        if (updatedData.status === 'Completed') {
            updatedData['completionDate'] = getTodayDate();
        }
        console.log("updatedData" + updatedData);

        todos[todoIndex] = { ...todos[todoIndex], ...updatedData };

        const updatedFileData = todos.map((todo) => JSON.stringify(todo)).join('\n');
        await fs.writeFile('./data.txt', updatedFileData);

        return true;
    } catch (err) {
        console.error('Error in handleUpdateResponse:', err);
        return false;
    }
}

function getTodayDate() {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
}

module.exports = {
    handleGetResponse,
    handleWriteResponse,
    handleUpdateResponse
};