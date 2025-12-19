import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bold, Italic, List, Link as LinkIcon, Code, Quote, Heading1, Heading2, Heading3, Eye, Pencil, Check, Copy } from "lucide-react";
import { notify } from "@/lib/toast/notify";

// Mirroring backend logic from backend/src/utils/convertBlogContent.js
const convertToSlug = (title) => {
    if (!title) return '';
    return title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '-')
        .replace(/[\s-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const convertToExcerpt = (markdownContent, length = 150) => {
    if (!markdownContent) return '';

    // 1. Remove Code Blocks (```...```) to avoid picking code as excerpt
    let cleanText = markdownContent.replace(/```[\s\S]*?```/g, "");

    // 2. Remove Images (![alt](url))
    cleanText = cleanText.replace(/!\[.*?\]\(.*?\)/g, "");

    // 3. Remove Links ([text](url)) -> keep text
    cleanText = cleanText.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

    // 4. Remove HTML tags
    cleanText = cleanText.replace(/<[^>]*>/g, "");

    // 5. Split into lines to process headers and find first para
    const lines = cleanText.split('\n');

    let firstPara = "";

    for (const line of lines) {
        const trimmed = line.trim();
        // Skip empty lines
        if (!trimmed) continue;
        // Skip Headers (# Header)
        if (trimmed.startsWith('#')) continue;
        // Skip Blockquotes (> Quote) - optionally we could keep them, but user wants first 'para'
        if (trimmed.startsWith('>')) continue;
        if (trimmed.startsWith('```')) continue;
        if (trimmed.startsWith('_')) continue;
        // Skip Horizontal Rules (---)
        if (trimmed.match(/^[-*_]{3,}$/)) continue;

        // If we found a line that looks like text (starts with word char or bullet point)
        // User mentioned "starts with '-' or normal words"
        if (trimmed.match(/^[a-zA-Z0-9\-_*]/)) {
            // Clean up bold/italic markers from this line
            firstPara = trimmed
                .replace(/(\*\*|__)(.*?)\1/g, "$2")
                .replace(/(\*|_)(.*?)\1/g, "$2")
                .replace(/`(.+?)`/g, "$1");
            break;
        }
    }

    if (!firstPara) return "";

    return firstPara.length > length
        ? firstPara.substring(0, length) + "..."
        : firstPara;
};

// Custom Pre/Code Block Component
const CodeBlock = ({ children, ...props }) => {
    // Attempt to find the language from the inner code element's className
    // data-language might be set by rehype-highlight if used, but we are using basic remark
    // Usually children is a <code> element with className="language-xyz"

    let language = "text";
    let codeContent = children;

    try {
        if (React.isValidElement(children) && children.type === 'code') {
            const className = children.props.className || "";
            const match = /language-(\w+)/.exec(className);
            if (match) {
                language = match[1];
            }
            // If the child is code, we want to render it directly or get its children
            codeContent = children.props.children;
        }
    } catch (e) {
        console.warn("Failed to parse code block language", e);
    }

    const copyToClipboard = () => {
        if (!codeContent) return;
        // codeContent could be an array of strings or a string
        const textToCopy = Array.isArray(codeContent) ? codeContent.join('') : String(codeContent);
        navigator.clipboard.writeText(textToCopy);
        notify("Code copied to clipboard", "success");
    };

    return (
        <div className="my-6 rounded-lg border bg-card text-card-foreground shadow-sm w-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between bg-muted/60 px-4 py-2 border-b">
                <span className="text-xs font-medium font-mono text-muted-foreground uppercase">
                    {language}
                </span>
                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyToClipboard}>
                                <Copy className="h-3 w-3" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Copy code</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            {/* Content */}
            <div className="p-4 overflow-x-auto bg-muted/20">
                <pre className="m-0! p-0! bg-transparent! text-sm font-mono leading-relaxed" {...props}>
                    {children}
                </pre>
            </div>
        </div>
    );
};

export default function MarkdownEditor({
    value = "",
    onChange,
    label = "Content",
    disabled = false,
    title = "", // New prop
    required = false,
    isBlog = false
}) {
    const [view, setView] = useState("edit");
    const [metaRequest, setMetaRequest] = useState({ slug: '', excerpt: '' });

    useEffect(() => {
        // Use the passed title prop for slug, fallback to empty
        // Use content for excerpt
        const excerpt = convertToExcerpt(value);

        setMetaRequest({
            slug: convertToSlug(title),
            excerpt: excerpt
        });
    }, [value, title]);

    const insertAtCursor = (before, after = "") => {
        const textarea = document.getElementById("markdown-editor-input");
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);
        const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
        onChange(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    const toolbarActions = [
        { icon: Bold, label: "Bold", action: () => insertAtCursor("**", "**") },
        { icon: Italic, label: "Italic", action: () => insertAtCursor("*", "*") },
        { icon: Heading1, label: "H1", action: () => insertAtCursor("# ") },
        { icon: Heading2, label: "H2", action: () => insertAtCursor("## ") },
        { icon: Heading3, label: "H3", action: () => insertAtCursor("### ") },
        { icon: List, label: "List", action: () => insertAtCursor("- ") },
        { icon: Quote, label: "Quote", action: () => insertAtCursor("> ") },
        { icon: Code, label: "Code", action: () => insertAtCursor("```\n", "\n```") },
        { icon: LinkIcon, label: "Link", action: () => insertAtCursor("[", "](url)") },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label>{label}{required && <span className="text-red-500">*</span>}</Label>
                <Tabs value={view} onValueChange={setView} className="w-[200px]">
                    <TabsList className="grid w-full grid-cols-2 h-8">
                        <TabsTrigger value="edit" className="text-xs"><Pencil className="w-3 h-3 mr-1" /> Edit</TabsTrigger>
                        <TabsTrigger value="preview" className="text-xs"><Eye className="w-3 h-3 mr-1" /> Preview</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="border rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 overflow-hidden shadow-sm">
                {view === 'edit' && (
                    <>
                        <div className="flex items-center gap-1 p-2 border-b bg-muted/40 overflow-x-auto">
                            {toolbarActions.map((item, idx) => (
                                <Button
                                    key={idx}
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={item.action}
                                    disabled={disabled}
                                    className="h-8 w-8 p-0"
                                    title={item.label}
                                >
                                    <item.icon className="h-4 w-4" />
                                </Button>
                            ))}
                        </div>
                        <textarea
                            id="markdown-editor-input"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            disabled={disabled}
                            className="w-full min-h-[500px] p-6 bg-transparent outline-none resize-y font-mono text-sm leading-relaxed"
                            placeholder="Write your amazing blog post here... (Supports Markdown)"
                        />
                    </>
                )}

                {view === 'preview' && (
                    <div className="w-full min-h-[500px] p-8 prose dark:prose-invert max-w-none overflow-y-auto
                        /* Inline Code Styling */
                        [&_:not(pre)>code]:bg-accent/40 
                        [&_:not(pre)>code]:text-accent-foreground 
                        [&_:not(pre)>code]:px-1.5 
                        [&_:not(pre)>code]:py-0.5 
                        [&_:not(pre)>code]:rounded 
                        [&_:not(pre)>code]:font-mono 
                        [&_:not(pre)>code]:text-[0.9em]
                        [&_:not(pre)>code]:border
                        [&_:not(pre)>code]:border-accent/20
                        
                        /* Reset Pre/Code for Block to let custom component handle it */
                        [&_pre]:bg-transparent [&_pre]:p-0 [&_pre]:m-0
                    ">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                // Override pre to create the block window
                                pre: CodeBlock,
                                blockquote: ({ children }) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">{children}</blockquote>,
                                img: ({ src, alt }) => <img src={src} alt={alt} className="rounded-lg border shadow-sm my-6 w-full max-h-[600px] object-cover" />,
                                a: ({ href, children }) => <a href={href} className="text-primary font-medium hover:underline underline-offset-4 decoration-primary/50" target="_blank" rel="noopener noreferrer">{children}</a>,
                                ul: ({ children }) => <ul className="list-disc list-outside ml-6 my-4 space-y-2 marker:text-muted-foreground">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-outside ml-6 my-4 space-y-2 marker:text-muted-foreground">{children}</ol>,
                                h1: ({ children }) => <h1 className="text-4xl font-extrabold tracking-tight mt-10 mb-6 pb-2 border-b">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-3xl font-bold tracking-tight mt-10 mb-6">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-2xl font-semibold tracking-tight mt-8 mb-4">{children}</h3>,
                                p: ({ children }) => <p className="leading-7 my-4 not-last:mb-6">{children}</p>,
                            }}
                        >
                            {value || "*Nothing to preview*"}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            {/* Metadata Preview Footer */}
            {isBlog && <div className="grid md:grid-cols-2 gap-4 pt-2 text-sm text-muted-foreground bg-muted/10 p-4 rounded-lg border border-dashed">
                <div>
                    <span className="font-semibold text-foreground flex items-center gap-2">
                        <LinkIcon className="h-3 w-3" /> Slug
                    </span>
                    <span className="font-mono text-xs block mt-2 bg-muted/50 p-2 rounded">{metaRequest.slug || "(Start text with # Title)"}</span>
                </div>
                <div>
                    <span className="font-semibold text-foreground flex items-center gap-2">
                        <Quote className="h-3 w-3" /> Excerpt
                    </span>
                    <span className="block mt-2 line-clamp-2 text-xs italic bg-muted/50 p-2 rounded">{metaRequest.excerpt || "(Write content to generate)"}</span>
                </div>
            </div>}
        </div>
    );
}
