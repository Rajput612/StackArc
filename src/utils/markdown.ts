import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import fs from 'node:fs/promises';
import path from 'node:path';

// Configure marked to use highlight.js for code highlighting
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).value;
            } catch (err) {}
        }
        return code;
    },
    breaks: true,
    gfm: true
});

export async function loadMarkdownContent(topicId: string, courseType: string): Promise<string> {
    try {
        const filePath = path.join(
            process.cwd(),
            'src',
            'content',
            'courses',
            courseType,
            `${topicId}.md`
        );
        
        const markdown = await fs.readFile(filePath, 'utf-8');
        return marked(markdown);
    } catch (error) {
        console.error('Error loading markdown content:', error);
        return `<div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h2 class="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Content Coming Soon</h2>
            <p class="text-yellow-700 dark:text-yellow-300">We're working on creating this content. Check back soon!</p>
        </div>`;
    }
}
