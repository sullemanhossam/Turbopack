/**
 * This tiny API allows other services to query for kafka stats, using the scripts provided by kafka.
 */

const express = require('express');
const app = express();
const port = 3000;
const { exec } = require("child_process");

const executeCommand = (command) => new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            reject(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            reject(`stderr: ${stderr}`);
            return;
        }
        resolve(stdout);
    });
});

const tab2jsonParser = (text) => {
    const rows = text.split('\n').filter(row => row.length > 0);
    const headers = rows.shift().split(/\s+/);
    return rows
        .map(row => row.split(/\s+/).reduce((acc, curr, idx) => ({...acc, [headers[idx]]: curr}), {}))
        .filter(item => JSON.stringify(Object.keys(item)) !== JSON.stringify(Object.values(item)));
};

const listParser = (text) => text.trim().split('\n').map(row => row.trim());

const topicParser = (text) => {
    const rows = text.split('\n').filter(row => row.length > 0).map(row => row.trim());
    const metaRow = rows.shift();

    const meta = metaRow
                    .split('\t')
                    .map(cell => cell.trim())
                    .map(cell => cell.split(':').map(item => item.trim()))
                    .reduce((acc, curr) => ({...acc, [curr[0]]: curr[1]}), {});

    const partitions = rows.map(
        row => row
            .split('\t')
            .map(cell => cell.trim())
            .map(cell => cell.split(':').map(item => item.trim()))
            .reduce((acc, curr) => ({...acc, [curr[0]]: curr[1]}), {})
    );

    return {meta, partitions};
};

const parseResponse = (command, params, text) => {

    if (Object.keys(params).includes('list')) {
        return listParser(text);
    }

    if (command === 'topics') {
        if (Object.keys(params).includes('describe')) {
            return topicParser(text);
        }
    }

    return tab2jsonParser(text);
};

const query2cmdparams = (query) => {
    return Object.entries(query).map(([key, value]) => `--${key.replace(/\s/, '')}` + (value.length ? ` ${value}` : '')).join(' ');
};

const allowedCommands = [
    'consumer-groups',
    'topics',
];

app.get('/:cmd', async (req, res) => {

    if (!allowedCommands.includes(req.params.cmd)) {
        res.status(404).send({error: 'Command not found!'});
    }

    let command = `kafka-${req.params.cmd}.sh ${query2cmdparams(req.query)}`;

    try {
        const output = await executeCommand(command);
        res.send(parseResponse(req.params.cmd, req.query, output));
    } catch (error) {
        res.status(400).send({error});
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});