

/////////////////////////////////
//�I�v�V�����摜�̃p�X���擾����B
function getOptionPath(p_path, mode) {
    var path;
    switch (mode) {
        case "sound_mode":
            path = (game_status['sound_mode']) ?
                    'sound_on.png' : 'sound_off.png';
            break;
        case "effect_mode":
            path = (game_status['effect_mode']) ?
                    'effect_on.png' : 'effect_off.png';
            break;
        case "read_mode":
            path = (game_status['skip_mode']) ?
                    'read_on.png' : 'read_off.png';
            break;
        default:
            path = p_path;
            break;
    }

    path = SYS_DATA_PATH + path;
    return path;
}

/////////////////////////////////
//Replace charactors
function replaceCaractor(msg) {
    msg = msg.replace("�z", "�z<br>");
    msg = msg.replace(/��/g, "<br>");
    return msg;
}

//////////////////////////////////�X�g�[���[�f�[�^�������ŉ^�p����Ƃ��̃R�[�h
function dataLoad() {
    var data = file_data;	//�V�i���I�f�[�^�ǂݍ���

    //�f�[�^�̗]�v�ȕ������폜
    //data.splice(0,2);
    for (var i = 0; i < data.length; i++) {
        data[i] = data[i].replace(/\r/g, "");	//���s�폜
        data[i] = data[i].replace(/\n/g, "");
        //data[i] = exchangeStr(data[i]);

        if (data[i] == "") {
            data.splice(i, 1);	//�󔒍s�폜
            i--;				//�����������󔒂̏ꍇ�ɔ�΂����̂�h��
        }
    }

    return data;
}

/*****************************************
 * ���݈ʒu�����ԋ߂��摜���[�h�̈ʒu���擾
 * �߂�l��detaSet�̔�ѐ�̒��ߖ����[�h�̔z��ԍ�
 * @param {type} data
 * @param {type} dataSet
 * @param {type} currentLine
 * @returns {Number} dataSet���̒��߂̖����[�h�̔z��ԍ�
 */
function searchNearImgUrl(data, dataSet, currentLine) {
    var returnLine = 0;
    var pathNo = new Array();
    pathNo["bg"] = BG_PATH;
    pathNo["char"] = CHAR_PATH;
    pathNo["se"] = SE_PATH;
    for (var i = currentLine; i < data.length; i++) {
        var str_tmp = transrateCommand(data[i]);
        var d_cmd = str_tmp.split(" ");		//�X�y�[�X��؂�

        if ((d_cmd[0] === "bg") 
         || (d_cmd[0] === "char") 
         || (d_cmd[0] === "se")){
            
            for (var j = 0; j < dataSet['Url'].length; j++) {
                var path = pathNo[d_cmd[0]];
                if (dataSet['Url'][j] === d_cmd[path]) {
                    //�������̉摜���ǂݍ��܂�Ă��Ȃ��̂Ȃ炻���Ԃ�
                    if (!dataSet['isLoaded'][j]) {
                        returnLine = j;
                        break;
                    }

                }
            }
            if (returnLine !== 0)
                break;
        }
    }
    return returnLine;
}

//////////////////////////////////////////////////////////�������[�h�ύX
function switchingSound() {
    if (game_status['sound_mode']) {
        bgmStop(null);
        game_status['sound_mode'] = false;
    } else {
        game_status['sound_mode'] = true;
        var d_cmd = new Array("bgm", game_status['bgm']);
        bgmStart(d_cmd);
    }
    saveOption();
    return;
}

//////////////////////////////////////////////////////////�G�t�F�N�g���[�h�ύX
function switchingEffect() {

    game_status['effect_mode'] = (game_status['effect_mode']) ? false : true;
    saveOption();
    return;
}
//////////////////////////////////////////////////////////���ǃ��[�h�ύX
function switchingRead() {
    game_status['skip_mode'] = (game_status['skip_mode']) ? false : true;
    saveOption();
    return;
}


///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////
//�I�v�V������\��
function displayOption() {
     click_flag = false;
     var modalBg = new MODALBG(GAME_WIDTH, GAME_HEIGHT);
     modalBg.option = makeOptionItem(modalBg);
}

/******************************************************************
 * �I�v�V�����A�C�e�����쐬����
 * @param {type} modalBg �e���[�_��
 * @returns {Array|makeOptionItem.option_item}
 */
function makeOptionItem(modalBg) {
    var w = 200;
    var x = 95;
    var y = 50;
    var option_item = new Array();
    option_item['load'] = new OPTIONBUTTON(x, y, w, w, 'load.png', 'load', modalBg);
    option_item['save'] = new OPTIONBUTTON(x + w + 50, y, w, w, 'save.png', 'save', modalBg);
    option_item['backlog'] = new OPTIONBUTTON(x, y + w + 50, w, w, 'backlog.png', 'backlog', modalBg);
    option_item['sound'] = new OPTIONBUTTON(x + w + 50, y + w + 50, w, w, 'sound_on.png', 'sound_mode', modalBg);
    option_item['effect'] = new OPTIONBUTTON(x, y + (w + 50) * 2, w, w, 'effect_on.png', 'effect_mode', modalBg);
    option_item['read'] = new OPTIONBUTTON(x + w + 50, y + (w + 50) * 2, w, w, 'read_on.png', 'read_mode', modalBg);
    return option_item;
}

///////////////////////////////////////
/////////////////////////////////////
//�Z�[�u�ƃ��[�h�̈����������
function displaySaveArea(mode, modalBg) {
    var w = 200;
    var x = 95;
    var y = 50;
    var margin = 50;
    var save_item = new Array();
    var type = "";
    var path;

    if (mode === "save") {
        type = "save_wnd";
        path = 'save_base.png';
    } else if (mode === "load") {
        type = "load_wnd";
        path = 'load_base.png';
    }

    for (var i = 0; i < SAVE_MAX; i++) {
        var init_x = (i % 2 === 0) ? x : x + w + margin;
        var str_msg = makeSaveList(i, type);
        var save_name = "DATA " + i;
        save_item[i] = new SAVEWINDOW(init_x, y, w, w,
                                      path, type, str_msg, save_name, modalBg);

        //�Q�i�ڂ̏���
        if (i % 2 === 1) {
            y += w + margin;
        }

    }

    return save_item;
}
/////////////////////////////////local�ɕۑ�
function save(save_name, modalBg) {
    if (!confirm(save_name + "�ɃZ�[�u�����܂��B��낵���ł����H"))
        return;

    save_len_make(save_name);
    alert("�Q�[���̃f�[�^��ۑ����܂����B\n");
    modalBg.remove();   //�e���[�_�����Ɣj��

    return;
}
////////////////////////////////////////////////////////
//�\���̈�쐬�Btype = save or load
function makeSaveList(no, type) {
    var str_tmp = "";
    var str_msg = "";
    str_tmp = "DATA " + no;

    try {
        var array_tmp = JSON.parse(localStorage.getItem(str_tmp));
    } catch (e) {
        storageError();
        return;
    }
    //str_msg += '<div onClick="' + type + '(\''+str_tmp+'\')">';
    if (array_tmp == null){
        str_msg += "�Ȃ�";
    } else {
        str_msg += str_tmp + "<br>"
                + array_tmp['timestamp'] + "<br>"
                + array_tmp['msg'];
    }
    return str_msg;
}

///////////////////////////coockie�ɕۑ�����Ƃ��̕�������쐬
function save_len_make(save_name) {
  
    //�I�u�W�F�N�g�����AJSON�`���ŕۑ�
    var obj = {
        timestamp      : getDateString(),
        event_flag     : game_status['event_flag'] - 1,
        char_left      : game_status['char_left'],
        char_center    : game_status['char_center'],
        char_right     : game_status['char_right'],
        bg             : game_status['bg'],
        bgm            : game_status['bgm'],
        user_val       : game_status['user_var'].join(","),
        msg            : data[game_status['event_flag'] - 1].substr(0, 20) + "�c", //���̂Ƃ��̓ǂ�ł��镶�̓f�[�^��o�^
        kidoku         : readMake()
    };

    localStorage.setItem(save_name, JSON.stringify(obj));
    return;
}

/*************************
 * ���̎������擾����
 * @returns {String}
 */
function getDateString(){
    var date_nowdate = new Date();				//���t�擾
    var date_year = date_nowdate.getFullYear();
    var date_month = date_nowdate.getMonth() + 1;
    var date_date = date_nowdate.getDate();
    var date_hour = date_nowdate.getHours();
    var date_min = date_nowdate.getMinutes();
    
    return date_year + "/" + date_month + "/" + date_date + " "
            + date_hour + ":" + date_min;	//���t�̕�����쐬

}

/////////////////////////////////////���ǃt���O�ۑ����̕�����쐬
function readMake() {
    var i;
    var start = 0;
    var end = 0;
    var start_f = read_flag[0];		//��ԍŏ��̍s�̃t���O
    var return_s = "";

    for (i = 0; i < data.length; i++) {

        if (start_f != read_flag[i]) {
            end = i - 1;	//�t���O���ς���O������-1
            return_s += start + ":" + end + ":" + start_f + ",";

            start_f = read_flag[i];
            start = i;
        }
    }

    //�Ō�̏����B�Ō�̃u���b�N�͂��̂܂ܔ�����̂ŕ`�����܂�Ȃ��B�����h��
    end = i;	//�t���O���ς���O������-1
    return_s += "" + start + ":" + end + ":" + start_f + ",";

    return return_s;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////���[�h

function saveDataLoad(save_name, modalBg) {

    try {
        var s = JSON.parse(localStorage.getItem(save_name));
    } catch (e) {
        storageError();
        return;
    }

    if (s == null) {
        alert("�ۑ����ꂽ�Z�[�u�f�[�^�͂���܂���B");
        return;
    }

    game_status['event_flag'] = parseInt(s['event_flag']);		//�C�x���g�t���O���[�h
    
    ////////////////////////////////////////////BG���[�h
    if (s['bg'] !== "") {
        game_status['bg'] = s['bg'];		//���݂�URL��ێ�
    } else {
        game_status['bg'] = "";		//���݂�URL��ێ�
    }

    /////////////////////////////////////�l�����[�h
    //��
    if (s['char_left'] !== "") {
        game_status['char_left'] = s['char_left'];
    } else {
        game_status['char_left'] = "";
    }

    //����
    if (s['char_center'] !== "") {
        game_status['char_center'] = s['char_center'];
    } else {
        game_status['char_center'] = "";
    }

    //�E
    if (s['char_right'] != "") {
        game_status['char_right'] = s['char_right'];
    } else {
        game_status['char_right'] = "";
    }

    ////////////////////////////////////////////BGM���[�h
    if (s['bgm'] !== "") {
        var d_cmd = new Array();
        d_cmd[BGM_PATH] = s['bgm'];
        bgmStart(d_cmd);
        game_status['bgm'] = s['bgm'];
    } else {
        game_status['bgm'] = "";
    }

 
    ////////////////////////////////////////////�ϐ����[�h
    var d = s['user_val'].split(",");	//�f�[�^�؂蕪��
    for (var i = 0; i < USER_VAR_MAX; i++) {
        game_status['user_var'][i] = parseInt(d[i]);
    }
   
    kidoku_load(s['kidoku']);
    modalBg.remove();   //�e���[�_�����Ɣj��
    clickSelector();
    sub_screen.redraw("fade");
    return;
}
//////////////////////////////���Ǖ������[�h
function kidoku_load(kidoku_str) {
    var section = new Array();
    var line_data = new Array();
    section = kidoku_str.split(",");

    for (var i = 0; i < section.length; i++) {
        line_data = section[i].split(":");
        for (var j = parseInt(line_data[0]); j <= parseInt(line_data[1]); j++) {
            read_flag[j] = parseInt(line_data[2]);
        }

    }

    return;
}

///////////////////////////////
//�C�x���g�t���O�̎�����r����s���[�h
function loadPreload(game, data, dataSet, flag) {
    var index = searchNearImgUrl(data, dataSet, flag);
    if(index !== 0){
        dataSet['currentNo'] = index;
    }

    nextDataLoad(game, dataSet);
}


/////////////////////////////////////////////////////////////////////////////////////////////
//�I�v�V�����Z�[�u(�Q�[���X�e�[�^�X�����̂܂ܕۑ�)
function saveOption() {
    var save_name = "tj_option";
    localStorage.setItem(save_name, JSON.stringify(game_status));
}

/////////////////////////////////////////////////////////////////////////////////////////////
//�I�v�V�������[�h
function loadOption() {
    var save_name = "tj_option";
    try {
        var s = JSON.parse(localStorage.getItem(save_name));
        //�f�[�^���Ȃ�������߂�
        if (s == null)
            return;

        game_status['sound_mode'] = s['sound_mode'];
        game_status['effect_mode'] = s['effect_mode'];
        game_status['skip_mode'] = s['skip_mode'];
    } catch (e) {
        storageError();
    }


}
//////////////////////////////////////////////////////////////////////////
function storageError() {
    var str = "�I�v�V�������[�h�Ɏ��s���܂����B"
            + "IE�̏ꍇ�A�C���^�[�l�b�g�I�v�V�������ڍאݒ聄�Z�L�����e�B�́uDOM�X�g���[�W��L���ɂ���v�Ƀ`�F�b�N�����肢�v���܂��B"
            + "\n�܂����[�J�����ł�IE�͎g�p�ł��܂���̂�Chrome��Firefox�Ȃǂ̃u���E�U�����g�p���������B";
    alert(str);
    return;
}


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////�o�b�N���O�o��
function drawBackLog(backLog) {

    document.getElementById("enchant-stage").style.display = "none";
    document.getElementById("OPTION").innerHTML = makeBackLogPage(backLog);
    document.getElementById("OPTION").style.left = "0px;";
    location.href = "index.html#latest";

    return;
}


////////////////////////////////////////////////////////////
//�o�b�N���O�쐬
function makeBackLogPage(backLog){
    var html = [
        '<header class="fontFrame">BackLog</header>',
        '<div class="BackLogMain">',
        backLog,
        '<a name="latest"></a>',
        '</div>',
        '<button onClick="vanishBackLog()">�߂�</button>'
    ];
    
    return html.join("");
    
}

/////////////////////////////////////////////////////////
//�o�b�N���O�폜
function vanishBackLog(){
    document.getElementById("OPTION").innerHTML = "";
    document.getElementById("enchant-stage").style.display = "inline";
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//�u���E�U����
function judge_browser() {
    if (navigator.userAgent.indexOf("MSIE") !== -1) { // ������ɁuMSIE�v���܂܂�Ă���ꍇ
        browser_type = "IE";
    } else if (navigator.userAgent.indexOf("firefox") !== -1) { // ������ɁuFirefox�v���܂܂�Ă���ꍇ
        browser_type = "FF";
    } else if (navigator.userAgent.indexOf("Chrome") !== -1) { // ������ɁuNetscape�v���܂܂�Ă���ꍇ
        browser_type = "chrome";
    } else if (navigator.userAgent.indexOf("Safari") !== -1) { // ������ɁuSafari�v���܂܂�Ă���ꍇ
        browser_type = "safari";
    } else {
        browser_type = "other";
    }

    return browser_type;
}