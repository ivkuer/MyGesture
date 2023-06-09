
function Gesture(element, options) {
  this.element = element; // 绑定事件的元素
  this.options = options; // 配置项
  this.point = { x: 0, y: 0 }; // 第一个触摸点位置

  this.distance = { x: 0, y: 0 }; // 移动距离
  this.tapCount = 0; // 点击计数器
  this.points = []; // 移动位置数组 长度20 用于计算是否触发swipe
 
  this.isPointerdown = false; // 按下标识
  this.longTapTimeout = null; // 长按延时器
  // 绑定事件
  this.bindEventListener();
}

Gesture.prototype.handlePointerdown = function (e) {
  // 如果是鼠标点击，只响应左键
  if (e.pointerType === 'mouse' && e.button !== 0) {
      return;
  }
  this.point.x = e.clientX;
  this.point.y = e.clientY;

    this.isPointerdown = true;
    // 将特定元素指定为未来指针事件的捕获目标。指针的后续事件将以捕获元素为目标，直到捕获被释放
      this.element.setPointerCapture(e.pointerId);
      this.tapCount = 1;
      this.points.length = 0;
      this.distance.x = 0;
      this.distance.y = 0;

      if (this.tapCount === 1) {
          // 按住500ms触发长按事件
          this.longTapTimeout = setTimeout(() => {
              this.tapCount = 0;
              if (this.options.longTap) {
                  this.options.longTap(e);
              }
          }, 500);
      }
  console.log(this.tapCount);

}

Gesture.prototype.handlePointermove = function (e) {
  if (!this.isPointerdown) {
      return;
  }
  e.preventDefault()
  const current1 = { x: e.clientX, y: e.clientY };
      this.distance.x = current1.x - this.point.x;
      this.distance.y = current1.y - this.point.y;
      // 偏移量大于10表示移动
      console.log(this.distance);
      if (Math.abs(this.distance.x) > 10 || Math.abs(this.distance.y) > 10) {
          this.tapCount = 0;
          clearTimeout(this.longTapTimeout);
      }
      this.points.unshift({ x: current1.x, y: current1.y, timeStamp: e.timeStamp });
      if (this.points.length > 20) {
          this.points.pop();
      }  
}

Gesture.prototype.handlePointerup = function (e) {
  if (!this.isPointerdown) {
      return;
  }

      this.isPointerdown = false;
      clearTimeout(this.longTapTimeout);
      if (this.tapCount === 0) {
          this.handleSwipe(e);
      } 
}

Gesture.prototype.handleSwipe = function (e) {
  let MIN_SWIPE_DISTANCE = 20;
  let x = 0, y = 0;
  // 如果200ms内移动距离大于20
  for (const item of this.points) {
      if (e.timeStamp - item.timeStamp < 200) {
          x = e.clientX - item.x;
          y = e.clientY - item.y;
      } else {
          break;
      };
  }
 
  if (Math.abs(x) > MIN_SWIPE_DISTANCE || Math.abs(y) > MIN_SWIPE_DISTANCE) {
      if (Math.abs(x) > Math.abs(y)) {
          e._swipeDirection = x > 0 ? 'right' : 'left';
      } else {
          e._swipeDirection = y > 0 ? 'down' : 'up';
      }

      if (this.options.swipe) {
          this.options.swipe(e);
      }
  }
}

/**
* 绑定事件
*/
Gesture.prototype.bindEventListener = function () {
  this.handlePointerdown = this.handlePointerdown.bind(this);
  this.handlePointermove = this.handlePointermove.bind(this);
  this.handlePointerup = this.handlePointerup.bind(this);
  this.element.addEventListener('pointerdown', this.handlePointerdown);
  this.element.addEventListener('pointermove', this.handlePointermove);
  this.element.addEventListener('pointerup', this.handlePointerup);
}
/**
* 解绑事件
*/
Gesture.prototype.unbindEventListener = function () {
  this.element.removeEventListener('pointerdown', this.handlePointerdown);
  this.element.removeEventListener('pointermove', this.handlePointermove);
  this.element.removeEventListener('pointerup', this.handlePointerup);
}
/**
* 销毁
*/
Gesture.prototype.destroy = function () {
  this.unbindEventListener();
}


const divDom = document.querySelector('.div1');
const gesture = new Gesture(divDom, {
    swipe: function (e) { 
      window.alert(e._swipeDirection)
    },
    longTap: function() {
        window.alert('长按');
    }
});