// scripts/migrate.ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import pc from 'picocolors';

const postsDir = path.join(process.cwd(), 'src/content/posts');

function getAllMarkdownFiles(dir: string): string[] {
    let files: string[] = [];
    if (!fs.existsSync(dir)) return files;

    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            files = files.concat(getAllMarkdownFiles(fullPath));
        } else if (item.name.endsWith('.md') || item.name.endsWith('.mdx')) {
            files.push(fullPath);
        }
    }
    return files;
}

console.log(pc.cyan('🚀 开始执行数据迁移（补齐 tags 和 summary）...'));

const files = getAllMarkdownFiles(postsDir);
let migratedCount = 0;

for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');

    // 使用 gray-matter 解析
    const parsed = matter(content);
    const data = parsed.data;
    const body = parsed.content;

    let modified = false;

    // 1. 检查并补齐 tags
    if (!data.tags || !Array.isArray(data.tags) || data.tags.length === 0) {
        data.tags = ["无标签"];
        modified = true;
    }

    // 2. 检查并补齐 summary
    if (!data.summary || data.summary.trim() === '') {
        data.summary = "无摘要";
        modified = true;
    }

    // 如果有修改，则覆盖写回文件
    if (modified) {
        // matter.stringify 会自动把 data 对象转换回 YAML 格式，并拼接 body
        const newContent = matter.stringify(body, data);
        fs.writeFileSync(file, newContent, 'utf-8');

        migratedCount++;
        console.log(pc.green(`✅ 已自动补齐: ${path.relative(process.cwd(), file)}`));
    }
}

console.log(pc.cyan(`\n🎉 迁移完成！共处理了 ${migratedCount} 个文件。`));