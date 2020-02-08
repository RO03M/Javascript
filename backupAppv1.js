const fse = require('fs-extra');
const path = require('path');
const prompt = require('prompt-sync')();
var backupPath, dirToBackup, copyPath;
var date = new Date();
var hours = date.getHours();
var minutes = date.getMinutes();
var seconds = date.getSeconds();
var day = date.getDate();
var month = date.getMonth();
var year = date.getFullYear();
var backupName = `${day} ${month} ${year} ${hours} ${minutes} ${seconds}`;

backupPath = prompt('Em qual diretório você deseja salvar os arquivos de backup? ');
dirToBackup = prompt('Coloque o caminho dos arquivos que deseja fazer o backup: ');

try {
    fse.mkdirSync(`${backupPath}/Backup ${backupName}`);
    copyPath = `${backupPath}/Backup ${backupName}`;
    try {
        fse.copy(dirToBackup, copyPath, (err) => {
            if (err) {
                console.log('Algo deu errado :c');
            }
            console.log('Backup feito com sucesso!');
        });
    } catch (err) {
        console.log(err)
    }
} catch (err) {
    console.log(err);
}
