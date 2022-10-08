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
    const context = canvas.getContext('2d');

     //マウスのcanvas上のx,y座標を記録する
    const lastPosition = { x: null, y: null };

    //マウスがクリックされたままか判断するフラグ
    let isDrag = false;

    //現在の線の色を保持する変数を定義する
    let currentColor = '#000000';

    let current
    function draw(x, y) {
      if(!isDrag) {
        return;
      }
  
      context.lineCap = 'round'; 
      context.lineJoin = 'round'; 
      context.lineWidth = 5; 
      context.strokeStyle = currentColor; 
  
      if (lastPosition.x === null || lastPosition.y === null) {
    
        context.moveTo(x, y);
      } else {
        
        context.moveTo(lastPosition.x, lastPosition.y);
      }
    
      context.lineTo(x, y);
  
      
      context.stroke();
  
      
      
      lastPosition.x = x;
      lastPosition.y = y;
    }
  
    function clear() {
      alert('全消ししますか？');
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  
    
    function dragStart(event) {
     
      context.beginPath();
  
      isDrag = true;
    }
    
    function dragEnd(event) {
    
      context.closePath();
      isDrag = false;
  
      
      lastPosition.x = null;
      lastPosition.y = null;
    }
  
   
    function initEventHandler() {

      const eraserButton = document.querySelector('#eraser-button');
      eraserButton.addEventListener('click' , () => {
        currentColor = '#FFFFFF';
      });

      const clearButton = document.querySelector('#clear-button');
      clearButton.addEventListener('click', clear);
  
      canvas.addEventListener('mousedown', dragStart);
      canvas.addEventListener('mouseup', dragEnd);
      canvas.addEventListener('mouseout', dragEnd);
      canvas.addEventListener('mousemove', (event) => {
        
  
        draw(event.layerX, event.layerY);
      });
    }

    //カラーパレットを定義する
    function initColorPalette() {
      const joe = colorjoe.rgb('color-palette', currentColor);
      joe.on('done', color => {
        currentColor = color.hex();
      });
    }

    initEventHandler();
    initColorPalette();

  });