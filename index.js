const fs = require('fs');
const parseMarkdown = require('./src/espanso-generation/parseMarkdown');
const generateYaml = require('./src/espanso-generation/generateYaml');
const { extractScripts } = require('./src/extract-scripts');
const glob = require('glob');

console.log('🚀 Starting script...');

const espansoConfigPath = `${process.env.HOME}/Library/Application Support/espanso/match/packages/ai-driven-dev-prompts-private`;

if (!fs.existsSync(espansoConfigPath)) {
  console.log('📂 Creating espanso config directory...');
  fs.mkdirSync(espansoConfigPath, { recursive: true });
}

const PRIVATE_PROMPTS = ['./prompts/private/*'];
const PUBLIC_PROMPTS = [
  './resources/guide/*',
  './resources/prompts/*',
  './resources/prompts/_/*',
  './resources/prompts/languages/*',
  './resources/llm-instructions/*',
  './contributing*',
  './README*',
];

console.log('📝 Writing public prompts...');
fs.writeFileSync(
  './ai-driven-dev-prompts/package.yml',
  getPromptsContentForEspanso(PUBLIC_PROMPTS)
);

console.log('📝 Writing private prompts...');
fs.writeFileSync(
  `${espansoConfigPath}/package.yml`,
  getPromptsContentForEspanso(PRIVATE_PROMPTS)
);

console.log('📝 Writing manifest...');
fs.writeFileSync(
  `${espansoConfigPath}/_manifest.yml`,
  `name: 'ai-driven-dev-prompts-private'
title: 'AI Driven Dev Prompts (Private)'
description: A collection of your private prompts (not committed onto GitHub).
version: 0.1.0
author: alexsoyes ()
website: https://github.com/alexsoyes/ai-driven-dev-community`
);

console.log('📝 Writing README...');
fs.writeFileSync(`${espansoConfigPath}/README.md`, `Your custom prompts!`);

console.log('🔍 Extracting scripts from markdown...');
extractScriptsFromMarkdownToFiles(PUBLIC_PROMPTS);

console.log('✅ Script finished.');

function getPromptsContentForEspanso(directories) {
  console.log('🔄 Generating prompts content for Espanso...');
  const header = 'matches:\n';
  let yamlContent = header;

  for (const promptDirectory of directories) {
    const markdownFiles = glob.sync(promptDirectory + '.md');

    for (const markdownFile of markdownFiles) {
      yamlContent += getPrompts(markdownFile);
    }
  }

  return yamlContent;
}

function getPrompts(filePath) {
  console.log(`🔄 Generating prompts for file "${filePath}"`);
  const markdownText = fs.readFileSync(filePath, 'utf8');
  const espansoConfig = parseMarkdown(markdownText);
  return generateYaml(espansoConfig).split('\n').slice(1).join('\n') + '\n';
}

function extractScriptsFromMarkdownToFiles(directories) {
  console.log('🔄 Extracting scripts from markdown files...');
  for (const promptDirectory of directories) {
    const markdownFiles = glob.sync(promptDirectory + '.md');

    for (const markdownFile of markdownFiles) {
      extractScripts(markdownFile);
    }
  }
}