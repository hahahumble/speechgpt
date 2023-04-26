# SpeechGPT 开发指南
本开发指南概述了 SpeechGPT 项目、技术栈和文件结构。按照以下说明开始开发。

## 技术栈
SpeechGPT 使用以下技术栈：

- [React 18](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TailwindCSS](https://tailwindcss.com/)

## 文件结构
项目组织如下：

```text
.
├── .github
├── assets
├── docs
├── public
└── src
    ├── apis
    ├── assets
    ├── components
    ├── constants
    ├── css
    ├── db
    ├── helpers
    ├── locales
    ├── pages
    ├── store
    ├── typings
    └── utils
```

## 目录描述
- `.github`: 包含 GitHub Actions 工作流和配置。
- `assets`: 包含项目特定的资源，如图像或其他媒体文件。
- `docs`: 存放项目文档文件。
- `public`: 包含项目中使用的静态文件和资源。
- `src`: 应用程序的主要源代码目录。
  - `apis`: 包含 API 相关的函数和配置。
  - `components`: 存放应用程序中使用的 React 组件。
  - `constants`: 包含常量值和配置。
  - `css`: 存放项目的 CSS 文件和样式。
  - `db`: 包含数据库配置和相关文件。
  - `helpers`: 存储特定任务和逻辑的辅助函数。
  - `locales`: 存放本地化和国际化文件。
  - `pages`: 包含应用程序的主要页面组件。
  - `store`: 包含 Redux 存储配置和相关文件。
  - `typings`: 包含 TypeScript 类型定义和接口。
  - `utils`: 存储实用函数和辅助方法。

## Git 提交指南
在将更改提交到仓库时，请遵循这些提交消息约定，以保持一致且可读的 Git 历史记录：

- `feat`：新增功能或对现有功能的修改。
- `fix`：修复 bug。
- `docs`：文档文件的更改。
- `style`：不影响代码执行的格式更改（例如，空格、格式化、缺失的分号等）。
- `refactor`：既非新功能，也非 bug 修复，但能提高代码质量的更改。
- `perf`：提高性能的代码更改。
- `test`：添加缺失的测试或更新现有测试。
- `revert`：撤销以前的提交（例如，revert: type(scope): subject（回滚到版本：xxxx））。

## 开始
1. 克隆仓库。
```shell
git clone https://github.com/hahahumble/speechgpt.git
```

2. 安装所需的依赖项。
```shell
yarn install
```

3. 启动开发服务器。应用程序应可在 http://localhost:5173 上访问。
```shell
yarn dev 
```

4. 为生产环境构建应用程序。输出文件将位于 dist 目录中。
```shell
yarn build
```

5. 以生产模式运行应用程序。应用程序应可在 http://localhost:4173 上访问。
```shell
yarn serve
```

代码格式化（使用 Prettier）。
```shell
yarn format
```

🚀 开始您的 SpeechGPT 开发之旅吧！如果您在开发过程中遇到任何问题，请随时查阅相关文档或在 GitHub 上提交问题。祝您开发愉快！🎉
