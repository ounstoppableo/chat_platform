import { useEffect } from 'react';

const useOpenImgLogic = () => {
  //打开图片
  const openImg = (e: any) => {
    // 显示遮罩和图片
    document.getElementById('imgOpenOverlay')!.style.display = 'flex';
    (document.getElementById('fullScreenImage') as any).src = e.target.src;
  };
  useEffect(() => {
    const cb = function (this: any, e: any) {
      // 检查点击的是否是遮罩本身（而不是图片）
      if (e.target === this) {
        // 隐藏遮罩和图片
        this.style.display = 'none';
        (document.getElementById('fullScreenImage') as any).src = '';
      }
    };
    document.getElementById('imgOpenOverlay')!.addEventListener('click', cb);
    return () => {
      document
        .getElementById('imgOpenOverlay')!
        .removeEventListener('click', cb);
    };
  }, []);

  return { openImg };
};
export default useOpenImgLogic;
