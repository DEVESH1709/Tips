const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER; 
const GITHUB_REPO = process.env.GITHUB_REPO;  
const FILE_PATH = process.env.GITHUB_FILE_PATH || tips.json;
const BRANCH = process.env.GITHUB_BRANCH || main;

if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
  console.error('Missing GitHub configuration in environment variables.');
  process.exit(1);
}

const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;

// app.use(cors());
app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());


async function fetchTipsFromGitHub() {
  try {
    const response = await axios.get(`${GITHUB_API_URL}?ref=${BRANCH}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    const content = Buffer.from(response.data.content, 'base64').toString('utf8');
    return { data: JSON.parse(content), sha: response.data.sha };
  } catch (error) {
    if (error.response && error.response.status === 404) {
     
      return { data: [], sha: null };
    }
    throw error;
  }
}


app.get('/api/tips', async (req, res) => {
  try {
    const { data } = await fetchTipsFromGitHub();
    res.json(data);
  } catch (error) {
    console.error('Error fetching tips:', error.message);
    res.status(500).json({ error: 'Failed to retrieve tips' });
  }
});


app.post('/api/tips', async (req, res) => {
  const { name, email, message, subscribe } = req.body;
  
  if (!message || message.trim().length < 50) {
    return res.status(400).json({ error: 'Message is required (min 50 chars)' });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {

    const { data: tipsArray, sha } = await fetchTipsFromGitHub();
    const newTip = {
      name: name ? name.trim() : null,
      email: email ? email.trim() : null,
      message: message.trim(),
      subscribe: !!subscribe,
      date: new Date().toISOString()
    };
    tipsArray.push(newTip);

  
    const updatedContent = Buffer.from(JSON.stringify(tipsArray, null, 2)).toString('base64');
    const commitMessage = `Add new tip${newTip.name ? ` from ${newTip.name}` : ''}`;

    const url = GITHUB_API_URL;
    const updatePayload = {
      message: commitMessage,
      content: updatedContent,
      branch: BRANCH
    };
    if (sha) {
      updatePayload.sha = sha;
    }

    await axios.put(url, updatePayload, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating tips:', error.message);
    res.status(500).json({ error: 'Failed to save new tip' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
