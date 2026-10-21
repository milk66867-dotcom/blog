// scripts/new-post.ts
import fs from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';
import { slugify } from '../src/domain/utils/slug';

const rawTitle = process.argv.slice(2).join(' ');

if (!rawTitle) {
    console.error(pc.red('❌ 请提供文章标题，例如: npm run new-post -- "我的第一篇博客"'));
    process.exit(1);
}

const slug = slugify(rawTitle);
const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const filename = `${date}-${slug}.md`;
const filePath = path.join(process.cwd(), 'src/content/posts', filename);

if (fs.existsSync(filePath)) {
    console.error(pc.red(`❌ 文件已存在: ${filename}`));
    process.exit(1);
}

const template = `---
title: "${rawTitle}"
date: "${new Date().toISOString()}"
tags: ["无标签"]
category: "未分类"
summary: "无摘要"
style: "github"
draft: false
toc: true
comments: true
math: false
mermaid: false
---

# ${rawTitle}

在这里开始编写正文内容...
`;

fs.mkdirSync(path.dirname(filePath), { recursive: true });
fs.writeFileSync(filePath, template, 'utf-8');

console.log(pc.green(`✅ 成功创建文章: src/content/posts/${filename}`));
console.log(pc.cyan(`👉 请修改 frontmatter 中的 draft 为 false 以发布。`));