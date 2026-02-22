# GitHub Pages 启用指南

## 为什么在 GitHub 上看不到数据和分析？

因为 GitHub 直接显示 HTML 源码，不会渲染成网页。需要启用 GitHub Pages 才能看到渲染后的页面。

---

## 如何启用 GitHub Pages

### 步骤 1：进入仓库设置
1. 访问：https://github.com/balangate6202-ux/show/settings
2. 点击左侧菜单的 "Pages"

### 步骤 2：配置 Pages
1. 在 "Build and deployment" 部分
2. "Source" 选择：**Deploy from a branch**
3. "Branch" 选择：**main** 或 **gh-pages**
4. 文件夹选择：**/(root)**
5. 点击 **Save**

### 步骤 3：等待部署
- 等待 2-5 分钟
- 页面会显示："Your site is live at https://balangate6202-ux.github.io/show/"

---

## 启用后的访问地址

### 首页
https://balangate6202-ux.github.io/show/

### 宏观分析页面
https://balangate6202-ux.github.io/show/macro-analysis.html

---

## 方案 2：下载到本地查看（临时方案）

### 步骤 1：下载文件
1. 访问：https://github.com/balangate6202-ux/show
2. 点击绿色的 "Code" 按钮
3. 选择 "Download ZIP"
4. 解压到本地

### 步骤 2：用浏览器打开
1. 找到解压后的文件夹
2. 双击 `index.html` 或 `macro-analysis.html`
3. 用浏览器打开即可看到渲染后的页面

---

## 方案 3：克隆仓库到本地（开发者方案）

```bash
git clone https://github.com/balangate6202-ux/show.git
cd show
# 用浏览器打开 index.html
```

---

## 推荐方案

**推荐使用方案 1（GitHub Pages）**，因为：
- ✅ 永久在线访问
- ✅ 自动更新（每次 push 后自动部署）
- ✅ 无需本地文件
- ✅ 可以分享链接给他人

---

## 启用 GitHub Pages 后

每次你推送新代码到 GitHub，GitHub Pages 会自动重新部署，通常只需要 1-2 分钟。

---

## 验证是否启用成功

1. 访问：https://balangate6202-ux.github.io/show/
2. 如果看到首页，说明成功了！
3. 点击"宏观分析"链接，可以看到完整的数据和分析

---

*创建时间：2026-02-22*
