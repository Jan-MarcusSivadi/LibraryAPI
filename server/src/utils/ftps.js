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

  async getFiles(dir) {
    try {
      var result = await this.client.list()
      if (dir) {
        result = await this.client.list(dir)
      }
      return result
    }
    catch (err) {
      console.log(err)
      // this.client.close()
    }
  }

  async uploadFile(buff, dir, fileData) {
    const client = this.client
    try {
      const hasDir = await client.ensureDir(dir)
      if (!hasDir) {
        console.log('Upload directory ERROR!')
      }

      // Log progress for any transfer from now on.
      client.trackProgress(info => {
        console.log("File", info.name)
        console.log("Type", info.type)
        console.log("Transferred", info.bytes)
        console.log("Transferred Overall", info.bytesOverall)
      })

      // Transfer some data
      // await client.uploadFrom(someStream, "test.txt")
      // await client.uploadFrom("somefile.txt", "test2.txt")
      const { filename } = fileData
      return await client.uploadFrom(buff, filename)

      // // Set a new callback function which also resets the overall counter
      // client.trackProgress(info => console.log(info.bytesOverall))
      // await client.downloadToDir("local/path", "remote/path")

      // // Stop logging
      // client.trackProgress()

      // return await this.client.put()
    } catch (error) {

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