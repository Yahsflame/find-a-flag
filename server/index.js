const express = require('express');
const axios = require('axios');
const stream = require('stream');
const app = express();
const PORT = 3001;

const allowedDomains = ['flagcdn.com'];

const cache = {};

function isValidUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return allowedDomains.some(domain => parsedUrl.hostname.endsWith(domain));
  } catch (error) {
    return false;
  }
}

app.get('/api/download/*', async (req, res) => {
  const externalUrl = req.params[0];

  if (cache[externalUrl]) {
    console.log('Serving from cache:', externalUrl);
    res.setHeader('Content-Disposition', `attachment; filename=${cache[externalUrl].fileName}`);
    return cache[externalUrl].stream.pipe(res);
  }

  if (!isValidUrl(externalUrl)) {
    return res.status(400).send({ message: "Invalid URL provided." });
  }

  try {
    const response = await axios({
      method: 'get',
      url: externalUrl,
      responseType: 'stream'
    });

    const fileName = externalUrl.split('/').pop();
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    const cacheStream = new stream.PassThrough();
    cache[externalUrl] = {
      stream: cacheStream,
      fileName: fileName
    };

    response.data.pipe(cacheStream);
    response.data.pipe(res);
  } catch (error) {
    console.error("Error downloading external file:", error);
    res.status(500).send({
      message: "Could not download the file. " + error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
