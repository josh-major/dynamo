# Pages Templating Environment

This is a general purpose and re-usable environment for creating Handlebars templates for the GetLocal platform.

### General Process

You should receive access to design comps and a JSON data file.

1. Clone this project
2. Run `npm i` to install all necessary dependencies.
3. Run `gulp` to start the browser-sync and nodemon processes.
4. A browser should open and display the example site.
5. Review how the templating system and helpers work.
6. Name the JSON data file `pages.json` and place it in the `./data/` directory.
7. Review the `pages.json` data for which pages will be available based on the defined `url` values.
8. The browser will automatically reload when changes are detected.
  - The process may error due to the data no longer matching the markup.
9. Implement the HBS (HTML), CSS, and JS necessary to match the design comps.
10. Remove all unused default template files, scripts, and CSS.
11. Validate the rendered HTML using validator.w3.org.
12. Package the deliverables based on the `Asset Delivery` section below.

### Required Best Practices

For comprehension, future proofing, and maintainability, please follow the following best practices.

1. Use `/assets/dist/` as the base for media references.
2. Use the `{{#articleBody}}` helper to avoid hard coding numbers in variables (unless in `{{#if}}` helpers).
3. Attempt to only use partials to coordinate with comp modules.
4. Do not nest partials if the template allows.
5. Use 2 spaces for indentation.
6. Consistently dash-case name partials.
7. Name partials after comp variable groups where possible.
  a. Place variable group references in the name first, so similar partials are grouped on the filesystem.
8. Avoid hard coding any user visible text (expect variables).
9. Utilize triple brackets for all articleBody driven output, except in HTML attributes.
10. Do not duplicate content for responsive, unless responsive variables are provided.

### Page Rendering

The `pages.json` should represent an array of objects.
Each object should have a `url` property that defines the development URL the page will be viewable at.

The `potentialAction` property of each object should be an array of objects.
The object with a `name` property set to "renderHTML" will have an `assembly` property that defines which file in the `/templates/` folder will be used for rendering the page.

### Variable Naming Conventions

All user visible text content on GetLocal sites is intended to be driven via data.
In other words, no user visible text should be hard coded in templates.

The variable names for each section of text is defined via the layer names of the design comps.
There are a few conventions that those layer names should follow:

- Layer names ending with `-#` indicate a repeating element or list.
- Layer names ending with `-#-#` indicate nested repeating elements, such as:
  - Paragraphs and sentence offsets, in that order.
  - Submenu and submenu item offsets, in that order.
  - Columnar link sets and set items, in that order.
  - \* **Note: The comps will have # placeholders, but the data will contain actual numbers**
- Layer names containing `anchor-text` indicate that a URL will be provided in another variable containing `link` in place of `anchor-text`.

The majority of variables should be output with HTML support (three curly brackets).
The exception to this is any value output within an HTML element attribute (like `href`).

### Asset Delivery

Once the HBS (HTML), CSS, and JS are in place to match the design comps, please package the created files.
Only the `/templates/` and `/assets/` directories should need to be delivered.

A zip file of the `/templates/` and `/assets/` directories is the expected delivery format.

### Built-in Helper Documentation

All helpers from the `handlebars-helpers` npm library are available in the server side rendering engine:

https://github.com/helpers/handlebars-helpers

Additionally, the following built-in helpers are available to assist with templating the GetLocal CMS data structure.

#### {{#articleBody}}

This helper is intended to assist with the `-#` and `-#-#` variable naming conventions.

The only argument is a required variable prefix to group and iterate over.
It works by finding all `articleBody` properties that begin with the provided prefix, creating sets based on the first number encountered after the prefix, and iterative over those sets.

It can be used in a nested manner if mulitple offsets (`-#-#`) are needed for paragraphs or submens.

An example of its use can be found in `/templates/partials/content.hbs`.

#### {{#combineLinks}}

This block helper is intended to allow for overriding or appending to a custom set of links with data driven links.

The arguments are:

1. links
  - The array of data driven links
2. prefix
  - The prefix for a set of properties in the `articleBody` that contain the custom links following the `anchor-text`/`link` convention.

An example of its use can be found in `/templates/partials/links.hbs`.

#### {{renderCanonical}}

This is a simple placeholder helper that should be inlcuded in a canonical tag in the `<head>`.

#### {{#withGroupFilter}}

This block helper assists with organizing arrays of objects for grouped list based output.

The arguments are:
1. list
  - The array of objects to group
2. property
  - The dot-notated property of each object to group by

The helper iterates over the list of objects and creates an array for each unique value found with the dot-notated property.
Each array will contain the objects that have matching property values.
It then iterates over each grouped set.
Use of the built-in `{{#each}}` helper is still likely needed to iterate over the items within each group.

An example of its use can be found in `/templates/partials/form.hbs`

