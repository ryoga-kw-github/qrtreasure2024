/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
//���C���\���N���X
var MAINSCREEN = enchant.Class.create(enchant.Sprite, {
    initialize: function () {

        enchant.Sprite.call(this, GAME_WIDTH, GAME_MAIN_HEIGHT);
        this.image = game.assets[SYS_DATA_PATH + 'black.jpg'];
        this.x = 0;
        this.y = 0;

        //�A�j���[�V�����ݒ�
        this.addEventListener('enterframe', function () {

        });
        game.rootScene.addChild(this);
    },
    redraw: function (image) {
        this.image = image;
    }
});
///////////////////////////////////////////////////////////////////////
//�o�b�t�@�N���X
var SUBSCREEN = enchant.Class.create(enchant.Sprite, {
    initialize: function (main_screen) {

        enchant.Sprite.call(this, GAME_WIDTH, GAME_MAIN_HEIGHT);
        this.image = game.assets[SYS_DATA_PATH + 'black.jpg'];
        this.x = 0;
        this.y = 0;
        this.age = 0;
        this.opacity = 0;
        this.wipe_mx = -32;
        this.shake_time = 0;	//�V�F�C�N�̎��Ɏg�p
        this.shake_pos = "";	//�V�F�C�N�̎��Ɏg�p
        this.animationFlag = "none";
        this.main_screen = main_screen;
        this.startColumnOffset = 20;    //���C�v���̈��ʕ`��̏c���C����
        //���C�v�p�̉摜�ۑ��o�b�t�@
        this.buffer = new Surface(GAME_WIDTH, GAME_MAIN_HEIGHT);
        //�A�j���[�V�����ݒ�
        this.addEventListener('enterframe', function (main_screen) {
            //�J�b�g
            if (this.animationFlag == "cut") {
                this.opacity = 1;
                this.end();
            }
            //���C�v
            else if (this.animationFlag == "wipe") {
                var startColumnOffset = this.startColumnOffset;
                var numColumn = GAME_WIDTH / startColumnOffset;
                for (var i = 0; i < numColumn; i++) {
                    var startColumn = i * startColumnOffset;	//x���W�̊J�n�ʒu���v�Z
                    var widthColumn = i + this.wipe_mx;         //�����v�Z
                    if ((widthColumn > startColumnOffset)||(widthColumn < 0)){
                        widthColumn = 0;
                    }
                    //1�`20�h�b�g�̃T�C�Y�ɂȂ鎞�����R�s�[	
                    try {
                        if (widthColumn > 0) {
                            this.buffer.draw(game.assets[game_status['bg']],
                                    startColumn + widthColumn, 0, 1, GAME_MAIN_HEIGHT,
                                    startColumn + widthColumn, 0, 1, GAME_MAIN_HEIGHT);
                        }
                    } catch (e) {
                    }

                }
                this.image = this.buffer;
                this.wipe_mx++;			//�S�̂̃J�E���^�[��+1
                if (this.wipe_mx > this.startColumnOffset) {
                    this.end();
                }
            }
            //�t�F�[�h
            else if (this.animationFlag === "fade") {
                this.opacity += 0.1;
                if (this.opacity >= 1.0)
                    this.end();
            }
            //�V�F�C�N
            else if (this.animationFlag === "shake") {
                var r = Math.floor(Math.random() * 100) - 50;
                if (this.shake_time < 2)
                    r = 0;	//�����l�ɖ߂��ĕ`�悳����;
                var bg_left_x = (this.shake_pos === "bg") ? r : 0;
                var char_left_x = (this.shake_pos === "char_left") ? r : 0;
                var char_center_x = (this.shake_pos === "char_center") ? r : 0;
                var char_right_x = (this.shake_pos === "char_right") ? r : 0;
                
                var suf = this.subCharRedraw(bg_left_x, char_left_x, char_center_x, char_right_x);

                this.image = suf;
                this.shake_time--;
                if (this.shake_time <= 0) {
                    this.end();
                }
            }
        });
        game.rootScene.addChild(this);
    },
    end: function () {
        this.main_screen.redraw(this.image);
        this.opacity = 0;
        this.wipe_mx = -1 * GAME_WIDTH / this.startColumnOffset;
        this.animationFlag = "none";
        if ((game_status['skip_mode']) && (read_flag[game_status['event_flag']] === 1))
            repeat_flag = true;
        click_flag = true;
        clickSelector();
    },
    setShake: function (s_pos, s_time) {
        //�V�F�C�N���̏�����
        this.animationFlag = "shake";
        this.shake_time = s_time;
        this.shake_pos = s_pos;
        this.opacity = 1;
    },
    redraw: function (howto) {
        this.x = 0;
        this.y = 0;
        this.age = 0;
        //�L�����̏�������
        var suf = this.subCharRedraw(0, 0, 0, 0);

        if (howto === "wipe") {
            //this.image = this.main_screen.image;
            this.buffer = this.main_screen.image;
        } else {
            this.image = suf;
        }
        suf = null;
        this.animationFlag = howto;

    },
    //�L��������������
    subCharRedraw: function (offsetBgX, offsetCharLeftX, offsetCharCenterX, offsetCharRightX) {
        var suf = new Surface(GAME_WIDTH, GAME_MAIN_HEIGHT);
        
        //�w�i��`��
        suf.draw(game.assets[game_status['bg']], 0 + offsetBgX, 0);

        //�l������
        if (game_status['char_left'] !== "") {
            try {
                var x = 0 + CHAR_LEFT_OFFSET;
                x += offsetCharLeftX;
                var y = GAME_MAIN_HEIGHT - game.assets[game_status['char_left']].height;
                if(y < 0) y = 0;
                
                suf.draw(game.assets[game_status['char_left']], x, y);
            } catch (e) {
                //if (DEBUG_MODE)
                    errorAlert("�摜���݂���܂���:" + game_status['char_left']);
            }
        }

        if (game_status['char_center'] !== "") {
            try {
                var x = (GAME_WIDTH - game.assets[game_status['char_center']].width) / 2;
                x += offsetCharCenterX;
                var y = GAME_MAIN_HEIGHT - game.assets[game_status['char_center']].height;
                if(y < 0) y = 0;
                suf.draw(game.assets[game_status['char_center']], x, y);
            } catch (e) {
                //if (DEBUG_MODE)
                    errorAlert("�摜���݂���܂���:" + game_status['char_center']);
            }
        }

        if (game_status['char_right'] !== "") {
            try {
                var x = GAME_WIDTH - game.assets[game_status['char_right']].width + CHAR_RIGHT_OFFSET;
                x += offsetCharRightX;
                var y = GAME_MAIN_HEIGHT - game.assets[game_status['char_right']].height;
                if(y < 0) y = 0;
                suf.draw(game.assets[game_status['char_right']], x, y);
            } catch (e) {
                //if (DEBUG_MODE)
                    errorAlert("�摜���݂���܂���:" + game_status['char_right']);
            }

        }
        
        return suf;
    }
});

///////////////////////////////////////////////////////////////////////
//���C���\���N���X
var TITLESCREEN = enchant.Class.create(enchant.Sprite, {
    initialize: function (path) {

        enchant.Sprite.call(this, GAME_WIDTH, GAME_HEIGHT);
        this.image = game.assets[path];
        this.opacity = 0;
        this.x = 0;
        this.y = 0;
        this.animationFlag = "start";

        //�\�����Ƀ^�b�`���ꂽ��
        this.addEventListener('touchstart', function (e) {
            if (this.animationFlag === "stop")
                this.end();
        });

        //�A�j���[�V�����ݒ�
        this.addEventListener('enterframe', function () {
            if (this.animationFlag === "start") {
                if (this.opacity < 1)
                    this.opacity += 0.1;
                if (this.opacity >= 1)
                    this.animationFlag = "stop";
            }
            if (this.animationFlag === "end") {
                if (this.opacity > 0)
                    this.opacity -= 0.1;
                if (this.opacity <= 0)
                    this.remove();
            }

        });
        game.rootScene.addChild(this);
    },
    end: function () {
        this.animationFlag = "end";
    },
    remove: function () {
        click_flag = true;
        game.rootScene.removeChild(this);
        delete this;
        clickSelector();
    }
});

///////////////////////////////////////////////////////////////////////
//���b�Z�[�W�\���N���X
var MSGWINDOW = enchant.Class.create(enchant.Sprite, {
    initialize: function () {

        enchant.Sprite.call(this, GAME_WIDTH, GAME_MSG_WND_HEIGHT);
        this.image = game.assets[SYS_DATA_PATH + 'msg_wnd.png'];
        this.x = 0;
        this.y = GAME_MSG_WND_Y;
        this.f_size = 30;
        this.msg = "";

        //�A�j���[�V�����ݒ�
        this.addEventListener('enterframe', function () {
            this.m_label.text = this.msg;
        });
        game.rootScene.addChild(this);
        //game.rootScene.insertBefore(this);

        this.m_label = new Label();
        this.m_label.color = 'white';
        this.m_label.font = "" + this.f_size + "px " + font;
        this.m_label.x = this.x + 5;
        this.m_label.y = this.y + 12;
        this.m_label.width = this.width - 60;
        this.m_label.text = "";
        game.rootScene.addChild(this.m_label);
    },
    text: function (msg) {

        this.msg = replaceCaractor(msg);
    }
});

///////////////////////////////////////////////////////////////////////
//�I�����\���N���X
var SELWINDOW = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, w, h, msg, hata) {

        enchant.Sprite.call(this, w, h);
        this.image = game.assets[SYS_DATA_PATH + 'select_wnd.png'];
        this.x = x;
        this.y = y;
        this.f_size = 24;
        this.msg = msg;
        this.hata = hata;

        //�A�j���[�V�����ݒ�
        this.addEventListener('enterframe', function () {
            this.sel_label.text = this.msg;
        });
        this.addEventListener('touchstart', function (e) {
            execSelect(this.hata);
            clickSelector();
        });
        game.rootScene.addChild(this);

        this.sel_label = new Label();
        this.sel_label.color = 'white';
        this.sel_label.font = "" + this.f_size + "px " + font;
        this.sel_label.x = this.x + 10;
        this.sel_label.y = this.y + 5;
        this.sel_label.width = this.width;
        this.sel_label.text = "";
        this.sel_label.hata = this.hata;
        //���x���ɂ��C�x���g���X�i�[�ǉ��i���x������N���b�N���Ă��������Ȃ�����
        this.sel_label.addEventListener('touchstart', function (e) {
            execSelect(hata);
            clickSelector();
        });
        game.rootScene.addChild(this.sel_label);
    },
    text: function (msg) {
        this.msg = msg;
    },
    remove: function () {
        game.rootScene.removeChild(this.sel_label);
        game.rootScene.removeChild(this);
        delete this;
    }
});
///////////////////////////////////////////////////////////////////////
//�摜�{�^���N���X
var IMGBUTTON = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, w, h, path, mode) {

        enchant.Sprite.call(this, w, h);
        this.image = game.assets[path];
        this.x = x;
        this.y = y;

        this.mode = mode;

        //�^�b�`���ꂽ���̏���
        this.addEventListener('touchstart', function (e) {
            if (this.mode === "setting") {
                displayOption();
            }
        });
        game.rootScene.addChild(this);
    },
    remove: function () {
        game.rootScene.removeChild(this);
        delete this;
    }
});

///////////////////////////////////////////////////////////////////////
//���[�_���w�i�N���X
var MODALBG = enchant.Class.create(enchant.Sprite, {
    initialize: function (w, h) {

        enchant.Sprite.call(this, w, h);
        this.backgroundColor = "rgba(0, 0, 0, 0.5)";
        this.option = new Array();
        this.saveItem = null;
        this.x = 0;
        this.y = 0;

        //�^�b�`���ꂽ���̏���
        this.addEventListener('touchstart', function (e) {
            this.remove();
        });
        game.rootScene.addChild(this);
    },
    remove: function () {
        if(this.saveItem != null){
            for (key in this.saveItem) {
                this.saveItem[key].remove();
            }
        }
        for (key in this.option) {
            this.option[key].remove();
        }
        click_flag = true;
        game.rootScene.removeChild(this);
        delete this;
    }
});

///////////////////////////////////////////////////////////////////////
//�I�v�V�����{�^���N���X
var OPTIONBUTTON = enchant.Class.create(enchant.Sprite, {
    initialize: function (x, y, w, h, path, mode, modalBg) {

        enchant.Sprite.call(this, w, h);
        this.p_path = path;
        this.image = game.assets[getOptionPath(path, mode)];
        this.modalParent = modalBg;
        this.mode = mode;
        this.x = x;
        this.y = y;
        this.saveItem = new Array();
         

        //�^�b�`���ꂽ���̏���
        this.addEventListener('touchstart', function (e) {
            switch (this.mode) {
                case "load":
                    this.saveItem = displaySaveArea(this.mode, modalBg);
                    this.modalParent.saveItem = this.saveItem;
                    break;
                case "save":
                    this.saveItem = displaySaveArea(this.mode, modalBg);
                    this.modalParent.saveItem = this.saveItem;
                    break;
                case "backlog":
                    drawBackLog(backLog);
                    break;
                case "sound_mode":
                    switchingSound();
                    this.image = game.assets[
                            getOptionPath(this.p_path, this.mode)
                    ];
                    break;
                case "effect_mode":
                    switchingEffect();
                    this.image = game.assets[
                            getOptionPath(this.p_path, this.mode)
                    ];
                    break;
                case "read_mode":
                    switchingRead();
                    this.image = game.assets[
                            getOptionPath(this.p_path, this.mode)
                    ];
                    break;
            }
        });

        game.rootScene.addChild(this);
    },
    remove: function () {
        game.rootScene.removeChild(this);
        delete this;
    }
});
////////////////////////////////////////////////////////////////////////
//�I�v�V�����N���X���p�����č쐬
var SAVEWINDOW = enchant.Class.create(OPTIONBUTTON, {
    initialize: function (x, y, w, h,
                           path, mode, msg, save_name, modalBg) {
        OPTIONBUTTON.call(this, x, y, w, h,
                          path, mode, modalBg);

        this.msg = msg;
        this.save_name = save_name;
        this.f_size = 20;
        this.close_flag = 0;

        this.sel_label = new Label();
        this.sel_label.color = 'white';
        this.sel_label.font = "bold " + this.f_size + "px " + font;
        this.sel_label.x = this.x + 5;
        this.sel_label.y = this.y + 5;
        this.sel_label.width = w - this.f_size;
        this.sel_label.text = msg;

        //���x���ɂ��C�x���g���X�i�[�ǉ��i���x������N���b�N���Ă��������Ȃ�����
        this.addEventListener('touchstart', function (e) {
            if (this.mode === 'save_wnd')
                save(save_name, modalBg);
            if (this.mode === 'load_wnd') {
                saveDataLoad(save_name, modalBg);
                loadPreload(game, data, dataSet, game_status['event_flag']);	//��s���[�h
            }
        });

        this.sel_label.addEventListener('touchstart', function (e) {
            if (this.mode === 'save_wnd')
                save(save_name);
            if (this.mode === 'load_wnd') {
                saveDataLoad(save_name);
                loadPreload(game, data, dataSet, game_status['event_flag']);	//��s���[�h
            }
        });
        game.rootScene.addChild(this.sel_label);

    },
    remove: function () {
        game.rootScene.removeChild(this.sel_label);
        game.rootScene.removeChild(this);
        delete this;
    }
});


///////////////////////////////////////////////////////////////////////
//���b�Z�[�W�\���N���X
var DEBUGWINDOW = enchant.Class.create(enchant.Sprite, {
    initialize: function () {

        enchant.Sprite.call(this, GAME_WIDTH, 200);
        this.x = 20;
        this.y = 20;
        this.f_size = 12;
        this.msg = "";

        //�A�j���[�V�����ݒ�
        this.addEventListener('enterframe', function () {
            this.msg = '';
            this.msg += "Line : " + game_status['event_flag'] + "<br>";
            this.msg += "char_left : " + game_status['char_left'] + "<br>";
            this.msg += "char_center : " + game_status['char_center'] + "<br>";
            this.msg += "char_right : " + game_status['char_right'] + "<br>";
            this.msg += "bg : " + game_status['bg'] + "<br>";
            this.msg += "bgm : " + game_status['bgm'] + "<br>";
            this.msg += "timer_cnt : " + timer_cnt + "<br>";
            for (var i = 0; i < game_status['user_var'].length; i++) {
                this.msg += String.fromCharCode(i + 65) + " = " + game_status['user_var'][i] + "<br>";
            }
            this.msg += "";
            label.text = this.msg;
        });
        game.rootScene.addChild(this);

        var label = new Label();
        //label.color = 'white';
        label.font = "" + this.f_size + "px " + font;
        label.x = this.x;
        label.y = this.y;
        label.width = this.width;
        label.text = "";
        game.rootScene.addChild(label);
    },
    text: function (msg) {
        this.msg = msg;
    }
});
