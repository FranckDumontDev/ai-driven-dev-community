const parseMarkdown = require('./parseMarkdown');
const convertToYaml = require('./convertToYaml');

describe('parseMarkdown', () => {
  it('should parse variables and convert to YAML', () => {
    const markdownText = `
### My project configuration \`:prproject\`

\`\`\`text
My project is about:

[[Fully detailed explanation]]
\`\`\`
`;

    const espansoConfig = parseMarkdown(markdownText);
    const yamlContent = convertToYaml(espansoConfig);

    expect(yamlContent).toMatch(/trigger: ':prproject'/);
    expect(yamlContent).toMatch(/multiline: true/);
  });

  it('should parse triggers and forms from markdown', () => {
    const markdownText = `
# Espanso config file generation from markdown prompts

## Global dev prompts

### Who am I? \`:prtsme\`

\`\`\`text
I am a senior software engineer on JavaScript but I prefer to use TypeScript.
\`\`\`
`;

    const result = parseMarkdown(markdownText);
    expect(result).toEqual([
      {
        trigger: 'prtsme',
        form: 'I am a senior software engineer on JavaScript but I prefer to use TypeScript.\n',
        variables: [],
      },
    ]);
  });

  // Additional tests for variables and other cases will go here
});