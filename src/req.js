import http2 from 'http2';

const getURL = async (trackId) => {
    const client = http2.connect('https://spowload.cc');

    try {
        let xsrfToken = '';
        let resultingHeaders = {};

        await new Promise((resolve, reject) => {
            const req = client.request({
                ':method': 'GET',
                ':scheme': 'https',
                ':authority': 'spowload.cc',
                ':path': '/spotify/track-' + trackId
            });

            req.on('response', (headers) => resultingHeaders = headers);

            req.on('data', chunk => {
                if (chunk.includes('name="csrf-token" content="')) {
                    const match = chunk.toString().match(/name="csrf-token" content="(.*?)"/);
                    if (match && match[1]) xsrfToken = match[1];
                }
            });

            req.on('end', resolve);
            req.on('error', reject);
            req.end();
        });

        const properCookie = resultingHeaders['set-cookie'].map(c => c.split(';')[0]).join('; ');

        const headers2 = {
            ':method': 'POST',
            ':scheme': 'https',
            ':authority': 'spowload.cc',
            ':path': '/convert',
            'x-csrf-token': xsrfToken,
            'content-type': 'application/json',
            cookie: properCookie,
            'accept': '*/*'
        };

        const response2 = await new Promise((resolve, reject) => {
            const req = client.request(headers2);

            req.write(JSON.stringify({ urls: 'https://open.spotify.com/track/' + trackId }));

            let data = '';

            req.on('data', (chunk) => data += chunk);
            req.on('end', () => resolve(data));
            req.on('error', reject);
            req.end();
        });

        const res = JSON.parse(response2);
        return res.url;
    } catch (error) {
        console.error('error fetching song:', error.message);
        return '';
    } finally {
        client.close();
    }
};

export default getURL;