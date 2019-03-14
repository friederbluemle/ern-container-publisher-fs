# Electrode Native File System Container Publisher

This publisher can be used to publish Android and iOS Electrode Native Containers to a local file system directory.

## Usage

### **With `ern publish-container` CLI command**

**Required**

- `--url/-u` : Path to a local directory on the machine running the `publish-container` command. The directory must either not exist or be empty.
- `--publisher/-p` : `fs`
- `--platform` : `android` | `ios`

**Optional**

- `--containerPath` : Path to the Container to publish.  
Defaults to the Electrode Native default Container Generation path (`~/.ern/containergen/out/[platform]` if not changed through config)

- `--containerVersion/-v` : Version of the Container to publish.  
Default to `1.0.0`

 The `ern publish-container` CLI command can be used as follow to manually publish a Container using the fs publisher :

```bash
$ ern publish-container --containerPath [pathToContainer] -p fs -u [pathToDirectory] -v [containerVersion] ---platform [android|ios]
```

### **With Cauldron**

**Required**

- `--publisher/-p` : `fs`
- `--url/-u` : Path to a local directory on the machine running the `cauldron regen-container` command. The directory must either not exist or be empty.

**Optional**


To automatically publish Cauldron generated Containers of a target native application and platform, the `ern cauldron add publisher` command can be used as follow :

```bash
$ ern cauldron add publisher -p fs -u [pathToDirectory]
```

This will result in the following publisher entry in Cauldron :

```json
{
  "name": "fs",
  "url": "[pathToDirectory]"
}
```

This is only needed once. Once the configuration for the publisher is stored in Cauldron, any new Cauldron generated Container will be published to fs.

### **Programatically**

```js
import FsPublisher from 'ern-container-publisher-fs'
const publisher = new FsPublisher()
publisher.publish({
  /* Local file system path to the Container */
  containerPath,
  /* Version of the Container */
  containerVersion,
  /* Local file system path to publication directory */
  url
})
```
