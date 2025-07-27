# 文本标点符号处理工具 🚀

一个纯前端的文本处理工具，可以去除标点符号并按句子分行。支持中文和英文文本处理。

## 🌟 在线体验

**[点击这里在线使用](https://your-site.pages.dev)** *(部署后更新链接)*

## ✨ 功能特点

- 🔧 **智能分句** - 按标点符号位置自动分句
- 🗑️ **去除标点** - 移除所有中文和英文标点符号  
- 📱 **响应式设计** - 支持桌面端和移动端
- 📋 **一键复制** - 复制处理结果到剪贴板
- 💾 **文件下载** - 下载处理结果为txt文件
- 📁 **文件上传** - 支持上传txt和md文件
- ⚡ **实时处理** - 无需服务器，纯前端处理

## 🎯 使用方法

1. **输入文本** - 在左侧面板输入或上传文件
2. **开始处理** - 点击"开始处理"按钮
3. **查看结果** - 右侧面板显示处理结果
4. **复制或下载** - 使用复制或下载功能保存结果

## 🛠️ 技术栈

- **HTML5** - 语义化标记
- **CSS3** - 现代样式和动画
- **JavaScript (ES6+)** - 纯原生JS，无依赖
- **响应式设计** - 适配各种设备

## 📱 浏览器支持

- ✅ Chrome 60+
- ✅ Firefox 55+  
- ✅ Safari 12+
- ✅ Edge 79+

## 🚀 本地运行

```bash
# 克隆仓库
git clone https://github.com/your-username/text-punctuation-tool.git

# 进入目录
cd text-punctuation-tool

# 直接打开 index.html 或使用本地服务器
# 方法1: 直接打开
open index.html

# 方法2: 使用Python服务器
python -m http.server 8000

# 方法3: 使用Node.js服务器
npx serve .
```

## 📄 文件结构

```
├── index.html              # 主页面
├── script.js               # JavaScript逻辑
├── test_sample.txt          # 测试样本
├── .gitignore              # Git忽略文件
└── README.md               # 项目说明
```

## 🎨 界面预览

- **左侧面板**: 文本输入和文件上传
- **右侧面板**: 处理结果和统计信息
- **响应式**: 移动端自动切换为上下布局

## 🔧 部署

### Cloudflare Pages
1. Fork 这个仓库
2. 登录 [Cloudflare Pages](https://pages.cloudflare.com/)
3. 连接你的 GitHub 仓库
4. 部署设置保持默认即可

### GitHub Pages
1. 在仓库设置中启用 GitHub Pages
2. 选择 `main` 分支作为源
3. 访问 `https://your-username.github.io/text-punctuation-tool`

### Netlify
1. 登录 [Netlify](https://netlify.com)
2. 拖拽项目文件夹到部署区域
3. 或连接 GitHub 仓库自动部署

## 📝 更新日志

### v1.0.0
- ✅ 基础文本处理功能
- ✅ 左右分栏布局
- ✅ 文件上传支持
- ✅ 一键复制功能
- ✅ 响应式设计
- ✅ 滚动优化

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- 基于原 Python 脚本的 JavaScript 实现
- 使用现代 Web 技术构建
- 感谢所有贡献者和用户反馈
