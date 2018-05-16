![](https://bosswalker.github.io/image-to-excel/docs/logo-small.png)
# image-to-excel
>image-to-excel is a Node powered script that can convert the pixel data from an image to cell  background colors in Microsoft® Excel®. It is optimized to save the pixel data for only unique color values. The output is in Excel XML Format.

## Quickstart
1. Clone the repo
2. Open a console and navigate to the scripts directory
3. run "npm install" to download dependencies
4. Save an image to the same folder as the script
5. Run the script with the image as the first argument "node index.js image.png"
6. Open the output "output.xml" in Microsoft® Excel®.

## Example Usage
    node index.js imageFile.png
    
## Example Output
![](https://bosswalker.github.io/image-to-excel/docs/image.png)
![](https://bosswalker.github.io/image-to-excel/docs/screenshot.png)
![](https://bosswalker.github.io/image-to-excel/docs/screenshot2.png)

## Example Download for Microsoft® Excel®
Spreadsheet: https://bosswalker.github.io/image-to-excel/docs/Output.xlsx

## Image Support
It is recommended to use smaller images as larger images can slow-down or crash Microsoft® Excel®. Recommended image sizes are \< 256px width and \< 256px height (The script can handle basically any size, but Microsoft® Excel® make take forever to load it). Be advised Microsoft® Excel® can sometimes hang at "Opening output.xml 0%" until it jumps to "Opening output.xml 100%"; if it doesn't crash it's still loading.

The following have been tested and working:
 - PNG (4 channel)
 - JPG (4 Channel)
 - JPEG (4 Channel)

## Technologies
 - Javascript
 - NodeJS
 - NPM

## Why this project
I often like to work on "fun" projects that will further expand my knowledge and create something awesome in the process and this is one of those projects.

## License
Free for non-commercial use.