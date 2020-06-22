App = window.App || {};
App.Main = (function Main() {
    var contentNamesEl = document.querySelector('.content-name');
    var contentTypesEl = document.querySelector('.content-type');
    var contentPathEl = document.querySelector('.content-path');
    var contentInfoEl = document.querySelector('.content-info');
    var contentListEl = document.querySelector('.content-list');
    var logger = App.Logger.create({
        loggerEl: document.querySelector('.logsContainer'),
        loggerName: 'Main',
        logLevel: App.Logger.logLevels.ALL
    });
    var currentPath = [];
    var currentContents = [];

    function createListItem(text, index) {
        var div = document.createElement('div');

        div.setAttribute('data-index', index);
        div.setAttribute('data-list-item', '');
        div.innerHTML = App.Utils.shortenTitle(text);

        return div;
    }

    function createItemType(file) {
        var type = document.createElement('div');

        if (!file) {
            type.innerHTML = 'Parent Directory';
        } else if (file.isFile) {
            type.innerHTML = 'File';
        } else {
            type.innerHTML = 'Directory';
        }

        return type;
    }

    function onError(error) {
        logger.error(error.message);
    }

    function openParentDirectory() {
        currentPath.pop();
        openDirectory(currentPath);
    }

    function createReturnDir() {
        var returnDir = document.createElement('div');

        returnDir.setAttribute('data-list-item', '');
        returnDir.innerHTML = '..';
        returnDir.classList.add('return-dir');

        return returnDir;
    }

    function showContentInfo(content) {
        contentInfoEl.innerHTML = '';
        Object.getOwnPropertyNames(content)
            .filter(function (propName) {
                return typeof content[propName] !== 'function'
                    && content[propName] !== undefined
                    && propName !== 'parent';
            })
            .forEach(function (propName) {
                var infoDiv = document.createElement('div');

                infoDiv.innerHTML = ['<b>', propName, '</b>', ': ', content[propName]].join('');
                contentInfoEl.appendChild(infoDiv);
            });
    }

    function onActiveItemChanged(activeItem) {
        var index = activeItem.dataset.index;

        App.Utils.scrollToCurrent(contentListEl, activeItem);
        if (index !== undefined) {
            showContentInfo(currentContents[index]);
        } else {
            contentInfoEl.innerHTML = '';
        }
    }

    function handleStorages(storages) {
        currentContents = storages;
        App.Navigation.unregisterMenu('FileTree');
        contentNamesEl.innerHTML = '';
        contentTypesEl.innerHTML = '';

        storages.forEach(function (storage, index) {
            contentNamesEl.appendChild(createListItem(storage.label, index));
            contentTypesEl.appendChild(createItemType(storage));
        });

        showContentInfo(storages[0]);

        App.Navigation.registerMenu({
            name: 'FileTree',
            domEl: contentNamesEl,
            alignment: 'vertical',
            onAfterLastItem: App.Navigation.changeActiveMenu.bind(null, 'Basic'),
            onActiveItemChanged: onActiveItemChanged
        });

        App.Navigation.getMenu('Basic').previousMenu = 'FileTree';

        updateDirectoryPath();
    }

    function handleResolve(content) {
        if (content.isDirectory) {
            App.Navigation.unregisterMenu('FileTree');
            contentNamesEl.innerHTML = '';
            contentTypesEl.innerHTML = '';
            contentInfoEl.innerHTML = '';
            contentNamesEl.appendChild(createReturnDir());
            contentTypesEl.appendChild(createItemType());

            content.listFiles(function (files) {
                currentContents = files;
                files
                    // Files with no name are the directories already listed in storages list
                    // no need to list them as their content recursively calls itself.
                    .filter(function (file) {
                        return file.name;
                    })
                    .forEach(function (file, index) {
                        contentNamesEl.appendChild(createListItem(file.name, index));
                        contentTypesEl.appendChild(createItemType(file));
                    });

                App.Navigation.registerMenu({
                    name: 'FileTree',
                    domEl: contentNamesEl,
                    alignment: 'vertical',
                    onAfterLastItem: App.Navigation.changeActiveMenu.bind(null, 'Basic'),
                    onActiveItemChanged: onActiveItemChanged
                });

                App.Navigation.getMenu('Basic').previousMenu = 'FileTree';
            }, function (error) {
                logger.error(error.message);
                currentPath.pop();
            });
        } else {
            currentPath.pop();
        }

        updateDirectoryPath();
    }

    function openDirectory(dirs) {
        if (dirs.length === 0) {
            tizen.filesystem.listStorages(handleStorages, onError);
        } else {
            tizen.filesystem.resolve(dirs.join('/'), handleResolve, function (error) {
                logger.error(error.message);
                currentPath.pop();
            }, 'r');
        }
    }

    function updateDirectoryPath() {
        var path = currentPath.join('/');
        contentPathEl.innerHTML = '/' + path + (path ? '/' : '');
    }

    window.onload = function () {
        App.KeyHandler.addHandlerForDelegated(
            '.content-name',
            function delegatedHandler(element) {
                if (element.classList.contains('return-dir')) {
                    openParentDirectory();
                } else {
                    currentPath.push(element.innerHTML);
                    openDirectory(currentPath);
                }
            }
        );
        App.Navigation.getMenu('Basic').previousMenu = 'FileTree';

        openDirectory(currentPath);
    };
}());
