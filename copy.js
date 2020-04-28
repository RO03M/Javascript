//Requires
const {dialog} = require('electron').remote;
const fs = require('fs-extra');
//Arrays
var pathArray = [];
var buttons = [];
//Strings
var destiny = "";
//Events
///Select all backup's path
document.querySelector('#buttonBackupPath').addEventListener('click', () => {
   let file = dialog.showOpenDialog({properties: ['openDirectory', 'multiSelections']});
   file.then((promise) => {
      for (let i = 0; i < promise.filePaths.length; i++) {
         pathArray.push(promise.filePaths[i]);
      }

      pathArray = pathTreatment(pathArray);
      if (pathArray.length != 0) addToList(pathArray);
   });
});

///Set destiny to the backup
document.querySelector('#buttonBackupDestiny').addEventListener('click', () => {
   let file = dialog.showOpenDialog({properties: ['openDirectory']});
   file.then((promise) => {
      destiny = promise.filePaths[0];

      destiny = pathTreatment(destiny);
      if (typeof(destiny) !== 'undefined') {
         document.querySelector('.destinyText').innerHTML = destiny;
         document.querySelector('.destinyParent').style.display = 'flex';
      }
   });
});

///Confirm and create backup
document.querySelector('#confirmBackup').addEventListener('click', () => {
   if (destiny == "" || pathArray.length == 0) return console.error('Selecione todos os caminhos necessários!');

   try {
      let backupPath = `${destiny}/Backup ${Time()}`;
      fs.mkdirSync(backupPath);
      let copyPath = backupPath;
      for (let i = 0; i < pathArray.length; i++) {
         console.log(i);
         try {
            fs.copy(pathArray[i], copyPath, (err) => {
               if (err) {
                  console.error(err);
                  return;
               }
               console.log(`Backup de ${pathArray[i]} feito com sucesso!`);
            });
         } catch (err) {
            if (err.code == 'EEXIST') return console.error('Mude o nome do arquivo, pois este já existe!');
            else if (err.code == 'ENOENT') return console.error('Caminho de destino inválido.');
            console.error(err.code);
         }
      }
      console.log('backup terminado');
   } catch (err) {
      console.error(err);
   }
});

///all events that need to check if the click was here or there to something be disabled or enabled
document.addEventListener('click', (e) => {
   let classname = e.target.className;
   let id = e.target.id;
   if (classname == 'trashIcon') {
      pathArray.splice(id, 1);
      addToList(pathArray);
   }

   if (classname != 'editIcon') document.querySelector('.destinyText').setAttribute('contenteditable', false);
});

///enable auto-edit in destiny
document.querySelector('.editIcon').addEventListener('click', (e) => {
   let destinyInput = document.querySelector('.destinyText');
   destinyInput.setAttribute('contenteditable', true);
   destinyInput.focus();
});

//Functions
const GetUnique = (array) => {
   let uniqueArray = [];

   for (let i = 0; i < array.length; i++) {
      if (uniqueArray.indexOf(array[i]) === -1) { //if doesn't find item in array
         uniqueArray.push(array[i]);
      }
   }
   return uniqueArray;
}

const pathTreatment = (path) => {
   if (typeof(path) === "object") {
      path = path.map((item) => {
         return item.split('\\').join('/');
      });
      path = GetUnique(path);
   } else if (typeof(path) === "string")
      path = path.split('\\').join('/');

   return path;
}

const Time = () => {
   let date = new Date();
   return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}(${date.getTimezoneOffset()})${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`;
}

const addToList = (array) => {
   //Cleaning list to avoid repetitions
   let parent = document.querySelector('.pathsList');
   while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
   }
   //Creating news elements for the list
   let list = document.querySelector('.pathsList');
   for (let i = 0; i < array.length; i++) {
      let elementParent = document.createElement('div');//Row
      elementParent.classList.add("elementParent");

      let li = document.createElement('li');//elementList
      li.classList.add('listElements');

      let text = document.createTextNode(array[i]);//pathText

      let deleteButton = document.createElement('span');//delete option
      deleteButton.classList.add('trashIcon');
      deleteButton.setAttribute('id', i);
      // deleteButton.setAttribute('onclick', 'teste()'); //proibido

      li.appendChild(text);
      elementParent.appendChild(li);
      elementParent.appendChild(deleteButton);
      list.appendChild(elementParent);
   }
}


// Testes

function progressChecker(destinyPath, backupsPath) {
   let destinySize = fs.stat(destinyPath, (err, stat) => {
      if (err) return console.error('Something was wrong. error => ' + err);
      return stat.size;
   });

   function filesSize(array) {
      let size = 0;
      for (let i = 0; i < array.length; i++) {
         fs.stat(array[i], (err, stat) => {
            size += stat.size;
         });
      }
      return size;
   }

   let backupsSize = filesSize(backupsPath);

   console.log(`Destiny Size: ${destinySize}\nBackups Total Size: ${backupsSize}`)

}