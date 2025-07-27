// 全局变量
let processedSentences = [];
let originalText = '';

/**
 * 去掉标点符号并按句子分行
 * 这是Python脚本的JavaScript版本实现
 */
function removePunctuationAndSplitSentences(text) {
    // 定义中文和英文标点符号
    const chinesePunctuation = '！？｡。＂＃＄％＆＇（）＊＋，－／：；＜＝＞＠［＼］＾＿｀｛｜｝～｟｠｢｣､、〃》「」『』【】〔〕〖〗〘〙〚〛〜〝〞〟〰〱〲〳〴〵〶〷〸〹〺〻〼〽〾〿';
    const englishPunctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
    const allPunctuation = chinesePunctuation + englishPunctuation;

    // 扩展分句标点符号，包括更多常用的分句符号
    const sentenceSeparators = [
        '。', '！', '？',  // 中文句子结束符
        '.', '!', '?',    // 英文句子结束符
        '，', '、',        // 中文逗号和顿号
        ',',              // 英文逗号
        '；', ';',        // 分号
        '：', ':',        // 冒号
        '（', '）',       // 中文括号
        '(', ')',         // 英文括号
        '【', '】',       // 中文方括号
        '[', ']',         // 英文方括号
        '「', '」',       // 中文引号
        '『', '』',       // 中文书名号
        '"', '"',         // 中文双引号
        "'", "'",         // 中文单引号
        '"', "'",         // 英文引号
    ];

    // 创建正则表达式模式，转义特殊字符
    const escapedSeparators = sentenceSeparators.map(char => 
        char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    const pattern = new RegExp(`([${escapedSeparators.join('')}])`, 'g');
    
    // 使用正则表达式分割句子，保留分割符
    const parts = text.split(pattern);

    const sentences = [];
    let currentSentence = "";

    for (const part of parts) {
        if (sentenceSeparators.includes(part)) {
            // 如果是分句符号，完成当前句子
            if (currentSentence.trim()) {
                sentences.push(currentSentence.trim());
            }
            currentSentence = "";
        } else {
            // 如果不是分句符号，添加到当前句子
            currentSentence += part;
        }
    }

    // 处理最后一个句子（如果没有分句符号结尾）
    if (currentSentence.trim()) {
        sentences.push(currentSentence.trim());
    }

    // 去掉每个句子中的标点符号
    const cleanedSentences = [];
    for (const sentence of sentences) {
        // 去掉标点符号
        let cleanedSentence = '';
        for (const char of sentence) {
            if (!allPunctuation.includes(char)) {
                cleanedSentence += char;
            }
        }
        
        // 去掉多余的空格
        cleanedSentence = cleanedSentence.replace(/\s+/g, '');

        if (cleanedSentence) {  // 只保留非空句子
            cleanedSentences.push(cleanedSentence);
        }
    }

    return cleanedSentences;
}

/**
 * 处理文件上传
 */
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // 检查文件类型
    const allowedTypes = ['text/plain', 'text/markdown'];
    const fileName = file.name.toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !fileName.endsWith('.md') && !fileName.endsWith('.txt')) {
        showError('请上传 .txt 或 .md 文件');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        document.getElementById('inputText').value = content;
        showSuccess(`文件 "${file.name}" 上传成功！`);
        
        // 切换到文件上传模式的视觉反馈
        document.querySelectorAll('.input-method').forEach(method => {
            method.classList.remove('active');
        });
        document.querySelector('.file-upload').classList.add('active');
    };
    
    reader.onerror = function() {
        showError('文件读取失败，请重试');
    };
    
    reader.readAsText(file, 'utf-8');
}

/**
 * 切换到文本输入模式
 */
function switchToTextInput(event) {
    document.querySelectorAll('.input-method').forEach(method => {
        method.classList.remove('active');
    });
    event.target.closest('.input-method').classList.add('active');
    document.getElementById('inputText').focus();
}

/**
 * 处理文本
 */
function processText() {
    const inputText = document.getElementById('inputText').value.trim();
    
    if (!inputText) {
        showError('请输入要处理的文本');
        return;
    }

    // 显示加载状态
    showLoading(true);
    hideMessages();

    // 在输出区域显示处理状态
    const outputContent = document.getElementById('outputContent');
    outputContent.innerHTML = `
        <div class="processing-indicator">
            <div class="icon">⚡</div>
            <div>正在处理文本...</div>
            <div style="font-size: 0.9em; margin-top: 10px; color: #666;">
                文本长度: ${inputText.length} 字符
            </div>
        </div>
    `;
    outputContent.classList.remove('empty');

    // 使用setTimeout来让UI有时间更新
    setTimeout(() => {
        try {
            originalText = inputText;
            
            console.log('开始处理文本...');
            console.log('原始文本长度:', originalText.length);
            
            // 处理文本
            processedSentences = removePunctuationAndSplitSentences(originalText);
            
            console.log('处理完成，句子数量:', processedSentences.length);
            
            // 更新统计信息
            updateStats();

            // 显示输出结果
            showOutput();

            // 启用按钮
            document.getElementById('downloadBtn').disabled = false;
            document.getElementById('copyBtn').disabled = false;
            
            showSuccess(`处理完成！共生成 ${processedSentences.length} 个句子`);
            
        } catch (error) {
            console.error('处理文本时出错:', error);
            showError('处理文本时出错: ' + error.message);
        } finally {
            showLoading(false);
        }
    }, 100);
}

/**
 * 更新统计信息
 */
function updateStats() {
    const processedText = processedSentences.join('');

    document.getElementById('originalLength').textContent = originalText.length.toLocaleString();
    document.getElementById('sentenceCount').textContent = processedSentences.length.toLocaleString();
    document.getElementById('processedLength').textContent = processedText.length.toLocaleString();
}

/**
 * 显示输出结果
 */
function showOutput() {
    const outputContent = document.getElementById('outputContent');

    if (processedSentences.length === 0) {
        outputContent.innerHTML = '没有处理结果';
        outputContent.classList.add('empty');
        return;
    }

    outputContent.classList.remove('empty');

    const html = processedSentences.map((sentence) =>
        `<div class="sentence-line">${escapeHtml(sentence)}</div>`
    ).join('');

    outputContent.innerHTML = html;

    // 滚动到顶部
    outputContent.scrollTop = 0;

    // 设置滚动监听
    setupScrollListener();
}

/**
 * 设置滚动监听
 */
function setupScrollListener() {
    const outputContent = document.getElementById('outputContent');
    const scrollToTopBtn = document.getElementById('scrollToTop');

    outputContent.addEventListener('scroll', function() {
        if (this.scrollTop > 200) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
}

/**
 * 滚动到顶部
 */
function scrollToTop() {
    const outputContent = document.getElementById('outputContent');
    outputContent.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * 复制结果到剪贴板
 */
function copyResult() {
    if (processedSentences.length === 0) {
        showError('没有可复制的内容');
        return;
    }

    try {
        const content = processedSentences.join('\n');

        // 使用现代的 Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(content).then(() => {
                showSuccess('结果已复制到剪贴板！');
            }).catch(err => {
                console.error('复制失败:', err);
                fallbackCopyTextToClipboard(content);
            });
        } else {
            // 降级方案
            fallbackCopyTextToClipboard(content);
        }
    } catch (error) {
        console.error('复制失败:', error);
        showError('复制失败: ' + error.message);
    }
}

/**
 * 降级复制方案
 */
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // 避免滚动到底部
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showSuccess('结果已复制到剪贴板！');
        } else {
            showError('复制失败，请手动复制');
        }
    } catch (err) {
        console.error('降级复制也失败:', err);
        showError('复制失败，请手动复制');
    }

    document.body.removeChild(textArea);
}

/**
 * 下载结果
 */
function downloadResult() {
    if (processedSentences.length === 0) {
        showError('没有可下载的内容');
        return;
    }

    try {
        const content = processedSentences.join('\n');
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'processed_text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showSuccess('文件下载成功！');
    } catch (error) {
        console.error('下载失败:', error);
        showError('下载失败: ' + error.message);
    }
}

/**
 * 清空所有内容
 */
function clearAll() {
    document.getElementById('inputText').value = '';
    document.getElementById('fileInput').value = '';
    document.getElementById('downloadBtn').disabled = true;
    document.getElementById('copyBtn').disabled = true;

    // 重置输出区域
    const outputContent = document.getElementById('outputContent');
    outputContent.innerHTML = '等待处理文本...';
    outputContent.classList.add('empty');

    // 隐藏回到顶部按钮
    document.getElementById('scrollToTop').classList.remove('visible');

    // 重置统计
    document.getElementById('originalLength').textContent = '0';
    document.getElementById('sentenceCount').textContent = '0';
    document.getElementById('processedLength').textContent = '0';

    processedSentences = [];
    originalText = '';

    hideMessages();
    showSuccess('已清空所有内容');
}

/**
 * 显示/隐藏加载状态
 */
function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

/**
 * 显示错误消息
 */
function showError(message) {
    hideMessages();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.querySelector('.controls').after(errorDiv);
    
    // 3秒后自动隐藏
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 3000);
}

/**
 * 显示成功消息
 */
function showSuccess(message) {
    hideMessages();
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    document.querySelector('.controls').after(successDiv);
    
    // 3秒后自动隐藏
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 3000);
}

/**
 * 隐藏所有消息
 */
function hideMessages() {
    document.querySelectorAll('.error, .success').forEach(el => {
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    });
}

/**
 * HTML转义
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 显示关于对话框
 */
function showAbout() {
    const aboutText = `
🚀 文本标点符号处理工具

✨ 功能特点：
• 智能去除中文和英文标点符号
• 按标点符号位置自动分句
• 支持文件上传和直接输入
• 一键复制和下载结果
• 纯前端处理，数据安全

🛠️ 技术栈：
• HTML5 + CSS3 + JavaScript
• 无依赖，纯原生实现
• 响应式设计，支持移动端

📄 开源协议：MIT License
💡 基于原Python脚本的JavaScript实现

感谢使用！`;

    alert(aboutText);
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('文本处理工具已加载');
    
    // 为文本框添加拖拽上传功能
    const textarea = document.getElementById('inputText');
    
    textarea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.borderColor = '#4facfe';
        this.style.backgroundColor = '#f0f8ff';
    });
    
    textarea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.borderColor = '#ddd';
        this.style.backgroundColor = 'white';
    });
    
    textarea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.borderColor = '#ddd';
        this.style.backgroundColor = 'white';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            // 模拟文件输入事件
            const event = { target: { files: [file] } };
            handleFileUpload(event);
        }
    });
});
