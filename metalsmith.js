var process = require('process');

var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var inplace     = require('metalsmith-in-place');
var permalinks  = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');
var sass        = require('metalsmith-sass');


var Handlebars = require('handlebars');

const fs        = require('fs');
var showdown    = require('showdown');

var employees = require("./employees.json");
var teaserImagePathTemplate = Handlebars.compile('/assets/images/about_us/teaser_image/{{namespace}}.jpg');

Handlebars.registerHelper("getEmployeeModalId", function( employee ) {
  var id = employee.namespace.replace(/[^a-zA-Z]/g, '_');

  return id;
});
Handlebars.registerHelper("getEmployeeTeaserImage", function( employee ) {
  return teaserImagePathTemplate(employee);
});


Handlebars.registerHelper("renderTeamMember", function ( name ) {

  let content = 'file was not read';
  // First I want to read the file

  content = fs.readFileSync('./src/aboutus/member_profiles/' + name + '.md');
  content = content.toString();
  const converter = new showdown.Converter({parseImgDimensions: true});
  const descriptionHtml = converter.makeHtml(content);

  return descriptionHtml;

//function processFile() {
//    console.log(content);
//}



  // name e.g. "nicole.jones"

  // Load MD file for `name`
  //content = loadFile("./src/path/to/member_profiles/" + name + ".md")
  //bioHtml = convertMDtoHTML(content);

  // html = `<div class="modal" id="${name}">${bioHtml}</div>`
  // html = '<div class="modal" id="' + name + '">' + bioHtml + '</div>'

});





//
// Let's build!
//

var app =
  Metalsmith(__dirname)
    .metadata({
      title: "5Minds",
      copyright_year: new Date().year,
      employees: employees
    })
    .source('./src')
    .destination(process.env.BUILD_DIR || './_site')
    .clean(true)
    .use(permalinks())
    .use(markdown())
    .use(inplace({
      engine: 'handlebars',
      pattern: '**/*.{md,html}'
    }))
    .use(layouts({
      engine: 'handlebars',
      partials: 'layouts',
      pattern: "**/*.{md,html}"
    }))
    .use(sass())

if (module.parent) {
  module.exports = app
} else {
  app.build(function (err) { if (err) throw err })
}
