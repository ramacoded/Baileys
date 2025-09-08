const fs = require('fs')
const path = require('path')

const startPath = '.'
const outputFile = 'project_chatbot.txt'
const ignoreList = [
'node_modules',
'.git',
'.vscode',
'dist',
'build',
outputFile
]

function writeToFile(filePath) {
try {
const fileContent = fs.readFileSync(filePath, 'utf8')
const header = `\n\n--- START FILE: ${filePath} ---\n\n`
const footer = `\n\n--- END FILE: ${filePath} ---\n\n`
fs.appendFileSync(outputFile, header + fileContent + footer, 'utf8')
} catch (err) {
fs.appendFileSync(outputFile, `\n\n--- FAILED TO READ: ${filePath} ---\n\n`, 'utf8')
}
}

function traverseDir(dir) {
const files = fs.readdirSync(dir)
for (const file of files) {
const fullPath = path.join(dir, file)
if (ignoreList.includes(file)) {
continue
}
const stat = fs.statSync(fullPath)
if (stat.isDirectory()) {
traverseDir(fullPath)
} else {
writeToFile(fullPath)
}
}
}

try {
fs.writeFileSync(outputFile, `Project context for ${path.resolve(startPath)}\n`)
traverseDir(startPath)
console.log(`Success: All files have been written to ${outputFile}`)
} catch (err) {
console.error('Error:', err)
}