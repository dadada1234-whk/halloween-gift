<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>万圣节惊喜弹窗</title>
    <style>
        /* 初始弹窗样式 */
        #start-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .start-modal {
            background-color: #fff;
            padding: 40px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .start-modal h1 {
            color: #d9534f;
            font-size: 2.5em;
            margin-bottom: 20px;
        }
        
        .start-modal p {
            font-size: 1.2em;
            margin-bottom: 30px;
        }
        
        #confirm-btn {
            background-color: #d9534f;
            color: white;
            border: none;
            padding: 12px 30px;
            font-size: 1.1em;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        #confirm-btn:hover {
            background-color: #c9302c;
        }
        
        /* 动态弹窗容器 */
        #popup-layer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 64;
        }
        
        /* 动态弹窗基础样式 */
        .popup {
            position: absolute;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            padding: 15px;
            pointer-events: auto;
            animation-fill-mode: both;
            animation-duration: 0.5s;
        }
        
        /* 弹窗头部 */
        .popup-header {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .popup-icon {
            font-size: 1.5em;
            margin-right: 8px;
        }
        
        .popup-title {
            font-weight: bold;
            font-size: 1.1em;
        }
        
        /* 弹窗内容 */
        .popup-content {
            font-size: 0.9em;
            line-height: 1.4;
        }
        
        /* 弹窗大小变体 */
        .popup-small {
            width: 120px;
            height: 80px;
        }
        
        .popup-medium {
            width: 160px;
            height: 100px;
        }
        
        .popup-large {
            width: 200px;
            height: 120px;
        }
        
        /* 弹窗主题颜色 */
        .theme-teal {
            background-color: #e6f7f7;
            border: 2px solid #17a2b8;
        }
        
        .theme-indigo {
            background-color: #e8eaf6;
            border: 2px solid #6610f2;
        }
        
        .theme-orange {
            background-color: #fff3e0;
            border: 2px solid #fd7e14;
        }
        
        .theme-purple {
            background-color: #f3e5f5;
            border: 2px solid #9c27b0;
        }
        
        /* 弹窗动画效果 */
        @keyframes slideInLeft {
            from {
                transform: translateX(-100%) rotate(0deg);
                opacity: 0;
            }
            to {
                transform: translateX(0) rotate(var(--rotation));
                opacity: 1;
            }
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%) rotate(0deg);
                opacity: 0;
            }
            to {
                transform: translateX(0) rotate(var(--rotation));
                opacity: 1;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: scale(0.5) rotate(0deg);
            }
            to {
                opacity: 1;
                transform: scale(1) rotate(var(--rotation));
            }
        }
        
        @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: translateY(-100%) scale(0.3) rotate(0deg);
            }
            50% {
                opacity: 1;
                transform: translateY(30px) scale(1.05) rotate(0deg);
            }
            70% {
                transform: translateY(-10px) scale(0.9) rotate(0deg);
            }
            100% {
                transform: translateY(0) scale(1) rotate(var(--rotation));
                opacity: 1;
            }
        }
        
        .anim-left {
            animation-name: slideInLeft;
        }
        
        .anim-right {
            animation-name: slideInRight;
        }
        
        .anim-fade {
            animation-name: fadeIn;
        }
        
        .anim-bounce {
            animation-name: bounceIn;
        }
        
        /* 背景样式 */
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #0d0d0d;
            color: #fff;
            min-height: 100vh;
        }
        
        .background-decoration {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: radial-gradient(circle at 20% 30%, #5c0029 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, #003366 0%, transparent 50%);
        }
    </style>
</head>
<body>
    <!-- 背景装饰 -->
    <div class="background-decoration"></div>
    
    <!-- 初始弹窗 -->
    <div id="start-backdrop">
        <div class="start-modal">
            <h1>🎃 万圣节快乐！</h1>
            <p>点击确定按钮开始您的万圣节惊喜之旅！</p>
            <button id="confirm-btn">开始惊喜</button>
        </div>
    </div>
    
    <!-- 动态弹窗容器 -->
    <div id="popup-layer"></div>
    
    <!-- 背景音乐 -->
    <audio id="bgMusic" loop>
        <!-- 请替换为您的背景音乐URL -->
        <source src="https://example.com/halloween-music.mp3" type="audio/mpeg">
        您的浏览器不支持音频元素。
    </audio>
    
    <!-- JavaScript代码 -->
    <script>
        // 1. 页面加载完成后执行（避免DOM未渲染导致获取失败） 
        document.addEventListener('DOMContentLoaded', function() { 
            // 2. 获取核心DOM元素（语义化变量名，对应原加密代码中的混淆变量） 
            const startBackdrop = document.getElementById('start-backdrop'); // 初始弹窗背景 
            const confirmBtn = document.getElementById('confirm-btn');     // 确定按钮 
            const popupLayer = document.getElementById('popup-layer');     // 动态弹窗容器 
            const bgMusic = document.getElementById('bgMusic');           // 背景音乐 
        
            // 3. 配置项（原加密代码中_0x50a617/_0x585398/_0xbc4913的明文版本） 
            const config = { 
            popupTexts: [ // 弹窗中显示的文字（可直接修改） 
                "万圣节快乐！", 
                "不给糖就捣蛋～", 
                "祝你收获满满惊喜！", 
                "今晚的南瓜灯为你点亮～", 
                "万圣节也要开心呀！", 
                "拆到你的专属节日礼物啦！", 
                "愿你被所有美好包围～"
            ], 
            popupThemes: [ // 弹窗样式类（控制颜色/大小） 
                "popup-small theme-teal", 
                "popup-medium theme-indigo", 
                "popup-large theme-orange", 
                "popup-small theme-purple"
            ], 
            popupAnims: [ // 弹窗动画类（控制入场效果） 
                "anim-left", 
                "anim-right", 
                "anim-fade", 
                "anim-bounce"
            ], 
            maxPopupCount: 420,  // 最大弹窗数量（原加密代码0x1a4=420，避免卡顿） 
            popupInterval: 100   // 弹窗生成间隔（原加密代码0x64=100毫秒） 
            }; 
        
            // 4. 状态变量 
            let popupTimer = null;  // 弹窗定时器 
            let currentPopupCount = 0; // 当前弹窗数量 
        
        
            // 5. 辅助函数：从数组中随机取一个元素（对应原加密代码_0x30025d） 
            function getRandomItem(arr) { 
            return arr[Math.floor(Math.random() * arr.length)]; 
            } 
        
        
            // 6. 核心函数1：隐藏初始弹窗（对应原加密代码_0x12bfb3中的弹窗隐藏逻辑） 
            function hideStartModal() { 
            startBackdrop.setAttribute('aria-hidden', 'true'); 
            startBackdrop.style.display = 'none'; 
            } 
        
        
            // 7. 核心函数2：播放背景音乐（对应原加密代码_0x12bfb3中的音乐播放逻辑） 
            function playBgMusic() { 
            bgMusic.volume = 0.6; // 音量设为0.6（与原代码一致） 
            // 处理浏览器音频自动播放限制（需用户交互后播放） 
            bgMusic.play().catch(err => { 
                console.log('音乐播放需用户交互后触发：', err); 
            }); 
            } 
        
        
            // 8. 核心函数3：生成单个动态弹窗（对应原加密代码_0x188adf） 
            function createPopup() { 
            // 避免弹窗过多导致页面卡顿 
            if (currentPopupCount >= config.maxPopupCount) { 
                clearInterval(popupTimer); 
                popupTimer = null; 
                return; 
            } 
        
            // 创建弹窗容器 
            const popup = document.createElement('div'); 
            // 随机添加样式（主题+动画） 
            const randomTheme = getRandomItem(config.popupThemes); 
            const randomAnim = getRandomItem(config.popupAnims); 
            popup.className = `popup ${randomTheme} ${randomAnim}`; 
        
            // 创建弹窗头部（南瓜图标+标题） 
            const popupHeader = document.createElement('div'); 
            popupHeader.className = 'popup-header'; 
            popupHeader.innerHTML = ` 
            <span class="popup-icon">🎃</span> 
            <span class="popup-title">节日惊喜</span> 
            `; 
        
            // 创建弹窗内容（随机取配置中的文字） 
            const popupContent = document.createElement('div'); 
            popupContent.className = 'popup-content'; 
            popupContent.textContent = getRandomItem(config.popupTexts); 
        
            // 组装弹窗 
            popup.appendChild(popupHeader); 
            popup.appendChild(popupContent); 
        
            // 计算弹窗随机位置（避免超出屏幕） 
            const windowWidth = window.innerWidth; 
            const windowHeight = window.innerHeight; 
            const popupWidth = 120; // 弹窗基础宽度 
            const popupHeight = 80; // 弹窗基础高度 
            // 随机left（0 ~ 屏幕宽度-弹窗宽度） 
            const randomLeft = Math.floor(Math.random() * (windowWidth - popupWidth)); 
            // 随机top（0 ~ 屏幕高度-弹窗高度） 
            const randomTop = Math.floor(Math.random() * (windowHeight - popupHeight)); 
            // 随机旋转角度（-5° ~ 5°） 
            const randomRotate = Math.floor(Math.random() * 11) - 5; 
        
            // 设置弹窗样式（位置+旋转+层级） 
            popup.style.left = `${randomLeft}px`; 
            popup.style.top = `${randomTop}px`; 
            popup.style.setProperty('--rotation', `${randomRotate}deg`); // 使用CSS变量设置旋转角度
            popup.style.zIndex = 64 + currentPopupCount; // 弹窗层级递增 
        
            // 添加到页面 
            popupLayer.appendChild(popup); 
            currentPopupCount++; 
            } 
        
        
            // 9. 核心函数4：启动弹窗定时器（对应原加密代码_0x341977） 
            function startPopupTimer() { 
            if (popupTimer) return; // 避免重复启动 
            // 每隔100毫秒生成一个弹窗 
            popupTimer = setInterval(createPopup, config.popupInterval); 
            } 
        
        
            // 10. 确定按钮点击事件（对应原加密代码_0x12bfb3的核心逻辑） 
            function handleConfirmClick() { 
            hideStartModal();    // 隐藏初始弹窗 
            playBgMusic();       // 播放背景音乐 
            startPopupTimer();   // 启动动态弹窗 
            } 
        
        
            // 11. 绑定事件（点击+键盘回车触发） 
            // 点击确定按钮 
            confirmBtn.addEventListener('click', handleConfirmClick); 
            // 按回车键触发（兼容键盘操作） 
            document.addEventListener('keydown', function(e) { 
            if (e.key === 'Enter') { 
                handleConfirmClick(); 
            } 
            }); 
        });
    </script>
</body>
</html>