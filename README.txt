AI 生活课堂

给爸妈、老师和非计算机专业大学生的 AI 入门教程。
包含 15 节课、12 个制作演示、3 个多 AI 验证练习和 42 个提问模板。

本地查看
直接用浏览器打开 dist/index.html。无需安装依赖或运行构建命令。

项目内容
dist/                  网站全部文件，也是 GitHub Pages 的发布目录
.github/workflows/     自动发布配置
项目说明.txt           文件结构和维护说明
全站审核记录.txt       内容审核及修复记录
GitHub发布说明.txt      首次推送和开启 Pages 的步骤
package.ps1            需要 ZIP 时再手动运行；不在发布流程中执行

网站只用 HTML、CSS 和 JavaScript，没有服务器、账号系统或真实 AI 接口。
演示资料和对话均为教学样例；输入内容不会上传，学习进度只保存在本地浏览器。
本地 checks 目录包含开发检查依赖与产物，不提交、不发布。

GitHub Pages 发布
保留仓库内的 dist 目录，不需要把网站文件移动到仓库根目录。
到仓库 Settings → Pages，把 Source 设为 GitHub Actions。
发布任务只上传 dist；推送 main 中的网站修改后会自动更新。
详细操作见 GitHub发布说明.txt。
