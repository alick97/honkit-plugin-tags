const fs = require('fs');
const _tags = {}

module.exports = {
  blocks: {
    tag: {
      process: function(block) {
        const { ctx } = this;
        const { page, file }  = ctx.ctx;
        console.log(page.title, file.path)
        const [key, value] = block.args;

        if (!_tags[key]) {
          _tags[key] = {};
        }
        if (!_tags[key][value]) {
          _tags[key][value] = [];
        }
        _tags[key][value].push({
          title: page.title,
          path: file.path
        })
        const t = `${key}: ${value}`;
        // console.log(t)
        return t;
      }
    }
  },

  hooks: {
    'finish:before': function() {
      // console.log('end==========', _tags)
      let tocContent = '\n---\n\n* [tags]()';
       
      const _t = "    "
      for (const [key, values] of Object.entries(_tags)) {
        tocContent += `\n${_t}* [${key}]()`;
        for (const [v, items] of Object.entries(values)) {
          tocContent += `\n${_t}${_t}* ${v}`;
          for (const i of items) {
            tocContent += `\n${_t}${_t}${_t}* [${i['title']}](${i['path']})`
          }
        }
      }
      // console.log(tocContent)
      
      // Read existing SUMMARY.md if it exists
      const summaryPath = this.resolve('SUMMARY.md');
      let existingContent = '';
      try {
        existingContent = fs.readFileSync(summaryPath, 'utf8');
      } catch (error) {
        if (error.code !== 'ENOENT') { // File not found is expected if it's the first run
          console.error('Error reading SUMMARY.md:', error);
        }
      }
      // Append new content to existing content
      let combinedContent = existingContent + '\n' + tocContent;
      fs.writeFileSync(summaryPath, combinedContent);
    },
  },
};
