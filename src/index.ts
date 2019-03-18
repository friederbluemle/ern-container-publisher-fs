import { ContainerPublisher } from 'ern-container-publisher'
import { shell, log, NativePlatform } from 'ern-core'
import fs from 'fs'
import path from 'path'

export default class FsPublisher implements ContainerPublisher {
  get name(): string {
    return 'fs'
  }

  get platforms(): NativePlatform[] {
    return ['android', 'ios']
  }

  public async publish({
    containerPath,
    containerVersion,
    url,
    platform
  }: {
    containerPath: string
    containerVersion: string
    url?: string,
    platform: string
  }) {
    if (!url) {
      throw new Error('url parameter is required')
    }

    if (url && fs.existsSync(url)) {
      if (fs.readdirSync(url).length > 0) {
        throw new Error(
          `${url} directory exists and is not empty.
  Publication directory should either not exist (it will be created) or should be empty.`
        )
      }
    }
  
    shell.mkdir('-p', url)
    shell.cp('-Rf', path.join(containerPath, '{.*,*}'), url)
    if (platform === 'ios') {
      this.patchContainerInfoPlistWithVersion({containerPath: url, containerVersion})
    }
    log.info('[=== Completed publication of the Container ===]')
    log.info(`[Path : ${url}]`)
  }

 /**
   * [iOS Specific]
   * Patch ElectrodeContainer Info.plist to update CFBundleShortVersionString 
   * with the Container version being published
   */
  public patchContainerInfoPlistWithVersion({ 
    containerPath, 
    containerVersion
  } : { 
    containerPath: string, 
    containerVersion: string
  }) {
    const infoPlistPath = path.join(containerPath, 'ElectrodeContainer', 'Info.plist')
    if (fs.existsSync(infoPlistPath)) {
      const infoPlist = fs.readFileSync(infoPlistPath).toString()
      const patchedInfoPlist = infoPlist.replace(
        new RegExp('<key>CFBundleShortVersionString<\/key>\\n\\t<string>.+<\/string>'), 
        `<key>CFBundleShortVersionString</key>\n\t<string>${containerVersion}</string>`)
      fs.writeFileSync(infoPlistPath, patchedInfoPlist) 
    }
  }
}
