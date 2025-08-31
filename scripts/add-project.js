#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../content');
const projectsManifestPath = path.join(contentDir, 'projects.json');

function addProjectToManifest(slug, title, year, role, client, summary, filename) {
  // Read current manifest
  const manifest = JSON.parse(fs.readFileSync(projectsManifestPath, 'utf8'));
  
  // Add new project entry
  const newProject = {
    slug,
    title,
    year,
    role,
    client,
    summary,
    file: filename
  };
  
  manifest.push(newProject);
  
  // Write back to file
  fs.writeFileSync(projectsManifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`✅ Added project "${title}" to projects.json`);
}

function createProjectFile(filename, slug, title) {
  const projectFilePath = path.join(contentDir, filename);
  
  const projectTemplate = {
    slug,
    title,
    year: "",
    role: "",
    client: "",
    summary: "",
    description: "",
    technologies: [],
    elements: [],
    thumbnails: [],
    cover: {
      public_id: "",
      kind: "image",
      alt: `${title} cover`
    }
  };
  
  fs.writeFileSync(projectFilePath, JSON.stringify(projectTemplate, null, 2));
  console.log(`✅ Created project file: content/${filename}`);
}

function updateContentFile(filename, slug) {
  const contentFilePath = path.join(__dirname, '../lib/content.ts');
  let content = fs.readFileSync(contentFilePath, 'utf8');
  
  // Add import
  const importName = slug.replace(/-/g, '') + 'Data';
  const importStatement = `import ${importName} from '@/content/${filename}'`;
  
  // Find the last import and add after it
  const importRegex = /import .* from '\/\/content\/.*\.json'/g;
  const imports = content.match(importRegex);
  if (imports && imports.length > 0) {
    const lastImport = imports[imports.length - 1];
    const lastImportIndex = content.lastIndexOf(lastImport) + lastImport.length;
    content = content.slice(0, lastImportIndex) + '\n' + importStatement + content.slice(lastImportIndex);
  }
  
  // Add to projectFiles map
  const mapEntry = `  '${filename}': ${importName},`;
  const mapRegex = /const projectFiles: Record<string, any> = \{[\s\S]*?\}/;
  content = content.replace(mapRegex, (match) => {
    return match.replace(/\}$/, `  ${mapEntry}\n}`)
  });
  
  fs.writeFileSync(contentFilePath, content);
  console.log(`✅ Updated lib/content.ts with import and map entry`);
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 6) {
    console.log('Usage: node add-project.js <slug> <title> <year> <role> <client> <summary>');
    console.log('Example: node add-project.js "my-project" "My Project" "12/24" "Creative Director" "Client Name" "Project summary"');
    process.exit(1);
  }
  
  const [slug, title, year, role, client, summary] = args;
  const filename = `${slug}.json`;
  
  try {
    addProjectToManifest(slug, title, year, role, client, summary, filename);
    createProjectFile(filename, slug, title);
    updateContentFile(filename, slug);
    
    console.log('\n🎉 Project setup complete!');
    console.log(`📁 Edit content/${filename} to add your project details`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = { addProjectToManifest, createProjectFile, updateContentFile };
