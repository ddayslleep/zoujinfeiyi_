// 自动消失提示
function toast(msg) {
  document.querySelectorAll('.toast-mask').forEach(e => e.remove());
  const mask = document.createElement('div');
  mask.className = 'toast-mask';
  mask.innerHTML = `<div class="toast-box">${msg}</div>`;
  document.body.appendChild(mask);
  setTimeout(() => mask.remove(), 2000);
}

// 手动关闭弹窗
function modal(msg,callback) {
  document.querySelectorAll('.modal-mask').forEach(e => e.remove());
  const mask = document.createElement('div');
  mask.className = 'modal-mask';
  mask.innerHTML = `
    <div class="modal-box">
      <div class="text">${msg}</div>
      <button class="btn">确定</button>
    </div>
  `;
  document.body.appendChild(mask);
  mask.querySelector('.btn').onclick = () => {
    mask.remove();
    // 如果传了回调，就执行
    if (typeof callback === 'function') {
      callback();
    }
  };
}