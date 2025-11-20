// scripts/fix-imports.js
import fs from "fs";
import path from "path";

const rootDir = path.resolve(".");

// Regex to match import/export statements
const importRegex =
    /\b(from\s*["'])(\.{1,2}\/[^"']+)(["'])/g;

function fixFileImports(filePath) {
    let code = fs.readFileSync(filePath, "utf8");
    let changed = false;

    const newCode = code.replace(importRegex, (match, p1, importPath, p3) => {
        // ignore if already has extension
        if (/\.[a-zA-Z]+$/.test(importPath)) return match;

        // append .js
        const fixed = `${p1}${importPath}.js${p3}`;
        changed = true;
        return fixed;
    });

    if (changed) {
        console.log("Fixed imports in:", filePath);
        fs.writeFileSync(filePath, newCode, "utf8");
    }
}

function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            walkDir(fullPath);
        } else if (entry.isFile() && fullPath.endsWith(".ts")) {
            fixFileImports(fullPath);
        } else if (entry.isFile() && fullPath.endsWith(".tsx")) {
            fixFileImports(fullPath);
        } else if (entry.isFile() && fullPath.endsWith(".jsx")) {
            fixFileImports(fullPath);
        }
    }
}

console.log("🔧 Fixing ESM import paths in dist/...\n");
walkDir(rootDir);
console.log("\n🎉 Import paths fixed successfully!");
