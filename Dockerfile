# 镜像名称
FROM node:20.11.1-slim
# 容器内部工作文件夹
WORKDIR /app
# 复制package.json
COPY package.json /app/package.json
# 下载依赖
RUN npm install
# 复制整个文件夹
# 已使用 .dockerignore 排除不需要上传的文件
COPY . .
# 安装prisma 提示升级这个
RUN apt-get update -y && apt-get install -y openssl
# 安装prisma
RUN npm i prisma -g
# 暴露 3000端口
EXPOSE 3000
# 容器启动时运行的命令
# !!! 有些命令需要等待数据完成才可以执行
CMD npx prisma generate && npm run start