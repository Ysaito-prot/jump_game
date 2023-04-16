// 変数(canvas, g)の宣言
var canvas, g;
// 変数(自キャラの位置と画像、半径R)の宣言
var characterPosX, characterPosY, characterImage, characterR;
var speed, acceleration;
// 障害物の位置、速度の変数
var enemyPosX, enemyPosY, enemyImage, enemySpeed, enemyR;
// スコアの変数
var score;
// シーンの変数
var scene;
var frameCount;
var bound;
// シーンの定義
const Scenes = {
    GameMain: "GameMain",
    GameOver: "GameOver",
};

// webページが読み込まれたとき1度だけ実行される部分
onload = function () {
    // 描画コンテキストの取得
    canvas = document.getElementById("gamecanvas");
        // 絵を描くためのコンテキストを取得
    g = canvas.getContext("2d");
    // 初期化
    init();
    // 入力処理の指定
    document.onkeydown = keydown
    // ゲームループの設定
    setInterval("gameloop()", 16);
};

// 最初に表示される位置を指定
function init() {
    characterPosX = 100;
    characterPosY = 400;
    characterR = 35;
    characterImage = new Image();
    characterImage.src = "./asset/mouse.png";
    speed = 0;
    acceleration = 0;

    // 障害物の初期値を設定
    enemyPosX = 600;
    enemyPosY = 400;
    enemyR = 35;
    enemyImage = new Image();
    enemyImage.src = "./asset/cat.png";
    enemySpeed = 15;

    // ゲーム管理データの初期化
    score = 0;
    frameCount = 0;
    bound = false;
    scene = Scenes.GameMain;
}

function keydown(e) {
    if (characterPosY > 399) {
        // キャラクターの速度と加速度を設定
        speed = -20;
        // 加速度
        acceleration = 1.5;
    }
}

function gameloop() {
    update();
    draw();
}

function update() {
    // ゲームプレイ中
    if (scene == Scenes.GameMain) {

        // 自キャラの状態更新
        speed = speed + acceleration;
        characterPosY = characterPosY + speed;
        if (characterPosY > 400) {
            characterPosY = 400;
            speed = 0;
            acceleration = 0;
        }

        // 障害物の移動
        enemyPosX -= enemySpeed;
        // 左画面が今で言ったら元の位置に戻して再度障害物を出現させる
        if (enemyPosX < -100) {
            enemyPosX = 600;
            score += 100;
        }

        // 当たり判定
        var diffX = characterPosX - enemyPosX;
        var diffY = characterPosY - enemyPosY;
        var distance = Math.sqrt(diffX * diffX + diffY * diffY);
        if (distance < characterR + enemyR) {
            scene = Scenes.GameOver;
            speed = -20;
            acceleration = 0.5;
            frameCount = 0;
        }

        // ゲームオーバー中
    } else if (scene == Scenes.GameOver) {
        // 自キャラの状態更新
        speed = speed + acceleration;
        characterPosY = characterPosY + speed;

        // 画面の端までキャラが移動したらバウンド
        if (characterPosX < 20 || characterPosX > 460) {
            // !はtrueとfalseを反転することを意味する
            bound = !bound
        }

        // バウンド状態かどうかで自キャラの移動を変化
        if (bound) {
            characterPosX = characterPosX + 30;
        } else {
            characterPosX = characterPosX - 30;
        }

        // 敵キャラの状態更新
        enemyPosX -= enemySpeed;
    };

    // 現在何フレーム目かをカウント
    frameCount++;
};

// 自キャラを描画する
function draw() {
    // ゲームプレイ中
    if (scene == Scenes.GameMain) {
        // 背景描画
        g.fillStyle = "rgb(0,0,0)"
        g.fillRect(0,0,480,480)

        // キャラクター描画(描画開始位置を指定)
        g.drawImage(
            characterImage,
            characterPosX - characterImage.width / 2,
            characterPosY - characterImage.height / 2
        );

        // 敵キャラクター描写
        g.drawImage(
            enemyImage,
            enemyPosX - enemyImage.width / 2,
            enemyPosY - enemyImage.height / 2
        );

        // スコア描画
        g.fillStyle = "rgb(255,255,255)";
        g.font = "16pt Arial";
        var scoreLabel = "score : "+ score;
        // スコアの文字列がどのくらいの表示幅になるのかを取得(スコア表示を右上に寄せて描画する為)
        var scoreLabelWidth = g.measureText(scoreLabel).width;
        g.fillText(scoreLabel, 460 - scoreLabelWidth, 40);

    // ゲームオーバー中
    } else if (scene == Scenes.GameOver) {
        // 背景描画
        g.fillStyle = "rgb(0,0,0)"
        g.fillRect(0,0,480,480)

        // キャラクター描画
        if (frameCount < 120) {
            g.save();
            g.translate(characterPosX, characterPosY);
            g.rotate(((frameCount % 30) * Math.PI * 2) / 30);
            g.drawImage(
                characterImage,            
                -characterPosX - characterImage.width / 2,
                -characterPosY - characterImage.height / 2,
                characterImage.width + frameCount,
                characterImage.height + frameCount
            );
            g.restore();
        };

        // ゲームオーバー表示
        g.fillStyle = "rgb(255,255,255)";
        g.font = "48pt Arial";
        var scoreLabel = "GAME OVER";
        var scoreLabelWidth = g.measureText(scoreLabel).width;
        g.fillText(scoreLabel, 240 - scoreLabelWidth / 2, 240); 
        
    };
}


