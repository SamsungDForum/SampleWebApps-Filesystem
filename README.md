# Filesystem

This application demonstrates the usage of `tizen.filesystem` API. With this API it is possible to navigate over virtual filesystem inside the TV.

It is used mainly for providing consistency of data within applications.

The `tizen.filesystem` API also provides a way to read and write to files, but it is
not presented in this app. To learn how to do so, please visit the link from
**Other resources** paragraph.


## How to use the application

Use TV remote controller to navigate. By pressing on the buttons user can see the output from the following methods of the `tizen.filesystem` API:

- **List storages** - `tizen.filesystem.listStorages(onsuccess, onerror)`:
  This method accepts callback functions for success and error. If the method is successful it return an array of available storages.

- **Resolve a location** - `tizen.filesystem.resolve(location, onsuccess, onerror, mode)`:
  With this method it is possible to retrieve certain directory information by passing `location` argument containing path to directory of interest.

- **List files** - `tizen.filesystem.listFiles()`:
  Lists all files in a directory. Note: `File` is an abstract type defining both file and directory. If `File` is a file it has a `isFile` property set to `true`. If `File` is a directory it has a `isDirectory` property set to `true`.


## Supported platforms

2015 and newer


### Privileges and metadata

In order to use `tizen.filesystem` API the following privileges and metadata must be included in `config.xml`:

```xml
<tizen:privilege name="http://tizen.org/privilege/filesystem.read" />
<tizen:privilege name="http://tizen.org/privilege/filesystem.write" />
```

### File structure

```
Filesystem/ - Filesystem sample app root folder
│
├── assets/ - resources used by this app
│   │
│   └── JosefinSans-Light.ttf - font used in application
│
├── css/ - styles used in the application
│   │
│   ├── main.css - styles specific for the application
│   └── style.css - style for application's template
│
├── js/ - scripts used in the application
│   │
│   ├── init.js - script that runs before any other for setup purpose
│   ├── keyhandler.js - module responsible for handling keydown events
│   ├── logger.js - module allowing user to register logger instances
│   ├── main.js - main application script
│   ├── navigation.js - module responsible for handling in-app focus and navigation
│   └── utils.js - module with useful tools used through application
│
├── CHANGELOG.md - changes for each version of application
├── config.xml - application's configuration file
├── icon.png - application's icon
├── index.html - main document
└── README.md - this file
```

## Other resources

*  **Filesystem API**  
  https://developer.samsung.com/tv/develop/api-references/tizen-web-device-api-references/filesystem-api


## Copyright and License

**Copyright 2019 Samsung Electronics, Inc.**

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
