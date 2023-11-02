// sftp.js
//
// Use this sample code to connect to your SFTP To Go server and run some file operations using Node.js.
//
// 1) Paste this code into a new file (sftp.js)
//
// 2) Install dependencies
//   npm install ssh2-sftp-client@^8.0.0
//
// 3) Run the script
//   node sftp.js
// 
// Compatible with Node.js >= v12
// Using ssh2-sftp-client v8.0.0

const ftp = require('basic-ftp');

class FTPSClient {
  constructor() {
    this.client = new ftp.Client()
  }

  async connect(options) {
    console.log(`Connecting to ${options.host}:${options.port}`);
    try {
      this.client.ftp.verbose = true
      return await this.client.access({
        host: options.host,
        user: options.user,
        password: options.password,
        secure: true,
        secureOptions: {
          // fix certificate altnames error
          checkServerIdentity: () => undefined
        }
      })
    }
    catch (err) {
      console.log(err)
      this.client.close()
    }
  }

  async getFiles() {
    try {
      return await this.client.list()
      // await this.client.uploadFrom("README.md", "README_FTP.md")
      // await this.client.downloadTo("README_COPY.md", "README_FTP.md")
    }
    catch (err) {
      console.log(err)
      this.client.close()
    }
  }

  async disconnect() {
    this.client.close()
  }

  // async uploadFile(localFile, remoteFile) {
  //   console.log(`Uploading ${localFile} to ${remoteFile} ...`);
  //   try {
  //     await this.client.put(localFile, remoteFile);
  //   } catch (err) {
  //     console.error('Uploading failed:', err);
  //   }
  // }

  // async downloadFile(remoteFile, localFile) {
  //   console.log(`Downloading ${remoteFile} to ${localFile} ...`);
  //   try {
  //     await this.client.get(remoteFile, localFile);
  //   } catch (err) {
  //     console.error('Downloading failed:', err);
  //   }
  // }

  // async deleteFile(remoteFile) {
  //   console.log(`Deleting ${remoteFile}`);
  //   try {
  //     await this.client.delete(remoteFile);
  //   } catch (err) {
  //     console.error('Deleting failed:', err);
  //   }
  // }
}
module.exports = FTPSClient