enchant();
var TEST    = 0; //1にするとデバッグが使える
var MAX_JEM = 30;//JEMの個数

var MAX_ROW = 3; //縦のます数
var MAX_COL = 3; //横のます数
var MAP_COL = MAX_COL + 2; //MAP用幅
var ENEMY_HP = 1000;
var JEMS = 'Jems.png';
var MAP  = 'map.png';


window.onload = function(){
    //Game初期設定
    var game = new Game(160, 240);
    //var scale_h = window.innerHeight/240;
    //game.scale = scale_h;
    game.fps = 30;
    game.preload(JEMS);
    game.preload(MAP);
    game.preload('enemy.png');
    game.preload('gauge.png');
    game.preload('life.png');
    game.preload('summon.png');
    game.preload('weak.png');
    game.preload('gameover.png');
    game.preload('clear.png');
    game.preload('monster.png');

    game.onload = function(){
        var scene = game.rootScene;
        //負け
        var gameOverScene = new Scene();
        gameOverScene.backgroundColor = 'blue';
        //勝ち
        var gameClearScene = new Scene();
        gameClearScene.backgroundColor = 'red';

        //MAPの生成
        scene.backgroundColor = 'black';
        var map = new Map(32,32);
        var field = new Array(MAX_ROW);
        for(var y=0; y<field.length; y++){
            var tempArray= [];
            for(var x=0; x<MAP_COL; x++){
                if(x == 0){
                    if(y==0)tempArray[x] = 4;
                    if(y==1)tempArray[x] = 3;
                    if(y==2)tempArray[x] = 2;
                }else if(x == 4){
                    if(y==0)tempArray[x] = 5;
                    if(y==1)tempArray[x] = 0;
                    if(y==2)tempArray[x] = 0;
                }else{
                    tempArray[x] = 1;
                }
            }
            field[y] = tempArray;
        }
        map.image = game.assets[MAP];
        map.loadData(field);
        map.x = 0  ;
        map.y = 140;
        scene.addChild(map);

        //残り
        var remainLabel = new Label();
        remainLabel.x = 8;
        remainLabel.y = 156;
        remainLabel.color = 'red';
        remainLabel.font = '16px "Arial"';
        var jemRemain = MAX_JEM;
        remainSet();

        //残り管理
        function remainSet(){
            if(jemRemain<=0)gameOver();
            if(jemRemain<10)remainLabel.x=14;
            remainLabel.text=jemRemain;
            scene.addChild(remainLabel);
        }

        //がめくりあ
        function gameClear(){
            game.pushScene(gameClearScene);
            var gameclear = new Sprite(160,29);
            gameclear.image = game.assets['clear.png'];
            gameclear.x = 0; gameclear.y = 105;
            gameClearScene.addChild(gameclear);
        }

        //がめおべら
        function gameOver(){
            game.pushScene(gameOverScene);
            var remain = new Label();
            remain.text = "RemainHP="+hp;
            remain.x = 0; remain.y = 100;
            remain.color = 'red';
            remain.font = '20px "Monaco"';
            gameOverScene.addChild(remain);
            var gameover = new Sprite(160,82);
            gameover.image = game.assets['gameover.png'];
            gameover.x = 0; gameover.y = 20;
            gameOverScene.addChild(gameover);
        }

        //アイテム説明
        var itemLabel = new Label();
        itemLabel.x = 0;
        itemLabel.y = 188;
        itemLabel.color = 'red';
        itemLabel.font = '8px "Monaco"';
        itemLabel.text="Change";
        scene.addChild(itemLabel);
        var itemLabel2 = new Label();
        itemLabel2.x = 4;
        itemLabel2.y = 198;
        itemLabel2.color = 'red';
        itemLabel2.font = '8px "Monaco"';
        itemLabel2.text="Next!";
        scene.addChild(itemLabel2);

        //JEMSの生成
        var jemMap = new Map(32,32);
        var jems    = new Array(MAX_ROW);
        for(var y=0; y<field.length; y++){
            var tempArray= [];
            for(var x=0; x<MAX_COL; x++){
                tempArray[x] = 0;
            }
            jems[y] = tempArray;
        }
        jemMap.image = game.assets[JEMS];
        jemMap.x = 32 ;
        jemMap.y = 140;
        jemsSet();

        function jemsSet(){
            jemMap.loadData(jems);
            scene.addChild(jemMap);
        }

        //NEXTクラス
        var Next = Class.create(Sprite, {
            initialize: function(n,color) {
                            Sprite.call(this, 32, 32);
                            this.x = 128;
                            this.y = 156 + n*16;
                            this.image = game.assets[JEMS];
                            this.frame = color;
                            scene.addChild(this);
                        }
        });

        //NEXTの生成
        var next = Array(5);
        for(var i=next.length-1; i >= 0; i--){
            var color = Math.floor(Math.random()*3+1);
            next[i] = new Next(i, color);
        }

        //NEXTどん
        function nextSet(){
            var current = next[0].frame;
            for(var i=0; i<4; i++){
                next[i].frame = next[i+1].frame;
            }
            jemRemain--;
            if(jemRemain >= 5){
                next[4].frame = Math.floor(Math.random()*3+1);
            }else{
                next[4].frame = 0;
            }
            return current;
        }

        //ENEMYの配置（パズドラから拝借）
        var enemy = new Sprite(160,100);
        enemy.image = game.assets['enemy.png'];
        enemy.x = 0; enemy.y = 5;
        scene.addChild(enemy);

        //Monsterクラス
        var Monster = Class.create(Sprite, {
            initialize: function(x,y,n){
                            Sprite.call(this,32,32);
                            this.x     = x;
                            this.y     = y;
                            this.image = game.assets['monster.png'];
                            this.frame = n;
                        },
            attack: function(){
                        x= this.x;
                        y= this.y;
                        this.tl.moveTo(64,60,5).moveTo(x,y,10);
                    }
        });
        var monster = [];
        for(var i=0;i<5;i++){
            monster[i] = new Monster(i*32,108,i);
            scene.addChild(monster[i]);
        }

        //召還パターン表示
        var summon = new Sprite(160,32);
        summon.image = game.assets['summon.png'];
        summon.x = 0; summon.y = 108;

        //弱点表示
        var weak = new Sprite(32,20);
        weak.image = game.assets['weak.png'];
        weak.x = 0; weak.y = 80;
        scene.addChild(weak);
        //HPゲージ
        var hp = ENEMY_HP;
        var gauge = new Sprite(16,80);
        gauge.x=136;
        gauge.y=15;
        gauge.image = game.assets['gauge.png'];
        scene.addChild(gauge);
        hp = ENEMY_HP;
        var life = new Sprite(8,72);
        //hp文字
        var HP = new Label();
        HP.x = 132;
        HP.y = 2;
        HP.color = 'white';
        HP.font = '10px "Arial"';
        lifeSet();

        //life
        function lifeSet(){
            var lifeBar = Math.floor(72*hp/ENEMY_HP);
            scene.removeChild(life);
            life = new Sprite(8,lifeBar);
            life.x=140;
            life.y=19 + (72-lifeBar);
            life.image = game.assets['life.png'];
            scene.addChild(life);
            HP.text = hp;
            scene.addChild(HP);
        }
        function attack(color,at){
            if(color==1)hp-=at*2;
            if(color==2)hp-=at;
            if(color==3)hp-=Math.floor(at/1.2);
            lifeSet();
            print(hp);
            if(hp<0)gameClear();
        }

        //-----------
        //タッチ判定
        var summonFlg = 0;
        scene.addEventListener("touchstart", function(touch){
            var touchX = Math.floor(touch.localX);
            var touchY = Math.floor(touch.localY);
            print(touchX + "," + touchY);
            for(var y=0; y<MAX_ROW; y++){
                if(touchY>(y*32)+142 && touchY<(y*32)+170){
                    for(var x=0; x<MAX_COL; x++){
                        if(touchX>(x*32)+34 && touchX<(x*32)+62){
//上書きOK
//                            if(jems[y][x]==0){
                                jems[y][x] = nextSet();
                                check();
                                jemsSet();
                                remainSet();
//                          }
                            break;
                        }
                    }
                }
            }
            if(touchY>=200 && touchY<=240 && touchX>0 && touchX<=32){
                item();
            }
            if(touchY>0 && touchY<=140 && touchX>0 && touchX<=160){
                scene.addChild(summon);
                summonFlg=1;
            }
        });
        scene.addEventListener("touchend", function(touch){
            if(summonFlg==1){
                scene.removeChild(summon);
                summonFlg=0;
            }
        });

        //アイテム
        function item(){
            if(field[2][0]!=0){
                for(var i=0;i<5;i++){if(next[i].frame!=0)next[i].frame=1;}
                itemLabel.text="";
                itemLabel2.text="";
                field[2][0]=0;
                map.loadData(field);
            }
        }

        //判定
        function check(){
            var del = Array(3);
            for(var i=0;i<3;i++){del[i]=[1,1,1];}
            //モックなんで野暮ったくやります
            var jemColor;
            //H型
            if(jems[0][0] != 0){
                jemColor = jems[0][0];
                if(jems[1][0]==jemColor && jems[1][2]==jemColor && jems[1][1]==jemColor && jems[2][2]==jemColor && jems[2][0]==jemColor && jems[0][2]==jemColor){
                    attack(jemColor,200);
                    monster[4].attack();
                    del[0][0]=0;
                    del[1][0]=0;
                    del[1][2]=0;
                    del[1][1]=0;
                    del[2][2]=0;
                    del[2][0]=0;
                    del[0][2]=0;
                }
            }
            //X型
            if(jems[0][0] != 0){
                jemColor = jems[0][0];
                if(jems[1][1]==jemColor && jems[2][2]==jemColor && jems[2][0]==jemColor && jems[0][2]==jemColor){
                    attack(jemColor,100);
                    monster[3].attack();
                    del[0][0]=0;
                    del[1][1]=0;
                    del[2][2]=0;
                    del[2][0]=0;
                    del[0][2]=0;
                }
            }
            //♢ 型
            if(jems[0][1] != 0){
                jemColor = jems[0][1];
                if(jems[1][0]==jemColor && jems[2][1]==jemColor && jems[1][2]==jemColor){
                    attack(jemColor,50);
                    monster[2].attack();
                    del[0][1]=0;
                    del[1][0]=0;
                    del[2][1]=0;
                    del[1][2]=0;
                }
            }

            //逆L字型
            for(var y=0; y<2; y++){
                for(var x=1; x<3; x++){
                    if(jems[y][x] != 0){
                        jemColor = jems[y][x];
                        if(jems[y+1][x]==jemColor && jems[y+1][x-1]==jemColor){
                            attack(jemColor,30);
                            monster[0].attack();
                            del[y][x]=0;
                            del[y+1][x]=0;
                            del[y+1][x-1]=0;
                        }
                    }
                }
            }

            //横3つ
            for(var y=0; y<3; y++){
                if(jems[y][0] != 0){
                    jemColor = jems[y][0];
                    if(jems[y][1]==jemColor && jems[y][2]==jemColor){
                        attack(jemColor,50);
                        monster[1].attack();
                        del[y][0]=0;
                        del[y][1]=0;
                        del[y][2]=0;
                    }
                }
            }

            //削除判定
            for(var y=0; y<3; y++){
                for(var x=0; x<3; x++){
                    if(del[y][x] == 0)jems[y][x]=0;
                }
            }
        }

        //デバッグプリント
        var string = new Label();
        function print(str){
            string.x=0;
            string.y=0;
            string.color="red"
            string.text = str;
            if(TEST==1)scene.addChild(string);
        }

    };
    game.start();
};
