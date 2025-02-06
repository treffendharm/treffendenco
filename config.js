module.exports = {
  styles: [
    {
      input: 'src/scss/main.scss',
      output: 'dist/css/main.css'
    },
    {
      input: 'src/blocks/**/style.scss',
      output: 'dist/css/blocks/[name].css'
    }
  ]
}; 