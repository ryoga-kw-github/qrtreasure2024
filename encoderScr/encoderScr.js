/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var helpUrl = "help/command.html";
var originExchangeList = new Array();
var afterExchangeList = new Array();

function exchangeText() {
    var str_msg = "var file_data=new Array(";
    var t = "";
    var s = new Array();
    var i, j;
    //��x�G���[�\�������Z�b�g
    document.getElementById("success").innerHTML = "";
    
    exchangeList();		//�ϊ����X�g���擾
    t = document.getElementById("text_area_1").value;

    s = t.split("\n");
    for (i = 0; i < s.length; i++) {
        var lineNo = i + 1;
        for (j = 0; j < originExchangeList.length; j++) {		//�ϊ�
            if (s[i].indexOf(originExchangeList[j]) != -1) {
                s[i] = s[i].split(originExchangeList[j]).join(afterExchangeList[j]);
            }
        }
        checkCommand(s[i], lineNo);
        str_msg += "'" + s[i] + "',\n";
    }
    str_msg += "'');";
    document.getElementById("text_area_2").value = str_msg;
    alert("�f�[�^��ϊ����܂����B\n�ϊ������f�[�^���e�L�X�g�ɓ\��t���āA�t�@�C�������ustory.js�v�ɕύX���Ă�������");
    return;
}

///////�ϊ����X�g��ϐ��ɕۑ�
function exchangeList() {
    var array_tmp = new Array();
    var line = new Array();
    var str_tmp = document.getElementById("exchange_list").value;
    var i = 0;
    var cnt = 0;

    array_tmp = str_tmp.split("\n");

    for (i = 0; i < array_tmp.length; i++) {
        if (array_tmp[i].indexOf(">") != -1) {		//����>���܂܂��s�Ȃ�
            line = array_tmp[i].split(">");
            originExchangeList[cnt] = line[0];
            afterExchangeList[cnt] = line[1];
            cnt++;
        }
    }
}

///////�ۑ�
function saveStorage() {
    var str_tmp = document.getElementById("exchange_list").value;
    localStorage.setItem("key_exchange_list", str_tmp);
    alert("�ۑ����܂����B");
}
///////���[�h
function loadStorage() {
    document.getElementById("exchange_list").value = localStorage.getItem("key_exchange_list");
}

////////////////////////////////////////////////////////////////////////////////
//�R�}���h�`�F�b�N
function checkCommand(command, lineNo) {
    
    var str_tmp = transrateCommand(command);
    var d_cmd = str_tmp.split(" ");		//�X�y�[�X��؂�

    switch (d_cmd[0]) {
        case "bg":
            checkUsage(d_cmd, "�w�i�R�}���h", 3, lineNo, "#bg");
            fileExistCheck(d_cmd[BG_PATH], lineNo,"img");
            break;
        case "title":
           checkUsage(d_cmd, "�^�C�g���R�}���h", 3, lineNo, "#title");
           fileExistCheck(d_cmd[BG_PATH], lineNo,"img");
            break;

        case "char":
            checkUsage(d_cmd, "�L�����R�}���h", 4, lineNo, "#char");
            fileExistCheck(d_cmd[CHAR_PATH], lineNo,"img");
            break;

        case "rm":
           checkUsage(d_cmd, "�L�����폜�R�}���h", 3, lineNo, "#rm");
            break;

        case "music":
            checkUsage(d_cmd, "���y�R�}���h", 2, lineNo, "#bgm");
           fileExistCheck(d_cmd[BGM_PATH], lineNo,"audio");
            break;

        case "musicstop":
           checkUsage(d_cmd, "���y�X�g�b�v�R�}���h", 1, lineNo, "#musicstop");
            break;

        case "goto":
           checkUsage(d_cmd, "�W�����v�R�}���h", 2, lineNo, "#goto");
            break;

        case "flagset":
            checkUsage(d_cmd, "�ϐ��Z�b�g�R�}���h", 3, lineNo, "#flagset");
            break;

        case "flagcal":
           checkUsage(d_cmd, "�t���O�v�Z�R�}���h", 4, lineNo, "#flagcal");
            break;

        case "if":
             checkUsage(d_cmd, "�����R�}���h", 5, lineNo, "#if");
            break;

        case "select":
           checkUsage(d_cmd, "�I�����R�}���h", 1, lineNo, "#select");
            break;

        case "wait":
           checkUsage(d_cmd, "�E�F�C�g�R�}���h", 2, lineNo, "#wait");
            break;

        case "se":
             checkUsage(d_cmd, "SE�R�}���h", 2, lineNo, "#se");
            fileExistCheck(d_cmd[SE_PATH], lineNo,"audio");
            break;
        case "shake":
            checkUsage(d_cmd, "�V�F�C�N�R�}���h", 2, lineNo, "#shake");
            break;
        case "charshake":
            checkUsage(d_cmd, "�L�����V�F�C�N�R�}���h", 3, lineNo, "#charshake");
            break;

        case "#":
           
            break;

        case "//":
            
            break;
            
        case "debug":
           
            break;

    }

    return;
}

/**********************
 * 
 * @returns {undefined}
 */
function checkUsage(d_cmd, commandName, usageNum, lineNo, commandUsage){
    if(d_cmd.length != usageNum){
        var msg = commandName + "�G���[ (" + lineNo + '�s��) �Q�l�F<a target="_blank" href="' + helpUrl + commandUsage + '">' + commandName + "</a><br>";
        $("#success").append(msg);
    }
}

///////////////////////////////////////////////
//Transrate Japanese Commands to English ones
function transrateCommand(command) {
    var array_tmp = command.split("�A");
    var str_tmp = "";
    switch (array_tmp[0]) {
        case "���w�i":
            str_tmp = "bg";
            break;

        case "���^�C�g��":
            str_tmp = "title";
            break;

        case "���L����":
            str_tmp = "char";
            break;

        case "���L��������":
            str_tmp = "rm";
            break;

        case "�����y":
            str_tmp = "music";
            break;

        case "�����y�X�g�b�v":
            str_tmp = "musicstop";
            break;

        case "���W�����v":
            str_tmp = "goto";
            break;

        case "���t���O�Z�b�g":
            str_tmp = "flagset";
            break;

        case "���t���O�v�Z":
            str_tmp = "flagcal";
            break;

        case "������":
            str_tmp = "if";
            break;

        case "���I����":
            str_tmp = "select";
            break;

        case "���E�F�C�g":
            str_tmp = "wait";
            break;

        case "���r�d":
            str_tmp = "se";
            break;

        case "���V�F�C�N":
            str_tmp = "shake";
            break;
        case "���L�����V�F�C�N":
            str_tmp = "charshake";
            break;

        case "����":
            str_tmp = "#";
            break;
         case "���f�o�b�O":
            str_tmp = "debug";
            break;

        case "//":
            str_tmp = "//";
            break;
    }

    //�����u���������������Ă�����ϊ�
    if (str_tmp !== "") {
        command = command.replace(/�A/g, " ");
        command = command.replace(array_tmp[0], str_tmp);
    }
    return command;
}


function fileExistCheck(filePath, checkLine, tag) {

    if (tag == "img") {
        var img = new Image();
        img.onload = function () {
            console.info('Loaded: ' + filePath + '<br>');
        }
        img.onerror = function () {
            console.info('Failed: ' + filePath + '<br>');
            $("#success").append('�t�@�C��������܂���B' + checkLine + "�s��:" + filePath + "<br>");
        }
        img.src = filePath;
    }
    else{
        var audio = new Audio();
        audio.onload = function () {
            console.info('Loaded: ' + filePath + '<br>');
        }
        audio.onerror = function () {
            console.info('Failed: ' + filePath + '<br>');
            $("#success").append('�t�@�C��������܂���B' + checkLine + "�s��:" + filePath + "<br>");
        }
        audio.src = filePath;
    }

}