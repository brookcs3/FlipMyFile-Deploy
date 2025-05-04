const fs = require('fs');
const https = require('https');

// GitHub API configuration
const owner = 'brookcs3';
const repo = 'formatflip';
const token = process.env.GITHUB_TOKEN;

// Files to push
const files = [
  { 
    path: 'ffmpeg-demo.html',
    message: 'Add FFmpeg demo with CDN-based assets'
  },
  { 
    path: 'vercel.json',
    message: 'Update vercel.json to use ffmpeg-demo.html'
  }
];

// Function to push a file to GitHub
async function pushFile(filePath, commitMessage) {
  // Read the file content
  const content = fs.readFileSync(filePath, 'utf8');
  const contentBase64 = Buffer.from(content).toString('base64');
  
  // API options
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/contents/${filePath}`,
    method: 'PUT',
    headers: {
      'User-Agent': 'Node.js',
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    }
  };
  
  // Request data
  const data = JSON.stringify({
    message: commitMessage,
    content: contentBase64
  });
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseBody = '';
      
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`Successfully pushed ${filePath}`);
          resolve(true);
        } else {
          console.error(`Failed to push ${filePath}: ${res.statusCode} ${res.statusMessage}`);
          console.error(`Response: ${responseBody}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (e) => {
      console.error(`Request error: ${e.message}`);
      reject(e);
    });
    
    req.write(data);
    req.end();
  });
}

// Push all files
async function pushAllFiles() {
  for (const file of files) {
    console.log(`Pushing ${file.path}...`);
    try {
      await pushFile(file.path, file.message);
    } catch (error) {
      console.error(`Error pushing ${file.path}: ${error.message}`);
    }
  }
}

// Execute
pushAllFiles();
