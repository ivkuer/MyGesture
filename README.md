# MyGesture手势库

一款扩展性极强，用法便捷，移动端，PC端通用的手势库

## 使用方法

传入需要绑定的dom元素，传入你需要的处理的手势回调函数。
```js
const divDom = document.querySelector('.div');
const gesture = new Gesture(divDom, {
    swipe: function (e) { 
      window.alert(e._swipeDirection)
    },
    longTap: function() {
        window.alert('长按');
    }
});
```

一键解绑
```js
gesture.destroy()
```
