const HTML5ToPDF = require("html5-to-pdf")
const path = require("path")
const ejs = require('ejs')
const fs = require('fs')
const utils = require('util')
const readFile = utils.promisify(fs.readFile)

let data = { // Dummy data 
  address: {
      restaurantName: "Bilmem ne restorani",
      specification: "bilmem ne sokak / bilmem nemahallesi",
      postcode: "123456"
  },
  invoice: {
      date: "02/01/2021",
      no: "1001"
  },
  wasteOil: {
      code: "123213213123",
      liters: "20",
      payment: 999.81
  },
  barrelSizesList: [
      5,10,100
  ],
  productsList: [
      "bu yag","su yag","az yag"
  ],
  qtyList: [
      1,4,1
  ],
  priceList: [
      10, 19, 88.77
  ],
  totalPrice: 999
};

async function getInvoiceTemplate() {
  console.log("Loading template file in memory")
  try {
      const invoicePath = path.resolve("./assets/invoiceTemplate.ejs"); // Invoice template path.
      return await readFile(invoicePath, 'utf8');
  } catch (err) {
      return Promise.reject("Could not load html template. ERROR: \n", err);
  }
}

const run = async () => {
    await getInvoiceTemplate()
      .then(async (res) => {
        console.log("Compiling the template with ejs")
        const ejsTemplate = ejs.compile(res);
        // we have compile our code with ejs
        const result = ejsTemplate(data);
        // We can use this to add dyamic data to our ejs template at run time from database or API as per need.
        const html = result;
        console.log(result)
        // we are using ejs mode 

        const html5ToPDF = new HTML5ToPDF({
          inputBody: html,
          outputPath: path.join(__dirname, "output.pdf"),
          templatePath: path.join(__dirname, "templates", "basic"),
          include: [
            path.join(__dirname, "assets", "styles.css"),
          ],
        })
        await html5ToPDF.start()
        await html5ToPDF.build()
        await html5ToPDF.close()
      })  
}
 
(async () => {
  try {
    await run()
    console.log("\n-----------\nDONE!\n-----------\n")
  } catch (error) {
    // console.error(error)
    process.exitCode = 1
  } finally {
    process.exit();
  }
})()