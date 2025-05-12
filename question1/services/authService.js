const axios = require('axios');

let tokenCache = {
  token: null,
  expiresAt: null
};

exports.getBearerToken = async () => {
  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MDYzMzI4LCJpYXQiOjE3NDcwNjMwMjgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijg1ODBkMjllLTIyMTktNDYwMy05OGRkLTA3NjNkM2ZjN2YwOSIsInN1YiI6ImFtLmVuLnU0Y3NlMjIzMjlAYW0uc3R1ZGVudHMuYW1yaXRhLmVkdSJ9LCJlbWFpbCI6ImFtLmVuLnU0Y3NlMjIzMjlAYW0uc3R1ZGVudHMuYW1yaXRhLmVkdSIsIm5hbWUiOiJrb25ldGkgbWFub2oiLCJyb2xsTm8iOiJhbS5lbi51NGNzZTIyMzI5IiwiYWNjZXNzQ29kZSI6IlN3dXVLRSIsImNsaWVudElEIjoiODU4MGQyOWUtMjIxOS00NjAzLTk4ZGQtMDc2M2QzZmM3ZjA5IiwiY2xpZW50U2VjcmV0IjoiYUFXc1hjZlBOWXdtZGtXSyJ9.rPvtFWDGH4qlSZszEsheNG1FSOEXS1WYxjCjgWsXAYw";
    
    tokenCache = {
      token: token,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000)
    };
    
    return token;
  } catch (error) {
    console.error('Error with bearer token:', error);
    throw new Error('Authentication failed: ' + (error.message || 'Unknown error'));
  }
};