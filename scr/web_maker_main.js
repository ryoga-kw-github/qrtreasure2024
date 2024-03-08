/* global PRELOAD_MAX */
enchant();

var game;
var msg_wnd;
var main_screen;
var sub_screen;
var debug_wnd;

var VERSION            = "ver1.0";	//�o�[�W�������
var DEBUG_MODE         = false;		//�f�o�b�O���[�h
var read_flag          = new Array();	//Read flags
var preload_flag       = false;		//�摜���[�h���Ƀ��[�h�����Ŏ��s����̂Ń��b�N��������
var preload_turn_num   = 0;		//��s�摜���[�h�̏���

var click_flag         = true;		//Click control
var timer_cnt          = 0;		//Use wait command

var data               = new Array();
var sel_wnd            = new Array();
var dataSet            = new Array();  //BG,Char,SE��URL�A���[�h�t���O�ێ��p
var backLog            = "";           //�o�b�N���O�ۊǗp

var env                = enchant.ENV.BROWSER;
var userAgent          = getUserAgent();
var audio              = null;         //iOS�paudio
var isAudioLoadStart   = false;        //true�ɂȂ�����^�b�`�C�x���g��BGM���[�h
var androidBgm;

//�ۑ��Ɏg���ϐ��Q
var game_status = {
    event_flag    : 0,
    char_left     : "",
    char_center   : "",
    char_right    : "",
    bg            : "",
    bgm           : "",
    sound_mode    : true,
    effect_mode   : true,
    skip_mode     : false,
    user_var      : new Array(),
    bgm_volume    : 0.5,
    se_volume     : 0.5
};

/////////////////////////////////////////////////////
//initiation
window.onload = function () {
   
    enchant.Sound.enabledInMobileSafari = true;
    game = new Core(GAME_WIDTH, GAME_HEIGHT);
    game.fps = DEFAULT_FPS;
    game.touched = false;
    
    //Load and fix scenario data
    data = dataLoad();

    //Initiate Read flags
    for (var i = 0; i < data.length; i++) {
        read_flag[i] = 0;
    }
    //Initiate user varibles
    for (var i = 0; i < USER_VAR_MAX; i++) {
        game_status['user_var'][i] = 0;
    }
   

    game.preload(
            SYS_DATA_PATH + 'msg_wnd.png',
            SYS_DATA_PATH + 'select_wnd.png',
            SYS_DATA_PATH + 'setting.png',
            SYS_DATA_PATH + 'load.png',
            SYS_DATA_PATH + 'save.png',
            SYS_DATA_PATH + 'backlog.png',
            SYS_DATA_PATH + 'sound_on.png',
            SYS_DATA_PATH + 'sound_off.png',
            SYS_DATA_PATH + 'effect_on.png',
            SYS_DATA_PATH + 'effect_off.png',
            SYS_DATA_PATH + 'read_on.png',
            SYS_DATA_PATH + 'read_off.png',
            SYS_DATA_PATH + 'save_base.png',
            SYS_DATA_PATH + 'load_base.png',
            SYS_DATA_PATH + 'black.jpg'
    );
            
    dataSet = initDataSet();                 //�f�[�^�Z�b�g�̏�����
    dataSet = dataUrlGet(data, dataSet);     //�S�̂̂t�q�k�擾
    dataSet = initIsLoaded(dataSet);
    dataSet = initDataLoad(dataSet);	     //��s���[�h
    loadOption();
    
    
    var box = document.getElementById("enchant-stage");

    //iOS�����p�̃^�b�`�C�x���g
    box.addEventListener('touchstart', function (e) {
        if ((env == "mobilesafari")&& (isAudioLoadStart)) {
            mobileeSafariBGMLoad(game_status['bgm']);
            isAudioLoadStart = false;
        }
    });
   
    
    game.onload = function () {
        main_screen = new MAINSCREEN();
        sub_screen = new SUBSCREEN(main_screen);
        msg_wnd = new MSGWINDOW();
        var setting_icon = new IMGBUTTON(0, 0, 80, 80,
                                         SYS_DATA_PATH + 'setting.png',
                                         'setting');
        game.rootScene.addEventListener(Event.TOUCH_START, function (e) {
        clickSelector();
            
        });
         
        //���C����o�^
        game.rootScene.addEventListener('enterframe', main);
        clickSelector();
    };
    game.start();
    window.scrollTo(0,1);
    //option_load();
};


//////////////////////////////////////////////
//Game loop
function main() {
    //wait���ݒ肳��Ă���ꍇ
    if (timer_cnt > 0) {
        if (t_wait()) {
            clickSelector();
        }
    }
}

/////////////////////////////////////////////////�N���b�N���b�N���͉������Ȃ�(�N���b�N���ԁj
function clickSelector() {
    var repeat_flag = false;
    
    if (click_flag) {
        repeat_flag = mainEvent();
    }

    //if repeatFlag is true, continue this routine
    if (repeat_flag){
        clickSelector();
    }
    return;
}
////////////////////////////////////////////////////////////////////////////////
//���C���̃C�x���g����
function mainEvent() {

    var repeat_flag = false;
    var str_tmp = transrateCommand(data[game_status['event_flag']]);
    var d_cmd = str_tmp.split(" ");		//�X�y�[�X��؂�

    switch (d_cmd[0]) {
        case "bg":
            var howTo = bgLoad(d_cmd, game, game_status, dataSet);
            //�\��
            sub_screen.redraw(howTo);
            click_flag = false;
            break;
        case "title":
            titleLoad(d_cmd, game, game_status, dataSet);
            var titlebuff = new TITLESCREEN(d_cmd[BG_PATH]);
            click_flag = false;
            break;

        case "char":
            var howTo = charLoad(d_cmd, game, game_status, dataSet);
            //�\��
            sub_screen.redraw(howTo);
            click_flag = false;
            break;

        case "rm":
            var howTo = charRm(d_cmd, game_status);
            sub_screen.redraw(howTo);
            break;

        case "music":
            bgmStart(d_cmd);
            repeat_flag = true;
            break;

        case "musicstop":
            bgmStop(d_cmd);
            repeat_flag = true;
            break;

        case "goto":
            var isOk = gotoCmd(d_cmd);
            if(isOk){
                loadPreload(game, data, dataSet, game_status['event_flag']);
            }
            repeat_flag = true;
            break;

        case "flagset":
            flagSet(d_cmd);
            repeat_flag = true;
            break;

        case "flagcal":
            flagCal(d_cmd);
            repeat_flag = true;
            break;

        case "if":
            ifCmd(d_cmd);
            repeat_flag = true;
            break;

        case "select":
            sel_wnd = selectItem(sel_wnd, data, game_status['event_flag']);
            game_status['skip_mode'] = false;	//�X�L�b�v��U�X�g�b�v
            game_status['event_flag']--;        //save�̎��̂��߂�-1���Ƃ�
            click_flag = false;
            break;

        case "wait":
           if(!checkInteger(d_cmd[TIME_NUM])){
               errorAlert("�ϐ��̒l�F" + d_cmd[TIME_NUM]
                + "\n�ݒ肷��l������������܂���B�l�͐����ł��B");
                repeat_flag = true;
           }
            waitTime(parseInt(d_cmd[TIME_NUM]));
            break;

        case "se":
            sePlay(d_cmd, game, game_status, dataSet);
            repeat_flag = true;
            break;
        case "shake":
            shake_init(d_cmd, "bg", sub_screen);
            click_flag = false;
            break;
        case "charshake":
            shake_init(d_cmd, "char", sub_screen);
            break;

        case "#":
            repeat_flag = true;
            break;

        case "//":
            repeat_flag = true;
            break;
            
        case "debug":
            DEBUG_MODE = true;
            debug_wnd = new DEBUGWINDOW();
            repeat_flag = true;
            break;

            //�R�}���h�ł͂Ȃ��Ȃ烁�b�Z�[�W�\��
        default:
            if(sel_wnd != null) deleteSelect();     //�Z���N�g�ۑ����̑΍�
            msg_wnd.text(data[game_status['event_flag']]);
            backLog += data[game_status['event_flag']] + "<br>";   //�o�b�N���O�ۊ�
            
            break;
    }



    if ((game_status['skip_mode']) && (read_flag[game_status['event_flag']] === 1)) {
        repeat_flag = true;
    }
    read_flag[game_status['event_flag']] = 1;			//���ǃt���Oon

    game_status['event_flag']++;		//�C�x���g�t���O���C���N�������g
    
    //��s���[�h
    nextDataLoad(game, dataSet);

    return repeat_flag;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * �f�[�^�Z�b�g������
 * @param var dataSet �f�[�^�z��
 * @return var ���������ꂽ�z��f�[�^
 */
function initDataSet() {
    var dataSet         = new Array();
    dataSet['Url']       = new Array();
    dataSet['isLoaded']  = new Array();
    dataSet['currentNo'] = 0;
    
    return dataSet;
}
///////////////
/******************************************
 * �摜��s���[�h
 * @param var dataSet �f�[�^�z��
 * @return var ���������ꂽ�z��f�[�^
 ******************************************/
function initDataLoad(dataSet) {
    var max;
    var array_tmp = new Array();
    
    //��s�ǂݍ��ݍő吔����
    var max = (dataSet['Url'].length > PRELOAD_MAX) ? PRELOAD_MAX : dataSet['Url'].length;
    for (var i = 0; i < max; i++) {
        array_tmp.push(dataSet['Url'][i]);
        dataSet['isLoaded'][i] = true;
    }
    dataSet['currentNo'] = max;

    //�ǂݍ���
    game.preload(array_tmp);
    game.onerror = function(){
      alert("�摜�A���̓ǂݍ��݂Ɏ��s���܂����B\n�t�@�C�������݂��邩���m�F���������B");  
    };
    
    return dataSet;
}

////////////////////////////////////�X�N���v�g���̂t�q�k�擾
/*
 * �X�N���v�g���̃��[�h����URL���W
 * @param var data �X�N���v�g�f�[�^
 * @param var dataSet URL�ۑ���
 * @return var URL�ۑ���
 */
function dataUrlGet(data, dataSet) {

    for (var i = 0; i < data.length; i++) {
        //Transrate
        var str_tmp = transrateCommand(data[i]);
        var d_cmd = str_tmp.split(" ");		//�X�y�[�X��؂�
        switch (d_cmd[0]) {
            case "bg":
                if(!checkLoadedUrl(dataSet['Url'], d_cmd[BG_PATH])){
                     dataSet['Url'].push(d_cmd[BG_PATH]);
                }
                break;

            case "title":
                if(!checkLoadedUrl(dataSet['Url'], d_cmd[BG_PATH])){
                    
                     dataSet['Url'].push(d_cmd[BG_PATH]);
                }
                break;

            case "char":
                if(!checkLoadedUrl(dataSet['Url'], d_cmd[CHAR_PATH])){
                    
                     dataSet['Url'].push(d_cmd[CHAR_PATH]);
                }
                break;
                
            case "se":
                if(!checkLoadedUrl(dataSet['Url'], d_cmd[SE_PATH])){
                   
                     dataSet['Url'].push(d_cmd[SE_PATH]);
                }
                break;
                
        }

    }
    return dataSet;
}


function initIsLoaded(dataSet){
    for(var i = 0; i < dataSet['Url'].length; i++){
        dataSet['isLoaded'][i] = false;
    }
    return dataSet;
}

////////////////////////////////////////////////////////
//�Y��URL���܂܂�Ă��邩�`�F�b�N
function checkLoadedUrl(urlArray, targetUrl) {
    var isLoaded = false;
    for (var i = 0; i < urlArray.length; i++) {
        if (urlArray[i] === targetUrl) {
            isLoaded = true;
            break;
        }
    }
    return isLoaded;
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
        case "��":
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

/******************
 * iOS�pBGM�ǂݍ���
 * @param {type} bgmPath
 * @returns {undefined}
 */
function mobileeSafariBGMLoad(bgmPath) {
    audio = new Audio(bgmPath);
    audio.load();
    audio.volume = game_status['bgm_volume'];
    audio.addEventListener('canplaythrough', function () {
        audio.play();
    }, false);
    audio.addEventListener("ended", function () {
        audio.play();
    }, false);

}

////////////////////////////
//���[�U�[�G�[�W�F���g�擾

function getUserAgent(){
	return window.navigator.userAgent.toLowerCase();
}


function debugDataSet(){
    var s = "";
    for(var i = 0; i < dataSet['Url'].length; i++){
        s += dataSet['isLoaded'][i] + " : " + dataSet['Url'][i] + "\n";
    }
    alert(s);
}