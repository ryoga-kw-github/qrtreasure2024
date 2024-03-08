


var c_save_char = ",";


////////////////////////////////////////////////////�I�v�V����

//////////////////////////////////////////////////////�I�v�V��������

function option_save() {
    var bg_v = document.getElementById("bgm_vol").value;
    var se_v = document.getElementById("se_vol").value;

    game_status['bgm_volume'] = setVolume(bg_v);
    document.getElementById("bgm").volume = game_status['bgm_volume'];	//BGM�̃{�����[���ݒ�

    game_status['se_volume'] = setVolume(se_v);

    if (document.getElementById("kidoku_checkbox").checked) {
        skip_switch = 1;
        skip_mode = 1;
    } else {
        skip_switch = 0;
        skip_mode = 0;
    }

    var s = "" + bg_v + c_save_char + se_v + c_save_char + skip_switch;

    setCookie("option", s);	//�N�b�L�[���X�V
    alert("�ݒ��ۑ����܂����B");
    scrollbar_y = getScrollPosition();	//�X�N���[���o�[�̈ʒu���擾���Ă���
    footer_redraw();	//���̃A�C�R����`��
    returnCancel();		//�I�v�V����������
    return;
}
// option_save�̃T�u���[�`��
function setVolume(volumeString) {
    if (volumeString.match(/^[0-9]+$/) != false) {	//�������m�F
        volumeString = parseInt(volumeString);
        if (volumeString > 10)
            volumeString = 10;
        volumeString = volumeString / 10;
    } else {
        volumeString = 0.5;
    }
    return volumeString;
}


///////////////////////////////////////////////�I�����I�����[�h
//�I����
function selectItem(sel_wnd, data, lineNo) {
    var isOk = false;
    var width = SEL_WIDTH;
    var height = SEL_HEIGHT;
    var x = Math.floor((GAME_WIDTH - width) / 2);
    var y = 0;
    var originlineNo = lineNo;

    lineNo++;
    if(sel_wnd != null) deleteSelect(); //�Z���N�g�O�ۑ��΍�
    for (var i = 0; i < SEL_MAX + 1; i++) {
        var d_cmd = data[lineNo].split(" ");		//�X�y�[�X��؂�
        //�A��؂肾�����ꍇ
        if(d_cmd[1] == null){
            d_cmd = data[lineNo].split("�A");		//�A��؂�
        }
        if ((d_cmd[SEL_MSG] === "selectend")
                || (d_cmd[SEL_MSG] === "���I�����I���")) {
            isOk = true;
            break;
        }
        y = (i * 80) + 50;
        sel_wnd[i] = new SELWINDOW(x, y, width, height, d_cmd[SEL_MSG], d_cmd[SEL_HATA]);
        lineNo++;
    }

    if (!isOk) {		//�G���[���b�Z�[�W
        errorAlert("Line : " + originlineNo + " : "
                   + "�I�����I���R�}���h�uselectend�v"
                   + "�܂��́u���I�����I���v������܂���B");
        return sel_wnd;
    }


    return sel_wnd;
}
////////////////////////////////////////////////
//�I�������s
function execSelect(hata) {
    click_flag = true;

   deleteSelect();
    sel_wnd = new Array();

    var ok_flag = goto_return(hata);
    repeat_flag = true;
}

////////////////////////////////////////////
//�I�����폜
function deleteSelect(){
    for (var i = 0; i < sel_wnd.length; i++) {
        sel_wnd[i].remove();
    } 
}

/////////////////////////////////////////////////////////////////wait

/*****************************
 * �w�莞�Ԃ����ҋ@
 * @returns {Boolean}
 */
function t_wait() {
    var f = false;
    click_flag = false;
    timer_cnt--;
    if (timer_cnt <= 0) {
        timer_cnt = 0;
        click_flag = true;
        f = true;
    }

    return f;
}

/////////////////////////////////////////////////////wait�R�}���h�o�^
function waitTime(cnt) {
    timer_cnt = parseInt(cnt / DEFAULT_FPS);
    //char_cut_anime();
    return;
}

//////////////////////////////////////////////////////////////////////
//if�R�}���h
function ifCmd(d_cmd) {
    var variableValue;
    
    var letterNum = user_L_to_N(d_cmd[VAR_LETTER]);
    if (letterNum === -1) {	//�ϐ����Ԉ���Ă���ꍇ�B
        console("Error : variableLetter : " + d_cmd[VAR_LETTER]);
        errorAlert("�ϐ��F" + d_cmd[VAR_LETTER]
                + "\n�ϐ�������������܂���B�ϐ���A����Z�܂łł��B");
        return;
    }
    
     //�퐔�̎擾
    if(getValueFromVariable(d_cmd[VAR_C_NUM]) == null){
       return;
    }
    variableValue = getValueFromVariable(d_cmd[VAR_C_NUM]);

    var isOk = isIfTrue(game_status['user_var'][letterNum], d_cmd[VAR_C_F], variableValue);


    //�����ɍ����Ă�����
    if (isOk) {
        //�W�����v
        var ok_f = goto_return(d_cmd[VAR_IF_HATA]);
        return;
    }

    return;
}

/*
 * ���������������Ԃ�
 * @param {type} target
 * @param {type} sign
 * @param {type} variableValue
 * @returns {isOk|Boolean}
 */
function isIfTrue(target, sign, variableValue){
    isOk = false;
    switch (sign) {
        case ">":
            if (target > variableValue)
                isOk = true;
            break;
        case "<":
            if (target < variableValue)
                isOk = true;
            break;
        case "=":
            if (target === variableValue)
                isOk = true;
            break;
        case "==":
            if (target === variableValue)
                isOk = true;
            break;
        case "!=":
            if (target !== variableValue)
                isOk = true;
            break;
        case ">=":
            if (target >= variableValue)
                isOk = true;
            break;
        case "<=":
            if (target <= variableValue)
                isOk = true;
            break;
    }
    return isOk;
}

//////////////////////////////////////////////////�t���O�v�Z
function flagCal(d_cmd) {
    var variableValue;
    
    var letterNum = user_L_to_N(d_cmd[VAR_LETTER]);
    if (letterNum === -1) {	//�ϐ����Ԉ���Ă���ꍇ�B
        console("Error : variableLetter : " + d_cmd[VAR_LETTER]);
        errorAlert("�ϐ��F" + d_cmd[VAR_LETTER]
                + "\n�ϐ�������������܂���B�ϐ���A����Z�܂łł��B");
        return;
    }

    //�퐔�̎擾
    if(getValueFromVariable(d_cmd[VAR_C_NUM]) == null){
       return;
    }
     variableValue = getValueFromVariable(d_cmd[VAR_C_NUM]);

    switch (d_cmd[VAR_C_F]) {
        case "+":
            game_status['user_var'][letterNum] = game_status['user_var'][letterNum] + variableValue;
            break;
        case "-":
            game_status['user_var'][letterNum] = game_status['user_var'][letterNum] - variableValue;
            break;
        case "*":
            game_status['user_var'][letterNum] = game_status['user_var'][letterNum] * variableValue;
            break;
        case "/":
            game_status['user_var'][letterNum] = game_status['user_var'][letterNum] / variableValue;
            parseInt(game_status['user_var'][letterNum]);
            break;
        case "%":
            game_status['user_var'][letterNum] = game_status['user_var'][letterNum] % variableValue;
            break;
    }
    return;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////���[�U�ϐ��ɒl���
function flagSet(d_cmd) {
    var variableValue;

    var letterNum = user_L_to_N(d_cmd[VAR_LETTER]);
    if (letterNum === -1) {	//�ϐ����Ԉ���Ă���ꍇ�B
        console("Error : variableLetter : " + d_cmd[VAR_LETTER]);
        errorAlert("�ϐ��F" + d_cmd[VAR_LETTER]
                + "\n�ϐ�������������܂���B�ϐ���A����Z�܂łł��B");
        return;
    }

    if(getValueFromVariable(d_cmd[VAR_NUM]) != null){
        variableValue = getValueFromVariable(d_cmd[VAR_NUM]);
        game_status['user_var'][letterNum] = variableValue;
    }

    
    
    return;
}


/************************************************
 * �퐔�̌`����l���擾����
 * @param {type} variableLetter
 * @returns {unresolved}
 */
function getValueFromVariable(variableLetter){
    var variableValue = null;
    var variableNumber = null;
    
    if (variableLetter.match(/[A-Z]/)) {
        variableNumber = user_L_to_N(variableLetter);
        variableValue = game_status['user_var'][variableNumber];
    } else if (checkInteger(variableLetter)) {
        variableValue = parseInt(variableLetter);
    } else {
        console("Error : variableLetter : " + variableLetter);
        errorAlert("�ϐ��̒l�F" + variableLetter
                + "\n�ݒ肷��l������������܂���B�l�͐����ł��B");
    }
    console("variableLetter : " + variableLetter);
    return variableValue;
}

/*********************************
 * �������`�F�b�N����
 * @param {type} str
 * @returns {unresolved}
 */
function checkInteger(str){
    return str.match(/^(0|[1-9]\d*)$/);
}

//////////////////////////////////////////�ϐ��̕����𐔎��ɒu������
function user_L_to_N(c) {
    
    var n = c.charCodeAt(0);
    //A(65)~Z(90)�܂ŁB
    if((n >=65) && (n < 91)){
        return n - 65;
    }else{
        return -1;
    }

}


////////////////////////////////////////////goto�R�}���h
function gotoCmd(d_cmd) {

    var goto_flag = d_cmd[1];		//�T������ޔ�
    var isOk = goto_return(goto_flag);

    return isOk;
}

///////////////////////////////////////////goto����
function goto_return(goto_f) {
    var isOk = false;
    for (var i = 0; i < data.length; i++) {

        var d_cmd = data[i].split(" ");		//�X�y�[�X��؂�
        if ((d_cmd[0] === "#") && (goto_f === d_cmd[1])) {
            game_status['event_flag'] = i;				//�i�s�t���O��������
            isOk = true;
            break;
        } else {
            d_cmd = data[i].split("�A");		//��Ǔ_��؂�
            if ((d_cmd[0] === "����") && (goto_f === d_cmd[1])) {
                game_status['event_flag'] = i;				//�i�s�t���O��������
                isOk = true;
                break;
            }
        }
    }

    if (!isOk) {		//�G���[�̂Ƃ�
        errorAlert("�n�^�F" + goto_f + "\n�n�^��������܂���");
    }

    return isOk;
}


///////////////////////////////////////////////SE�v���C
function sePlay(d_cmd, game, game_status, dataSet) {
    
    if (!game_status['sound_mode']){
        return;
    }
    
    if(checkLoaded(game, dataSet, d_cmd[SE_PATH], false)){
        game.assets[d_cmd[SE_PATH]].play();
    }
    
    return;
}


//////////////////////////////////////////BGM�R�}���h
function bgmStart(d_cmd) {
    game_status['bgm'] = d_cmd[BGM_PATH];
    if (game_status['sound_mode']) {
        //�Đ�����bgm����������~�߂�
        if (audio != null) {
            audio.pause();
        }
        if (env == "mobilesafari"){
            isAudioLoadStart = true;
        }
        else if(userAgent.indexOf('android') != -1){
            game.load(
                game_status['bgm'], 
                "AndroidBGM",
                function(){
                    if(androidBgm != null) bgmStop(null);
                    androidBgm = game.assets["AndroidBGM"];
                    androidBgm.play();
                    androidBgm.src.loop = true;
                }
            );
        }
        else {
            mobileeSafariBGMLoad(game_status['bgm']);
        }

    }
    return;
}



///////////////////////////////////////////�Đ����~
function bgmStop(d_cmd) {

    if (game_status['sound_mode']) {
        if(userAgent.indexOf('android') != -1){
            androidBgm.stop();
        }
        else{
           audio.pause(); 
        }
    }
    
    return;
}

///////////////////////////////////////�L���������R�}���h
/********************************
 * �L����������
 * @param {type} d_cmd
 * @param {type} game_status
 * @returns {mode|String}
 */
function charRm(d_cmd, game_status) {

    charFlagReset(d_cmd[CHAR_POS]);

    return  fixDisplayMode(d_cmd[CHAR_HOWTO], game_status);
}

/////////////////////////////////////�L�����t���O���Z�b�g
function charFlagReset(pos) {

    if ((pos === "l") || (pos === "left") || (pos === "��")) {
        game_status['char_left'] = "";
    } else if ((pos === "c") || (pos === "center") || (pos === "����")) {
        game_status['char_center'] = "";
    } else if ((pos === "r") || (pos === "right") || (pos === "�E")) {
        game_status['char_right'] = "";
    } else if ((pos === "a") || (pos === "all") || (pos === "�S��")) {
        game_status['char_left'] = "";
        game_status['char_right'] = "";
        game_status['char_center'] = "";
    } else {
        game_status['char_left'] = "";
        game_status['char_right'] = "";
        game_status['char_center'] = "";
    }


    return;
}

/////////////////////////////////////////////////////
/////////////////////////////////shake�A�j��
/****************************************
 * �h�炷�R�}���h
 * @param {type} d_cmd
 * @param {type} mode
 * @returns {undefined}
 */
function shake_init(d_cmd, mode, sub_screen) {
    var shake_time = "";
    var shake_pos = "";

    if (mode === "char") {
        shake_time = d_cmd[2];
        shake_pos = fixCharPos(d_cmd[1]);

    } else {
        shake_time = d_cmd[1];
        shake_pos = "bg";
    }

    sub_screen.setShake(shake_pos, getShakeNum(shake_time));

    return;
}

///////////////////////////////////////�L�����R�}���h
/************************
 * �L�������[�h�R�}���h
 * @param {type} d_cmd �R�}���h
 * @param {type} game �Q�[���I�u�W�F�N�g
 * @param {type} game_status �Q�[���̃X�e�[�^�X
 * @param {type} dataSet �f�[�^�Z�b�g
 * @return {type} �`�惂�[�h
 */
function charLoad(d_cmd, game, game_status, dataSet) {

   //�ǂݍ��݃`�F�b�N
    checkLoaded(game, dataSet, d_cmd[CHAR_PATH], true);
    
    //�L�����̗����ʒu�ɑ��
    var pos = fixCharPos(d_cmd[CHAR_POS], game_status);
    game_status[pos] = d_cmd[CHAR_PATH];

    return fixDisplayMode(d_cmd[CHAR_HOWTO], game_status);
}

///////////////////////////////////////�a�f�R�}���h
/*********************************************************
 * BG�R�}���h
 * @param {type} d_cmd �R�}���h
 * @param {type} game �Q�[���I�u�W�F�N�g
 * @param {type} game_status �Q�[���̃X�e�[�^�X
 * @param {type} dataSet �f�[�^�Z�b�g
 * @return {type} �`�惂�[�h
 ******************************************************/
function bgLoad(d_cmd, game, game_status, dataSet) {
    charFlagReset("all");
    
    //�ǂݍ��݃`�F�b�N
    checkLoaded(game, dataSet, d_cmd[BG_PATH], false);
    
    //���݂�URL��ێ�
    game_status['bg'] = d_cmd[BG_PATH];			
    return fixDisplayMode(d_cmd[BG_HOWTO], game_status);
}

///////////////////////////////////////�^�C�g���R�}���h
/*****************************************************
 * title�R�}���h
 * @param {type} d_cmd �R�}���h
 * @param {type} game �Q�[���I�u�W�F�N�g
 * @param {type} game_status �Q�[���̃X�e�[�^�X
 * @param {type} dataSet �f�[�^�Z�b�g
 * @returns {undefined}
 */
function titleLoad(d_cmd, game, game_status, dataSet) {
    
     //�ǂݍ��݃`�F�b�N
    checkLoaded(game, dataSet, d_cmd[BG_PATH], false);
    
    return;
}

/*************************************
 * ���̃f�[�^���s���[�h����
 * @param {type} game �Q�[���I�u�W�F�N�g
 * @param {type} dataSet
 * @returns {undefined}
 */
function nextDataLoad(game, dataSet) {

    var currentNo = dataSet['currentNo'];
    if (currentNo < dataSet['Url'].length) {
        if (!dataSet['isLoaded'][currentNo]) {
            loadImage(dataSet, currentNo);
        } else {
            //���ݎQ�Ƃ��Ă���URL�����[�h�ς݂������ꍇ�A�����ȍ~�̖����[�h��T��
            var notLoadedNo = getNotLoadNo(dataSet, currentNo);
            if (notLoadedNo !== -1) {
                loadImage(dataSet, notLoadedNo);
            }
        }
    } else {
        //��ʂ�Ō�܂Ń��[�h�t���O���s���Ă��܂��Ă���ꍇ�B
        var notLoadedNo = getNotLoadNo(dataSet, 0);
        if (notLoadedNo !== -1) {
            loadImage(dataSet, notLoadedNo);
        }

    }
    return;
}

/**********************
 * �����[�h��URL�z��No��Ԃ�
 * @param {type} dataSet
 * @param {type} index
 * @returns {getNotLoadNo.i|Number}
 */
function getNotLoadNo(dataSet, index) {
    var returnValue = -1;
    for (var i = index; i < dataSet['Url'].length; i++) {
        if (!dataSet['isLoaded'][i]) {
            returnValue = i;
            break;
        }

    }
    return returnValue;
}

/****************************
 * URL�̉摜�����[�h����
 * @param {type} dataSet
 * @param {type} no
 * @returns {undefined}
 */
function loadImage(dataSet, no) {
    preload_flag = true;
    game.load(dataSet['Url'][no], function () {
        //���[�h���I��������̏���
        dataSet['isLoaded'][no] = true;
        dataSet['currentNo'] = no + 1;
        preload_flag = false;
    });
}

////////////////////////////////////////////////////////////////////////////
//�����n

/********************************
 * �f�[�^�̓ǂݍ��݃`�F�b�N
 * @param {type} game
 * @param {type} dataSet
 * @param {type} path
 * @param {type} isRedraw �ǂݍ��ݎ��ɍĕ`�悷�邩
 * @returns {undefined}
 */
function checkLoaded(game, dataSet, path, isRedraw){
    var returnValue = true;
    var imageNumber = urlSearch(dataSet['Url'], path);
     //	��O
     //���[�h����Ă��Ȃ������ꍇ
    if (!dataSet['isLoaded'][imageNumber]) {
        returnValue = false;
        game.load(dataSet['Url'][imageNumber], function () {
            //���[�h���I��������̏���
           dataSet['isLoaded'][imageNumber] = true;
           dataSet['currentNo'] = imageNumber;
           if(isRedraw){
               sub_screen.redraw("cut");
           }
        });
    }
    return returnValue;
}
/***************************************
 * �\�����[�h��Ԃ�
 * @param var howTo �\�����@
 * @param var game_status �Q�[���S�̂̃X�e�[�^�X
 * @return var ���`�ςݕ\�����[�h 
 * 
 **************************************/
function fixDisplayMode(howTo, game_status){
    if ((howTo === "c")
            || (howTo === "cut")
            || (howTo === "�J�b�g")) {
        mode = "cut";
    }
    else if ((howTo === "w")
            || (howTo === "wipe")
            || (howTo === "���C�v")) {
        mode = "wipe";
    }
    else if ((howTo === "f")
            || (howTo === "fade")
            || (howTo === "�t�F�[�h")) {
        mode = "fade";
    }
    else {
        mode = "fade";
    }
    
    if (!game_status['effect_mode'])
        mode = "cut";		//�G�t�F�N�g���[�h���O�̂Ƃ��͋����I�ɃJ�b�g
    if ((game_status['skip_mode'])
            && (read_flag[game_status['event_flag']]) === 1)
        mode = "cut";		//�G�t�F�N�g���[�h���O�̂Ƃ��͋����I�ɃJ�b�g
    return mode;
}

/************************************
 * �L�����̗����ʒu��Ԃ�
 * @param {type} pos
 * @returns {String}
 ************************************/
function fixCharPos(pos){
     if ((pos === "l")
             || (pos === "left")
             || (pos === "��")) {
        return 'char_left';
    }
    else if ((pos === "c")
            || (pos === "center")
            || (pos === "����")) {
        return 'char_center';
    } 
    else if ((pos === "r")
            || (pos === "right")
            || (pos === "�E")) {
        return 'char_right';
    }
    else {
        return 'char_center';
    }
}

/*******************************
 * �h�炷�񐔂�Ԃ�
 * @param {type} howTo
 * @returns {Number} �h�炷��
 */
function getShakeNum(howTo){
    switch (howTo) {
        case "��u":
            return 10;
            break;
        case "����":
            return 50;
            break;
        case "����":
            return 100;
            break;
        case "instant":
            return 10;
            break;
        case "nomal":
            return 50;
            break;
        case "long":
            return 100;
            break;
        default :
            return 10;
            break;

    }
}

/////////////////////////////////////////////////////�t�q�k����
function urlSearch(array_tmp, path) {
    var s_f = -1;

    for (var i = 0; i < array_tmp.length; i++) {
        if (path === array_tmp[i]) {
            s_f = i;
            break;
        }
    }
    return s_f;
}

/***************************
 * �G���[���b�Z�[�W��\������
 * @param {type} message
 * @returns {undefined}
 */
function errorAlert(message){
    message = game_status['event_flag'] + "�s�ڋ߂�--" + message;
    alert(message);
}

/***************************
 * �R���\�[���ɏo��
 * @param {type} message
 * @returns {undefined}
 */
function console(message){
   //console.error('�G���[�̓��e');
}