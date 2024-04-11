## Setup of embedded uploader integration within React app 

1. Copy the uploader embed code and add the script to the index.html file inside the public folder.
2. Copy the uploader button and insert it into the component you want to embed.
3. Copy the token from the snippet and paste it into the .env file's REACT_APP_UPLOADER_TOKEN environment variable.
4. Inside the component, use process.env.REACT_APP_UPLOADER_TOKEN to access the token, and inside the index.html, use "%REACT_APP_UPLOADER_TOKEN%."
5. For more information please visit https://docs.osmos.io/osmos-uploader/uploader-setup/webpage-integration
