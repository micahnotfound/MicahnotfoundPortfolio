# Project Management Scripts

This directory contains utility scripts to help manage your portfolio projects.

## add-project.js

A script to automatically add new projects to your portfolio.

### Usage

```bash
node scripts/add-project.js <slug> <title> <year> <role> <client> <summary>
```

### Example

```bash
node scripts/add-project.js "new-project" "My New Project" "12/24" "Creative Director" "Client Name" "An amazing new project"
```

### What it does

1. **Adds project to manifest**: Updates `content/projects.json` with the new project metadata
2. **Creates project file**: Generates `content/new-project.json` with a template structure
3. **Updates content loader**: Modifies `lib/content.ts` to import and include the new project file

### After running the script

1. Edit the generated `content/new-project.json` file to add your project details
2. Add your media assets (images, videos) to Cloudinary
3. Update the `public_id` fields in the JSON with your Cloudinary asset IDs

### Project file structure

Each project file should follow this structure:

```json
{
  "slug": "project-slug",
  "title": "Project Title",
  "year": "12/24",
  "role": "Creative Director",
  "client": "Client Name",
  "summary": "Brief project summary",
  "description": "Detailed project description",
  "technologies": ["Tech 1", "Tech 2"],
  "elements": [
    {
      "name": "Element Name",
      "detail": [
        {
          "public_id": "cloudinary_asset_id",
          "kind": "image",
          "alt": "Alt text"
        }
      ],
      "profile": [
        {
          "public_id": "cloudinary_asset_id",
          "kind": "image",
          "alt": "Alt text"
        }
      ]
    }
  ],
  "thumbnails": [
    {
      "public_id": "cloudinary_asset_id",
      "kind": "image",
      "alt": "Alt text"
    }
  ],
  "cover": {
    "public_id": "cloudinary_asset_id",
    "kind": "image",
    "alt": "Cover image alt text"
  }
}
```

## Benefits of this approach

- **IDE Performance**: Keeps individual project files small, preventing IDE lag
- **Maintainability**: Each project is in its own file, making it easy to edit
- **Scalability**: Can handle hundreds of projects without performance issues
- **Version Control**: Individual project changes are easier to track in git
- **Collaboration**: Multiple people can work on different projects simultaneously
