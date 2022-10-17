// addEventListener: さまざまなイベント処理を実行することができるメソッド
// 例: Webページが読み込まれたかどうか？
//     マウスによるクリックがされたかどうか？
//     フォームに何らかの操作が行われたかどうか？
//     キーボードから入力が行われたかどうか？

// 使い方:
// 対象要素.addEventListener( イベントの種類, 処理を実行したい関数, イベント伝搬の方式(falseを使う))

// load: webページの読み込みが完了した時、発動(画像などのリソース全て含む)


window.addEventListener('load', () => {
    
    const canvas = document.querySelector('#draw-area');

    //getContext('2d'): 
    //グラフィックを描画するためのメソッドやプロパティをもつオブジェクトを返す。
    //2d: 2Dグラフィックを描画するためのメソッドやプロパティをもつオブジェクトを返す。
    const context = canvas.getContext('2d');

    //現在のマウスの位置を中心に、現在選択している線の太さを表現する
    const canvasForWidthIndicator = document.querySelector('#line-width-indicator');
    const contextForWidthIndicator = canvasForWidthIndicator.getContext('2d');

    //マウスのcanvas上のx,y座標を記録する
    //書き初めの値が入るようにnullにしておく。
    const lastPosition = { x: null, y: null };

    //マウスがクリックされたままか判断する。
    let isDrag = false;

    //現在の線の色を保持する変数を定義する
    let currentColor = '#000000';

    //現在の線の太さを格納する変数
    let currentLineWidth = 1;

    // 絵を書く
    //Dragされなければ何もしない。
    function draw(x, y) {
      if(!isDrag) {
        return;
      }
      
      // 線の状態を定義する
      context.lineCap = 'round'; 
      context.lineJoin = 'round'; 
      context.lineWidth = currentLineWidth; 
      context.strokeStyle = currentColor; 
  
      
      if (lastPosition.x === null || lastPosition.y === null) {

       //moveToメソッド: 画面の位置を移動する
        context.moveTo(x, y);
      } else {
        
        // 最後の位置に移動する。
        context.moveTo(lastPosition.x, lastPosition.y);
      }

      //直前の座標と指定座標を結ぶ直線を引く
      context.lineTo(x, y);
  
      //現在のパスを輪郭表示する
      context.stroke();
  
      
      //現在のマウス位置を記録する => 次の開始点にする
      lastPosition.x = x;
      lastPosition.y = y;
    }
  
    //現在の線の太さを表現するためのものを表示する
    //lineCap: 描く線の端点の形状を設定するメソッド
    //lineJoin: 線の接合箇所の形状を指定するメソッド
    //strokeStyle: 図形の輪郭に使用する色

    function showLineWidthIndicator(x, y) {
      contextForWidthIndicator.lineCap = 'round';
      contextForWidthIndicator.lineJoin = 'round';
      contextForWidthIndicator.strokeStyle = currentColor;
   
      // 「○」の線の太さは細くて良いので1で固定
      contextForWidthIndicator.lineWidth = 1;
   
      // 過去に描画「○」を削除する。過去の「○」を削除しなかった場合は
      // 過去の「○」が残り続けてします。(以下の画像URLを参照)
      // https://tsuyopon.xyz/wp-content/uploads/2018/09/line-width-indicator-with-bug.gif
      contextForWidthIndicator.clearRect(0, 0, canvasForWidthIndicator.width, canvasForWidthIndicator.height);
   
      contextForWidthIndicator.beginPath();
   
      // x, y座標を中心とした円(「○」)を描画する。
      // 第3引数の「currentLineWidth / 2」で、実際に描画する線の太さと同じ大きさになる。
      // ドキュメント: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
      contextForWidthIndicator.arc(x, y, currentLineWidth / 2, 0, 2 * Math.PI);
   
      contextForWidthIndicator.stroke();
    }
   
 
    function clear() {
    
      var result = confirm('全消ししますか？')

      //clearRect(x,y,w,h)メソッド: 
      // x: 四角形の左上のx座標
      // y: 四角形の左上のy座標
      // w: 四角形の幅
      // h: 四角形の高さ
      // => この範囲で四角形の形をクリアにする
    
      if (result) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }

      // confirmを使った条件分岐:
      // https://www.sejuku.net/blog/28217
    }
  
    //ドラッグの始まり
    function dragStart(event) {
     
      //現在のパスをリセットする
      context.beginPath();
      
      //isDragのフラグをtrueにしてdraw関数内で
     //お絵かき処理が途中で止まらないようにする
      isDrag = true;
    }
    
    //ドラッグの終わり
    function dragEnd(event) {
      // 線を書く処理の終了を宣言する
      context.closePath();
      isDrag = false;
  

      // 描画中に記録していた値をリセットする
      lastPosition.x = null;
      lastPosition.y = null;
    }
  
   
    //どの操作の時に、どの関数を呼び出すか定義する。
    function initEventHandler() {

      //画像ダウンロード機能
      document.getElementById("downloadPng").addEventListener("click", function () {
        const base64 = canvas.toDataURL({
            format: "png",
        });
        const link = document.createElement("a");
        link.href = base64;
        link.download = "illustration.png";
        link.click();
     });

      //消しゴム
      const eraserButton = document.querySelector('#eraser-button');
      eraserButton.addEventListener('click' , () => {
        currentColor = '#FFFFFF';
      });

      const layeredCanvasArea = document.querySelector('#layerd-canvas-area');
      
      //全消し
      const clearButton = document.querySelector('#clear-button');
      clearButton.addEventListener('click', clear);
  
      canvas.addEventListener('mousedown', dragStart);
      canvas.addEventListener('mouseup', dragEnd);
      canvas.addEventListener('mouseout', dragEnd);
      canvas.addEventListener('mousemove', (event) => {
        
  
        draw(event.layerX, event.layerY);
        showLineWidthIndicator(event.layerX, event.layerY);
      });
    }

    //カラーパレットを定義する
    function initColorPalette() {
      const joe = colorjoe.rgb('color-palette', currentColor);
      joe.on('done', color => {
        currentColor = color.hex();
      });
    }

    function initConfigOfLineWidth(){
      const textForCurrentSize = document.querySelector('#line-width');
      const rangeSelector = document.querySelector('#range-selector');
      currentLineWidth = rangeSelector.value;

      rangeSelector.addEventListener('input', event => {
        const width = event.target.value;
        currentLineWidth = width;
        textForCurrentSize.innerText = width;
      })
    }

    initEventHandler();
    initColorPalette();
    initConfigOfLineWidth();

  });

  //参考文献:
  // https://tsuyopon.xyz/2018/09/14/how-to-create-drawing-app-part1/
  // https://techceed-inc.com/engineer_blog/8009/

  //研究室選び:
  //学会発表をよくする所(しんどい , 卒論が楽 , 就職も楽 )
  // 鈴木先生: 知り合いを繋げてくれる