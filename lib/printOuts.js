
const promptUser = require('./employee');

const welcome = () => {

  console.log(`
  ██████╗ █████╗ ███╗   ███╗██████╗ ██████╗ ███████╗██╗     ██╗         ██████╗ ██████╗     ███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗██████╗ 
  ██╔════╝██╔══██╗████╗ ████║██╔══██╗██╔══██╗██╔════╝██║     ██║         ██╔══██╗██╔══██╗    ████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗
  ██║     ███████║██╔████╔██║██████╔╝██████╔╝█████╗  ██║     ██║         ██║  ██║██████╔╝    ██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  ██████╔╝
  ██║     ██╔══██║██║╚██╔╝██║██╔═══╝ ██╔══██╗██╔══╝  ██║     ██║         ██║  ██║██╔══██╗    ██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██╔══██╗
  ╚██████╗██║  ██║██║ ╚═╝ ██║██║     ██████╔╝███████╗███████╗███████╗    ██████╔╝██████╔╝    ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗██║  ██║
  ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝     ╚═════╝ ╚══════╝╚══════╝╚══════╝    ╚═════╝ ╚═════╝     ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝
  `);

  // Prompts
  return promptUser();
}

module.exports = welcome;