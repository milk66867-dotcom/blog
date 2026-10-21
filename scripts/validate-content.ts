// scripts/validate-content.ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import pc from 'picocolors';
import { PostFrontmatterSchema } from '../src/domain/schemas/post.schema';

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

console.log(pc.cyan('🔍 开始校验文章内容...'));

const files = getAllMarkdownFiles(postsDir);
let hasError = false;

for (const file of files) {
    const relativePath = path.relative(process.cwd(), file);
    const content = fs.readFileSync(file, 'utf-8');
    const { data: frontmatter } = matter(content);

    const result = PostFrontmatterSchema.safeParse(frontmatter);

    if (!result.success) {
        hasError = true;
        console.error(pc.red(`\n❌ Schema 校验失败: ${relativePath}`));
        const errors = result.error.flatten().fieldErrors;
        for (const [field, messages] of Object.entries(errors)) {
            console.error(pc.yellow(`   - 字段 [${field}]: ${messages?.join(', ')}`));
        }
    } else {
        // Schema 校验通过后，强制检查 tags 和 summary
        let customError = false;

        if (!frontmatter.tags || !Array.isArray(frontmatter.tags) || frontmatter.tags.length === 0) {
            hasError = true;
            customError = true;
            console.error(pc.red(`\n❌ 业务校验失败: ${relativePath}`));
            console.error(pc.yellow(`   - 必须包含标签 (tags)，例如: tags: ["无标签"]`));
        }

        if (!frontmatter.summary || frontmatter.summary.trim() === '') {
            hasError = true;
            if (!customError) {
                console.error(pc.red(`\n❌ 业务校验失败: ${relativePath}`));
            }
            console.error(pc.yellow(`   - 必须包含摘要 (summary)，例如: summary: "无摘要"`));
        }
    }
}

if (hasError) {
    console.error(pc.red(`\n❌ 内容校验未通过，请修复上述错误。`));
    process.exit(1);
} else {
    console.log(pc.green(`\n✅ 所有 ${files.length} 篇文章校验通过！`));
}