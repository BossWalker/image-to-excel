const getPixels = require('get-pixels');
const fs = require('fs');

const [, , ...args] = process.argv;
if (args.length !== 1) {
  console.log('Required Format: node index.js imageName.png');
  process.exit();
}
const ImageName = args[0];

const RGBtoHex = (r, g, b) => {
  // Can be used to modify input image
  // r = parseInt(127+(r * 0.5), 10);
  // g = parseInt(127+(g * 0.5), 10);
  // b = parseInt(127+(b * 0.5), 10);
  let rh = r.toString(16);
  rh = (rh.length === 2 ? rh : `0${rh}`);
  let gh = g.toString(16);
  gh = (gh.length === 2 ? gh : `0${gh}`);
  let bh = b.toString(16);
  bh = (bh.length === 2 ? bh : `0${bh}`);
  return `#${rh}${gh}${bh}`;
};

getPixels(ImageName, (err, pixels) => {
  if (err) {
    console.log('Bad image path');
    process.exit();
  }
  // ////////////////////////////////////////////////
  // Read Image data
  // ////////////////////////////////////////////////
  const startTime = new Date();
  console.log('Loaded pixel data');
  const imageWidth = pixels.shape[0];
  const imageHeight = pixels.shape[1];
  const pixelCount = imageHeight * imageWidth;
  const pixelLength = pixels.data.length;
  if (pixelCount * 4 !== pixelLength) {
    console.log('Alpha channel required!');
    process.exit();
  }
  // ////////////////////////////////////////////////
  // Create list of unique styles (optimization)
  // ////////////////////////////////////////////////
  console.log('Finding Unique Styles');
  const styles = [];
  const pixelData = [];
  let lastPercent = 0;
  for (let y = 0; y < imageHeight; y += 1) {
    pixelData[y] = [];
    const percent = parseInt((y / imageHeight) * 100, 10);
    if (percent !== lastPercent) {
      lastPercent = percent;
      console.log(`${percent}%...`);
    }
    for (let x = 0; x < imageWidth; x += 1) {
      const pixelOffset = (x * 4) + (y * imageWidth * 4);
      const r = pixels.data[pixelOffset + 0];
      const g = pixels.data[pixelOffset + 1];
      const b = pixels.data[pixelOffset + 2];
      const style = RGBtoHex(r, g, b);
      const styleIndex = styles.indexOf(style);
      if (styleIndex === -1) {
        styles.push(style);
        pixelData[y][x] = styles.length - 1;
      } else {
        pixelData[y][x] = styleIndex;
      }
    }
  }
  // ////////////////////////////////////////////////
  // Create Output File
  // ////////////////////////////////////////////////
  let contents = `<?xml version="1.0"?>
  <?mso-application progid="Excel.Sheet"?>
  <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
   xmlns:o="urn:schemas-microsoft-com:office:office"
   xmlns:x="urn:schemas-microsoft-com:office:excel"
   xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
   xmlns:html="http://www.w3.org/TR/REC-html40">
   <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Author>Super Awesome Generator</Author>
    <LastAuthor>Super Awesome Generator</LastAuthor>
    <Created>${startTime.toISOString()}</Created>
    <LastSaved>${startTime.toISOString()}</LastSaved>
    <Version>16.00</Version>
   </DocumentProperties>
   <OfficeDocumentSettings xmlns="urn:schemas-microsoft-com:office:office">
    <AllowPNG/>
   </OfficeDocumentSettings>
   <ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">
    <WindowHeight>6420</WindowHeight>
    <WindowWidth>18090</WindowWidth>
    <WindowTopX>0</WindowTopX>
    <WindowTopY>0</WindowTopY>
    <ProtectStructure>False</ProtectStructure>
    <ProtectWindows>False</ProtectWindows>
   </ExcelWorkbook>
   <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
     <Alignment ss:Vertical="Bottom"/>
     <Borders/>
     <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
     <Interior/>
     <NumberFormat/>
     <Protection/>
    </Style>
    `;
  for (let i = 0, l = styles.length; i < l; i += 1) {
    const style = styles[i];
    contents += `<Style ss:ID="s${i}">
      <Interior ss:Color="${style}" ss:Pattern="Solid"/>
      </Style>
      `;
  }
  contents += `</Styles>
   <Worksheet ss:Name="Sheet1">
    <Table ss:ExpandedColumnCount="${imageWidth}" ss:ExpandedRowCount="${imageHeight}" x:FullColumns="1"
     x:FullRows="1" ss:DefaultRowHeight="48">
     `;
  for (let y = 0, l = imageHeight; y < l; y += 1) {
    contents += '<Row>\r\n';
    for (let x = 0, l2 = imageWidth; x < l2; x += 1) {
      contents +=
        `<Cell ss:StyleID="s${pixelData[y][x]}"/>
        `;
    }
    contents += `</Row>
    `;
  }
  contents += `</Table>
    <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
     <PageSetup>
      <Header x:Margin="0.3"/>
      <Footer x:Margin="0.3"/>
      <PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>
     </PageSetup>
     <Selected/>
     <Panes>
      <Pane>
       <Number>3</Number>
       <ActiveRow>2</ActiveRow>
       <RangeSelection>R3C1:R3C3</RangeSelection>
      </Pane>
     </Panes>
     <ProtectObjects>False</ProtectObjects>
     <ProtectScenarios>False</ProtectScenarios>
    </WorksheetOptions>
   </Worksheet>
  </Workbook>
  `;
  // ////////////////////////////////////////////////
  // Write File To Disk
  // ////////////////////////////////////////////////
  const endTime = new Date();
  console.log(`Conversion took ${Math.abs(startTime - endTime)}ms`);
  fs.writeFile('Output.xml', contents, (writeErr) => {
    if (writeErr) {
      return console.log(writeErr);
    }
    console.log('Output.xml Created Successfully!');
    return null;
  });
});
